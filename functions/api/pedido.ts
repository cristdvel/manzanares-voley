/**
 * Cloudflare Pages Function — recibe un pedido de la tienda con el comprobante
 * de pago adjunto, envía por email al club el pedido completo (con adjunto) y
 * al comprador una confirmación con su nº de pedido, y lo registra en una
 * hoja de Google Sheets (vía un Apps Script Web App) para tener un listado
 * descargable de todos los pedidos. Ver DEPLOY.md §6.
 *
 * Variables de entorno (Pages → Settings → Environment variables):
 *   RESEND_API_KEY     (obligatoria)  clave de API de Resend
 *   PEDIDOS_TO         (opcional)     destino; por defecto manzanaresvoley@gmail.com
 *   PEDIDOS_FROM       (opcional)     remitente verificado en Resend
 *   SHEETS_WEBHOOK_URL (opcional)     URL del Apps Script Web App que registra el pedido
 */

interface Env {
  RESEND_API_KEY: string;
  PEDIDOS_TO?: string;
  PEDIDOS_FROM?: string;
  SHEETS_WEBHOOK_URL?: string;
}

const MAX_FILE = 8 * 1024 * 1024; // 8 MB
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as unknown as number[]);
  }
  return btoa(bin);
}

/** Nº de pedido legible: MZV + fecha (AAMMDD) + 4 dígitos aleatorios. */
function generarNumeroPedido(): string {
  const fecha = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const sufijo = Math.floor(1000 + Math.random() * 9000);
  return `MZV${fecha}-${sufijo}`;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "content-type": "application/json" },
    });

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "El envío de pedidos no está configurado." }, 500);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Formato de solicitud no válido." }, 400);
  }

  // Honeypot anti-spam
  if ((form.get("website") as string)?.trim()) {
    return json({ ok: true });
  }

  const nombre = (form.get("nombre") as string || "").trim();
  const email = (form.get("email") as string || "").trim();
  const telefono = (form.get("telefono") as string || "").trim();
  const equipo = (form.get("equipo") as string || "").trim();
  const notas = (form.get("notas") as string || "").trim();
  const pedidoRaw = (form.get("pedido") as string || "").trim();
  const file = form.get("comprobante");

  if (!nombre || !email || !telefono || !equipo) {
    return json({ ok: false, error: "Faltan datos de contacto." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "El email no es válido." }, 400);
  }

  let lineas: Array<{
    nombre: string;
    variante?: string;
    talla?: string;
    tallas?: Record<string, string>;
    cantidad: number;
  }> = [];
  try {
    lineas = JSON.parse(pedidoRaw);
  } catch {
    /* vacío */
  }
  if (!Array.isArray(lineas) || lineas.length === 0) {
    return json({ ok: false, error: "El pedido está vacío." }, 400);
  }

  if (!(file instanceof File) || file.size === 0) {
    return json({ ok: false, error: "Adjunta el comprobante de pago." }, 400);
  }
  if (file.size > MAX_FILE) {
    return json({ ok: false, error: "El comprobante supera los 8 MB." }, 400);
  }
  if (file.type && !TIPOS_OK.includes(file.type)) {
    return json({ ok: false, error: "El comprobante debe ser una imagen o un PDF." }, 400);
  }

  const numero = generarNumeroPedido();
  // Renombra el adjunto con el nº de pedido, conservando la extensión original.
  const ext = /\.[a-zA-Z0-9]+$/.exec(file.name || "")?.[0] || "";
  const nombreArchivo = `${numero}${ext}`;

  const filas = lineas
    .map(
      (l) =>
        `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(l.nombre)}</td>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(l.variante || "—")}</td>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #eee">${esc(l.talla || "—")}</td>` +
        `<td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center">${esc(l.cantidad)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#212327;max-width:640px">
      <h2 style="color:#DC3C14;margin:0 0 4px">Nuevo pedido de la tienda — ${esc(numero)}</h2>
      <p style="margin:0 0 18px;color:#666">${esc(new Date().toLocaleString("es-ES"))}</p>
      <h3 style="margin:0 0 6px">Cliente</h3>
      <p style="margin:0 0 18px">
        <strong>${esc(nombre)}</strong><br>
        Email: <a href="mailto:${esc(email)}">${esc(email)}</a><br>
        Teléfono: ${esc(telefono)}<br>
        Equipo: ${esc(equipo)}
      </p>
      <h3 style="margin:0 0 6px">Artículos</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <thead><tr>
          <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #212327">Artículo</th>
          <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #212327">Variante</th>
          <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #212327">Talla</th>
          <th style="padding:6px 10px;border-bottom:2px solid #212327">Uds.</th>
        </tr></thead>
        <tbody>${filas}</tbody>
      </table>
      ${notas ? `<h3 style="margin:18px 0 6px">Notas</h3><p style="margin:0;white-space:pre-wrap">${esc(notas)}</p>` : ""}
      <p style="margin:18px 0 0;color:#666;font-size:13px">
        Comprobante de pago adjunto: <strong>${esc(nombreArchivo)}</strong>
      </p>
    </div>`;

  const attachment = {
    filename: nombreArchivo,
    content: toBase64(await file.arrayBuffer()),
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.PEDIDOS_FROM || "Tienda Manzanares Voley <onboarding@resend.dev>",
      to: [env.PEDIDOS_TO || "manzanaresvoley@gmail.com"],
      reply_to: email,
      subject: `Pedido ${numero} — ${nombre}`,
      html,
      attachments: [attachment],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return json({ ok: false, error: "No se pudo enviar el pedido.", detail }, 502);
  }

  // Confirmación al comprador: en segundo plano, no bloquea la respuesta.
  // Si falla, el pedido ya está recibido por el club de todas formas.
  const htmlComprador = `
    <div style="font-family:Arial,sans-serif;color:#212327;max-width:640px">
      <h2 style="color:#DC3C14;margin:0 0 4px">¡Gracias por tu pedido!</h2>
      <p style="margin:0 0 18px;color:#666">Pedido <strong>${esc(numero)}</strong> · ${esc(new Date().toLocaleString("es-ES"))} · Equipo: ${esc(equipo)}</p>
      <p style="margin:0 0 18px">
        Hola ${esc(nombre)}, hemos recibido tu pedido y el comprobante de pago.
        El club te contesta a este email en menos de 48 h para confirmar tallas y cerrar la entrega.
      </p>
      <h3 style="margin:0 0 6px">Tu pedido</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <thead><tr>
          <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #212327">Artículo</th>
          <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #212327">Variante</th>
          <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #212327">Talla</th>
          <th style="padding:6px 10px;border-bottom:2px solid #212327">Uds.</th>
        </tr></thead>
        <tbody>${filas}</tbody>
      </table>
      ${notas ? `<h3 style="margin:18px 0 6px">Tus notas</h3><p style="margin:0;white-space:pre-wrap">${esc(notas)}</p>` : ""}
      <p style="margin:24px 0 0;color:#666;font-size:13px">
        ¿Dudas mientras tanto? Escríbenos a
        <a href="mailto:manzanaresvoley@gmail.com">manzanaresvoley@gmail.com</a>.
      </p>
    </div>`;

  const confirmacion = fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.PEDIDOS_FROM || "Tienda Manzanares Voley <onboarding@resend.dev>",
      to: [email],
      reply_to: env.PEDIDOS_TO || "manzanaresvoley@gmail.com",
      subject: `Hemos recibido tu pedido — ${numero}`,
      html: htmlComprador,
    }),
  }).catch((err) => console.error("No se pudo enviar la confirmación al comprador:", err));
  waitUntil(confirmacion);

  // Registro en Google Sheets: en segundo plano (waitUntil), sin esperar a
  // que Apps Script termine — así no se cuelga la respuesta al cliente si
  // Google tarda. El pedido ya se ha enviado por email de todas formas.
  if (env.SHEETS_WEBHOOK_URL) {
    const registro = fetch(env.SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        numero,
        nombre,
        email,
        telefono,
        equipo,
        notas,
        pedido: lineas,
        comprobante: {
          nombre: nombreArchivo,
          tipo: file.type || "application/octet-stream",
          base64: attachment.content,
        },
      }),
    }).catch((err) => console.error("No se pudo registrar el pedido en Sheets:", err));
    waitUntil(registro);
  }

  return json({ ok: true, numero });
};
