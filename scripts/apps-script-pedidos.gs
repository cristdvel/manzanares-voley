/**
 * Apps Script del registro de pedidos de la tienda (Manzanares Voley).
 *
 * Este archivo NO se ejecuta desde el repo: es el código que hay que pegar
 * en el editor de Apps Script de la hoja de Google Sheets donde se guardan
 * los pedidos. Instrucciones completas en DEPLOY.md §6.
 *
 * Recibe (POST, JSON) desde functions/api/pedido.ts:
 *   { numero, nombre, email, telefono, equipo, notas,
 *     pedido: [{ nombre, variante, talla, tallas, cantidad }, ...],
 *     comprobante: { nombre, tipo, base64 } }
 *
 * "tallas" trae la talla desglosada por prenda, p. ej.
 * { "Camiseta de juego": "L", "Camiseta de entreno": "M" } para un pack, o
 * { "Malla": "M" } para un artículo suelto — cada prenda tiene su propia
 * columna (ver PRENDAS), no hay columna "Talla" genérica.
 *
 * "numero" es el nº de pedido (p. ej. "MZV260915-4821"), generado ya en la
 * función de Cloudflare — se usa tal cual como primera columna de la hoja
 * y como nombre del archivo del comprobante en Drive.
 *
 * Por cada pedido:
 *   - añade una fila a la hoja "Pedidos" (la crea la primera vez, con cabecera)
 *   - guarda el comprobante en una carpeta de Drive con el nº de pedido como
 *     nombre de archivo, y pone el enlace en la fila
 *   - dos columnas quedan libres para uso del club: "Estado" y "Comentario"
 */

const HOJA = "Pedidos";
const CARPETA_COMPROBANTES = "Comprobantes Tienda Manzanares";

// Toda prenda que puede llevar talla, tanto en los packs (ver tallasPack en
// src/data/productos.ts) como en los artículos sueltos (ver el campo
// "prenda" de cada producto): cada una tiene su propia columna en vez de
// una columna "Talla" genérica. Si el club añade un pack o artículo con una
// prenda nueva, se añade aquí su etiqueta tal cual la genera [slug].astro.
const PRENDAS = [
  "Camiseta de juego",
  "Camiseta de entreno",
  "Camiseta de calentamiento",
  "Malla",
  "Pantalón",
  "Sudadera",
  "Abrigo",
  "Mochila",
];

const CABECERA = [
  "Nº Pedido",
  "Fecha",
  "Nombre",
  "Email",
  "Teléfono",
  "Equipo",
  "Producto",
  "Variante",
  ...PRENDAS,
  "Cantidad",
  "Notas del cliente",
  "Comprobante",
  "Estado",
  "Comentario interno",
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const hoja = obtenerHoja();
    const numero = data.numero || "";

    const comprobanteUrl = data.comprobante && data.comprobante.base64
      ? guardarComprobante(data.comprobante, numero)
      : "";

    // Solo se pide un producto por pedido, así que basta con la primera línea.
    const linea = (data.pedido || [])[0] || {};
    const tallas = linea.tallas || {};
    const columnasPrendas = PRENDAS.map((p) => tallas[p] || "");

    hoja.appendRow([
      numero,
      new Date(),
      data.nombre || "",
      data.email || "",
      data.telefono || "",
      data.equipo || "",
      linea.nombre || "",
      linea.variante || "",
      ...columnasPrendas,
      linea.cantidad || "",
      data.notas || "",
      comprobanteUrl,
      "Pendiente",
      "",
    ]);

    return respuesta({ ok: true, numero: numero });
  } catch (err) {
    return respuesta({ ok: false, error: String(err) });
  }
}

function obtenerHoja() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(HOJA);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA);
    hoja.appendRow(CABECERA);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, CABECERA.length).setFontWeight("bold");
  } else if (hoja.getRange(1, 1, 1, CABECERA.length).getValues()[0].join("|") !== CABECERA.join("|")) {
    // La hoja ya existía con una cabecera de una versión anterior del
    // script (p. ej. sin las columnas por prenda): la reescribe para que
    // no se desalineen las columnas con los datos nuevos.
    hoja.getRange(1, 1, 1, CABECERA.length).setValues([CABECERA]);
    hoja.getRange(1, 1, 1, CABECERA.length).setFontWeight("bold");
  }
  return hoja;
}

function guardarComprobante(comprobante, numero) {
  const carpetas = DriveApp.getFoldersByName(CARPETA_COMPROBANTES);
  const carpeta = carpetas.hasNext() ? carpetas.next() : DriveApp.createFolder(CARPETA_COMPROBANTES);
  const bytes = Utilities.base64Decode(comprobante.base64);
  // El nombre ya viene con el nº de pedido y su extensión desde Cloudflare
  // (p. ej. "MZV260915-4821.jpg"); si por lo que sea no llega, usamos el
  // nombre original del archivo como respaldo.
  const nombreArchivo = numero
    ? (comprobante.nombre || numero)
    : (comprobante.nombre || "comprobante");
  const blob = Utilities.newBlob(bytes, comprobante.tipo || "application/octet-stream", nombreArchivo);
  const file = carpeta.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
