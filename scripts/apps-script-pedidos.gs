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
 *
 * NI los pedidos NI las inscripciones mandan ya un email individual al
 * club — la única vía para enterarse es esta hoja. En su lugar:
 *
 *  - Cada fila nueva se marca en naranja con letra blanca (columna "Estado"
 *    en "Pendiente" por defecto) y lleva un desplegable: "Pendiente" →
 *    "Pedido" (en Pedidos) o "Pendiente" → "Contactado" (en Inscripciones).
 *    En cuanto se cambia el desplegable al segundo valor, esa fila vuelve
 *    al formato normal sola (ver onEdit). Si se vuelve a poner en
 *    "Pendiente", se resalta otra vez.
 *  - Los lunes, miércoles y viernes a las 8:00, enviarResumenPeriodico()
 *    manda SIEMPRE un correo a manzanaresvoley@gmail.com con el enlace a
 *    cada pestaña de la hoja online (sin Excel adjunto): si hubo pedidos o
 *    inscripciones nuevas desde el último resumen, dice cuántas; si no hubo
 *    ninguna, lo dice también (no se queda callado). Hay que ejecutar
 *    configurarTriggers() una vez a
 *    mano desde el editor para programarlo — ver DEPLOY.md §6.3.
 */

const HOJA_PEDIDOS = "Pedidos";
const HOJA_INSCRIPCIONES = "Inscripciones";
const CARPETA_COMPROBANTES = "Comprobantes Tienda Manzanares";
const DESTINATARIO_RESUMEN = "manzanaresvoley@gmail.com";

const COLOR_PENDIENTE_FONDO = "#DC3C14";
const COLOR_PENDIENTE_TEXTO = "#FFFFFF";

const ESTADOS_PEDIDOS = ["Pendiente", "Pedido"];
const ESTADO_PEDIDO_RESUELTO = "Pedido";
const ESTADOS_INSCRIPCIONES = ["Pendiente", "Contactado"];
const ESTADO_INSCRIPCION_RESUELTO = "Contactado";

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
  const hoja = obtenerOCrearHoja(HOJA_PEDIDOS, CABECERA_PEDIDOS, ESTADOS_PEDIDOS);
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

  resaltarPendiente(hoja, hoja.getLastRow(), CABECERA_PEDIDOS.length);

  return respuesta({ ok: true, numero: numero });
}

function registrarInscripcion(data) {
  const hoja = obtenerOCrearHoja(HOJA_INSCRIPCIONES, CABECERA_INSCRIPCIONES, ESTADOS_INSCRIPCIONES);

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

  resaltarPendiente(hoja, hoja.getLastRow(), CABECERA_INSCRIPCIONES.length);

  return respuesta({ ok: true });
}

function obtenerOCrearHoja(nombreHoja, cabecera, estados) {
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
  aplicarValidacionEstado(hoja, cabecera, estados);
  return hoja;
}

/** Desplegable "Estado" en toda la columna (hasta la fila 1000), para que ya
 * esté listo incluso en las filas que todavía no existen. */
function aplicarValidacionEstado(hoja, cabecera, estados) {
  const colEstado = cabecera.indexOf("Estado") + 1;
  if (!colEstado) return;
  const regla = SpreadsheetApp.newDataValidation()
    .requireValueInList(estados, true)
    .setAllowInvalid(false)
    .build();
  hoja.getRange(2, colEstado, 999).setDataValidation(regla);
}

function resaltarPendiente(hoja, fila, numColumnas) {
  hoja.getRange(fila, 1, 1, numColumnas)
    .setBackground(COLOR_PENDIENTE_FONDO)
    .setFontColor(COLOR_PENDIENTE_TEXTO);
}

function quitarResaltado(hoja, fila, numColumnas) {
  hoja.getRange(fila, 1, 1, numColumnas).setBackground(null).setFontColor(null);
}

/**
 * Trigger simple: se ejecuta solo al editar la hoja a mano (no cuando este
 * script escribe filas nuevas vía appendRow). En cuanto alguien cambia el
 * desplegable "Estado" de una fila de Pedidos a "Pedido", o de Inscripciones
 * a "Contactado", esa fila pierde el resaltado naranja; si se vuelve a poner
 * en "Pendiente" (o cualquier otro valor), se resalta de nuevo.
 */
