/**
 * Cloudflare Pages Function — recibe un pedido de la tienda con el comprobante
 * de pago adjunto y lo envía por email al club mediante Resend.
 *
 * Variables de entorno (Pages → Settings → Environment variables):
 *   RESEND_API_KEY  (obligatoria)  clave de API de Resend
 *   PEDIDOS_TO      (opcional)     destino; por defecto manzanaresvoley@gmail.com
 *   PEDIDOS_FROM    (opcional)     remitente verificado en Resend
 */

interface Env {
  RESEND_API_KEY: string;
  PEDIDOS_TO?: string;
  PEDIDOS_FROM?: string;
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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
  const notas = (form.get("notas") as string || "").trim();
  const pedidoRaw = (form.get("pedido") as string || "").trim();
  const file = form.get("comprobante");

  if (!nombre || !email || !telefono) {
    return json({ ok: false, error: "Faltan datos de contacto." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "El email no es válido." }, 400);
  }

  let lineas: Array<{ nombre: string; variante?: string; talla?: string; cantidad: number }> = [];
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
      <h2 style="color:#DC3C14;margin:0 0 4px">Nuevo pedido de la tienda</h2>
      <p style="margin:0 0 18px;color:#666">${esc(new Date().toLocaleString("es-ES"))}</p>
      <h3 style="margin:0 0 6px">Cliente</h3>
      <p style="margin:0 0 18px">
        <strong>${esc(nombre)}</strong><br>
        Email: <a href="mailto:${esc(email)}">${esc(email)}</a><br>
        Teléfono: ${esc(telefono)}
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
        Comprobante de pago adjunto: <strong>${esc(file.name)}</strong>
      </p>
    </div>`;

  const attachment = {
    filename: file.name || "comprobante",
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
      subject: `Pedido tienda — ${nombre}`,
      html,
      attachments: [attachment],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return json({ ok: false, error: "No se pudo enviar el pedido.", detail }, 502);
  }

  return json({ ok: true });
};
