/**
 * Apps Script del registro de pedidos e inscripciones (Manzanares Voley).
 *
 * Este archivo NO se ejecuta desde el repo: es el código que hay que pegar
 * en el editor de Apps Script de la hoja de Google Sheets donde se guardan
 * los pedidos y las inscripciones. Instrucciones completas en DEPLOY.md
 * §6 (pedidos) y §9 (inscripciones) — ambos usan la misma URL de Web App.
 *
 * Recibe (POST, JSON) de dos posibles orígenes, distinguidos por "tipo":
 *
 * 1) functions/api/pedido.ts (tipo ausente = pedido, por compatibilidad):
 *      { numero, nombre, email, telefono, equipo, notas,
 *        pedido: [{ nombre, variante, talla, tallas, cantidad }, ...],
 *        comprobante: { nombre, tipo, base64 } }
 *    "tallas" trae la talla desglosada por prenda, p. ej.
 *    { "Camiseta de juego": "L", "Camiseta de entreno": "M" } para un pack,
 *    o { "Malla": "M" } para un artículo suelto — cada prenda tiene su
 *    propia columna (ver PRENDAS), no hay columna "Talla" genérica.
 *    "numero" es el nº de pedido (p. ej. "MZV260915-4821"), generado ya en
 *    la función de Cloudflare — se usa tal cual como primera columna de la
 *    hoja "Pedidos" y como nombre del archivo del comprobante en Drive.
 *
 * 2) functions/api/inscripcion.ts (tipo: "inscripcion"):
 *      { tipo: "inscripcion", nombre, dob, categoria, tutor, telefono,
 *        email, experiencia, imagenes }
 *    Se añade a la hoja "Inscripciones".
 *
 * Cada hoja se crea sola la primera vez, con cabecera en negrita y fila
 * congelada; si la cabecera existente no coincide con la de este script
 * (por una versión anterior), se reescribe para que no se desalineen las
 * columnas. En "Pedidos", el comprobante se guarda además en una carpeta de
 * Drive con el nº de pedido como nombre de archivo.
 */

const HOJA_PEDIDOS = "Pedidos";
const HOJA_INSCRIPCIONES = "Inscripciones";
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

const CABECERA_PEDIDOS = [
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

const CABECERA_INSCRIPCIONES = [
  "Fecha",
  "Jugador/a",
  "Fecha de nacimiento",
  "Categoría orientativa",
  "Padre/madre/tutor",
  "Teléfono",
  "Email",
  "Experiencia previa",
  "Autoriza imágenes",
  "Estado",
  "Comentario interno",
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.tipo === "inscripcion") {
      return registrarInscripcion(data);
    }
    return registrarPedido(data);
  } catch (err) {
    return respuesta({ ok: false, error: String(err) });
  }
}

function registrarPedido(data) {
  const hoja = obtenerOCrearHoja(HOJA_PEDIDOS, CABECERA_PEDIDOS);
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
}

function registrarInscripcion(data) {
  const hoja = obtenerOCrearHoja(HOJA_INSCRIPCIONES, CABECERA_INSCRIPCIONES);

  hoja.appendRow([
    new Date(),
    data.nombre || "",
    data.dob || "",
    data.categoria || "",
    data.tutor || "",
    data.telefono || "",
    data.email || "",
    data.experiencia || "",
    data.imagenes ? "Sí" : "No",
    "Pendiente",
    "",
  ]);

  return respuesta({ ok: true });
}

function obtenerOCrearHoja(nombreHoja, cabecera) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(nombreHoja);
  if (!hoja) {
    hoja = ss.insertSheet(nombreHoja);
    hoja.appendRow(cabecera);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, cabecera.length).setFontWeight("bold");
  } else if (hoja.getRange(1, 1, 1, cabecera.length).getValues()[0].join("|") !== cabecera.join("|")) {
    // La hoja ya existía con una cabecera de una versión anterior del
    // script: la reescribe para que no se desalineen las columnas con los
    // datos nuevos.
    hoja.getRange(1, 1, 1, cabecera.length).setValues([cabecera]);
    hoja.getRange(1, 1, 1, cabecera.length).setFontWeight("bold");
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