function onEdit(e) {
  if (!e || !e.range) return;
  if (e.range.getNumRows() > 1 || e.range.getNumColumns() > 1) return; // edición múltiple: se ignora
  if (e.range.getRow() === 1) return; // cabecera

  const hoja = e.range.getSheet();
  const nombreHoja = hoja.getName();

  let cabecera, estadoResuelto;
  if (nombreHoja === HOJA_PEDIDOS) {
    cabecera = CABECERA_PEDIDOS;
    estadoResuelto = ESTADO_PEDIDO_RESUELTO;
  } else if (nombreHoja === HOJA_INSCRIPCIONES) {
    cabecera = CABECERA_INSCRIPCIONES;
    estadoResuelto = ESTADO_INSCRIPCION_RESUELTO;
  } else {
    return;
  }

  const colEstado = cabecera.indexOf("Estado") + 1;
  if (!colEstado || e.range.getColumn() !== colEstado) return;

  const fila = e.range.getRow();
  if (e.range.getValue() === estadoResuelto) {
    quitarResaltado(hoja, fila, cabecera.length);
  } else {
    resaltarPendiente(hoja, fila, cabecera.length);
  }
}

/**
 * Resumen periódico: cuenta cuántas filas nuevas hay en "Pedidos" e
 * "Inscripciones" desde el último envío (guarda la última fila contada en
 * PropertiesService) y manda SIEMPRE un correo con el recuento y el enlace a
 * cada pestaña de la hoja online — también cuando no hay nada nuevo, para
 * confirmar que sigue funcionando y que de verdad no hubo movimiento.
 *
 * No lleva el Excel adjunto a propósito: un adjunto es una copia fija y los
 * cambios que se hacen en él (p. ej. el Estado) no llegan a la hoja real, así
 * que se perdían al reabrirlo. Con el enlace se abre siempre el documento vivo.
 *
 * No se ejecuta sola: hace falta llamar una vez a configurarTriggers() (ver
 * más abajo) para programarla los lunes, miércoles y viernes.
 */
function enviarResumenPeriodico() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const props = PropertiesService.getScriptProperties();

  const hojaPedidos = ss.getSheetByName(HOJA_PEDIDOS);
  const hojaInscripciones = ss.getSheetByName(HOJA_INSCRIPCIONES);

  const filaPedidosActual = hojaPedidos ? hojaPedidos.getLastRow() : 1;
  const filaInscripcionesActual = hojaInscripciones ? hojaInscripciones.getLastRow() : 1;

  const filaPedidosAnterior = Number(props.getProperty("ultimaFilaPedidos")) || 1;
  const filaInscripcionesAnterior = Number(props.getProperty("ultimaFilaInscripciones")) || 1;

  const nuevosPedidos = Math.max(0, filaPedidosActual - filaPedidosAnterior);
  const nuevasInscripciones = Math.max(0, filaInscripcionesActual - filaInscripcionesAnterior);

  props.setProperty("ultimaFilaPedidos", String(filaPedidosActual));
  props.setProperty("ultimaFilaInscripciones", String(filaInscripcionesActual));

  const base = ss.getUrl();
  const enlaces = [];
  if (hojaPedidos) enlaces.push("Pedidos de la tienda:\n" + base + "#gid=" + hojaPedidos.getSheetId());
  if (hojaInscripciones) enlaces.push("Inscripciones:\n" + base + "#gid=" + hojaInscripciones.getSheetId());

  const cuerpo =
    (nuevosPedidos === 0 && nuevasInscripciones === 0
      ? "No ha habido pedidos ni inscripciones nuevas desde el último resumen."
      : "Se han actualizado los Excel con " + nuevosPedidos + " pedido(s) nuevo(s) y " +
        nuevasInscripciones + " inscripción(es) nueva(s).") +
    "\n\nAbre la hoja online para ver y cambiar el Estado (los cambios se guardan solos):\n\n" +
    (enlaces.length ? enlaces.join("\n\n") : base);

  MailApp.sendEmail({
    to: DESTINATARIO_RESUMEN,
    subject: "Actualización desde manzanaresvoley.com",
    body: cuerpo,
  });
}

/**
 * Ejecutar UNA SOLA VEZ a mano desde el editor de Apps Script (▶, con esta
 * función seleccionada en el desplegable de arriba) para programar
 * enviarResumenPeriodico() los lunes, miércoles y viernes a las 8:00. Si se
 * vuelve a ejecutar, borra antes los triggers anteriores para no duplicar
 * los envíos.
 */
function configurarTriggers() {
  ScriptApp.getProjectTriggers().forEach((t) => {
    if (t.getHandlerFunction() === "enviarResumenPeriodico") ScriptApp.deleteTrigger(t);
  });

  [ScriptApp.WeekDay.MONDAY, ScriptApp.WeekDay.WEDNESDAY, ScriptApp.WeekDay.FRIDAY].forEach((dia) => {
    ScriptApp.newTrigger("enviarResumenPeriodico").timeBased().onWeekDay(dia).atHour(8).create();
  });
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
