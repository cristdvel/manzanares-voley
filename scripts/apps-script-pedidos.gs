/**
 * Apps Script del registro de pedidos de la tienda (Manzanares Voley).
 *
 * Este archivo NO se ejecuta desde el repo: es el código que hay que pegar
 * en el editor de Apps Script de la hoja de Google Sheets donde se guardan
 * los pedidos. Instrucciones completas en DEPLOY.md §6.
 *
 * Recibe (POST, JSON) desde functions/api/pedido.ts:
 *   { numero, nombre, email, telefono, notas,
 *     pedido: [{ nombre, variante, talla, cantidad }, ...],
 *     comprobante: { nombre, tipo, base64 } }
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
const CABECERA = [
  "Nº Pedido",
  "Fecha",
  "Nombre",
  "Email",
  "Teléfono",
  "Pedido",
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

    const lineas = (data.pedido || [])
      .map((l) => `${l.nombre} · ${l.variante || "—"} · Talla ${l.talla || "—"} × ${l.cantidad}`)
      .join("\n");

    hoja.appendRow([
      numero,
      new Date(),
      data.nombre || "",
      data.email || "",
      data.telefono || "",
      lineas,
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
  } else if (hoja.getRange(1, 1).getValue() !== CABECERA[0]) {
    // La hoja ya existía con una cabecera de una versión anterior del
    // script (p. ej. sin "Nº Pedido"): la reescribe para que no se
    // desalineen las columnas con los datos nuevos.
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
