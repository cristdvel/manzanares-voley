/**
 * Cloudflare Pages Function — recibe una solicitud de inscripción del
 * formulario de la home, la envía por email al club y la registra en la
 * hoja de Google Sheets (pestaña "Inscripciones"), igual que los pedidos
 * de la tienda. Reutiliza las mismas variables de entorno que
 * functions/api/pedido.ts — ver DEPLOY.md §9.
 *
 * Variables de entorno (Pages → Settings → Environment variables):
 *   RESEND_API_KEY     (obligatoria)  clave de API de Resend
 *   PEDIDOS_TO         (opcional)     destino; por defecto manzanaresvoley@gmail.com
 *   PEDIDOS_FROM       (opcional)     remitente verificado en Resend
 *   SHEETS_WEBHOOK_URL (opcional)     URL del Apps Script Web App que registra la inscripción
 */

interface Env {
  RESEND_API_KEY: string;
  PEDIDOS_TO?: string;
  PEDIDOS_FROM?: string;
  SHEETS_WEBHOOK_URL?: string;
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const EXPERIENCIA_LABEL: Record<string, string> = {
  sin: "Sin experiencia",
  "1-2": "1–2 años",
  "3+": "Más de 3 años",
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "content-type": "application/json" },
    });

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "El envío de inscripciones no está configurado." }, 500);
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
  const dob = (form.get("dob") as string || "").trim();
  const tutor = (form.get("tutor") as string || "").trim();
  const telefono = (form.get("tel") as string || "").trim();
  const email = (form.get("email") as string || "").trim();
  const experiencia = (form.get("exp") as string || "").trim();
  const categoria = (form.get("categoria") as string || "").trim();
  const privacidad = form.get("privacidad") === "on";
  const imagenes = form.get("imagenes") === "on";

  if (!nombre || !dob || !tutor || !telefono || !email || !privacidad) {
    return json({ ok: false, error: "Faltan datos obligatorios." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "El email no es válido." }, 400);
  }

  const experienciaTexto = EXPERIENCIA_LABEL[experiencia] || experiencia || "—";

  const html = `
    <div style="font-family:Arial,sans-serif;color:#212327;max-width:640px">
      <h2 style="color:#DC3C14;margin:0 0 4px">Nueva solicitud de inscripción</h2>
      <p style="margin:0 0 18px;color:#666">${esc(new Date().toLocaleString("es-ES"))}</p>
      <h3 style="margin:0 0 6px">Deportista</h3>
      <p style="margin:0 0 18px">
        <strong>${esc(nombre)}</strong><br>
        Fecha de nacimiento: ${esc(dob)}<br>
        ${categoria ? `Categoría orientativa: <strong>${esc(categoria)}</strong><br>` : ""}
        Experiencia previa: ${esc(experienciaTexto)}<br>
        Autoriza uso de imágenes: ${imagenes ? "Sí" : "No"}
      </p>
      <h3 style="margin:0 0 6px">Contacto (padre / madre / tutor)</h3>
      <p style="margin:0 0 18px">
        <strong>${esc(tutor)}</strong><br>
        Email: <a href="mailto:${esc(email)}">${esc(email)}</a><br>
        Teléfono: ${esc(telefono)}
      </p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.PEDIDOS_FROM || "Manzanares Voley <onboarding@resend.dev>",
      to: [env.PEDIDOS_TO || "manzanaresvoley@gmail.com"],
      reply_to: email,
      subject: `Nueva inscripción — ${nombre}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return json({ ok: false, error: "No se pudo enviar la inscripción.", detail }, 502);
  }

  // Registro en Google Sheets: en segundo plano, igual que los pedidos.
  if (env.SHEETS_WEBHOOK_URL) {
    const registro = fetch(env.SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tipo: "inscripcion",
        nombre,
        dob,
        categoria,
        tutor,
        telefono,
        email,
        experiencia: experienciaTexto,
        imagenes,
      }),
    }).catch((err) => console.error("No se pudo registrar la inscripción en Sheets:", err));
    waitUntil(registro);
  }

  return json({ ok: true });
};
