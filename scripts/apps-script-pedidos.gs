/**
 * Apps Script del registro de pedidos de la tienda (Manzanares Voley).
 *
 * Este archivo NO se ejecuta desde el repo: es el código que hay que pegar
 * en el editor de Apps Script de la hoja de Google Sheets donde se guardan
 * los pedidos. Instrucciones completas en DEPLOY.md §6.
 *
 * Recibe (POST, JSON) desde functions/api/pedido.ts:
 *   { nombre, email, telefono, notas,
 *     pedido: [{ nombre, variante, talla, cantidad }, ...],
 *     comprobante: { nombre, tipo, base64 } }
 *
 * Por cada pedido:
 *   - añade una fila a la hoja "Pedidos" (la crea la primera vez, con cabecera)
 *   - guarda el comprobante en una carpeta de Drive y pone el enlace en la fila
 *   - dos columnas quedan libres para uso del club: "Estado" y "Comentario"
 */

const HOJA = "Pedidos";
const CARPETA_COMPROBANTES = "Comprobantes Tienda Manzanares";
const CABECERA = [
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

    const comprobanteUrl = data.comprobante && data.comprobante.base64
      ? guardarComprobante(data.comprobante)
      : "";

    const lineas = (data.pedido || [])
      .map((l) => `${l.nombre} · ${l.variante || "—"} · Talla ${l.talla || "—"} × ${l.cantidad}`)
      .join("\n");

    hoja.appendRow([
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

    return respuesta({ ok: true });
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
  }
  return hoja;
}

function guardarComprobante(comprobante) {
  const carpetas = DriveApp.getFoldersByName(CARPETA_COMPROBANTES);
  const carpeta = carpetas.hasNext() ? carpetas.next() : DriveApp.createFolder(CARPETA_COMPROBANTES);
  const bytes = Utilities.base64Decode(comprobante.base64);
  const blob = Utilities.newBlob(bytes, comprobante.tipo || "application/octet-stream", comprobante.nombre || "comprobante");
  const file = carpeta.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
