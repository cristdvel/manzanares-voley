/**
 * Cloudflare Pages Function — recibe una solicitud de inscripción del
 * formulario de la home y la registra en la hoja de Google Sheets (pestaña
 * "Inscripciones"), vía el mismo Apps Script Web App que los pedidos — ver
 * DEPLOY.md §9.
 *
 * El club ya NO recibe un email por cada inscripción — solo se entera por
 * la hoja de cálculo, que resume y manda por email cuántas inscripciones
 * nuevas hay los lunes, miércoles y viernes (lo hace el propio Apps Script,
 * ver scripts/apps-script-pedidos.gs → enviarResumenPeriodico). Por eso esta
 * función SÍ espera la respuesta del Apps Script antes de contestar al
 * navegador: es el único sitio donde queda constancia de la inscripción, así
 * que si falla el registro hay que avisar a quien rellenó el formulario en
 * vez de decirle "recibido" en falso.
 *
 * Variables de entorno (Pages → Settings → Environment variables):
 *   SHEETS_WEBHOOK_URL (obligatoria)  URL del Apps Script Web App que registra la inscripción
 */

interface Env {
  SHEETS_WEBHOOK_URL?: string;
}

const EXPERIENCIA_LABEL: Record<string, string> = {
  sin: "Sin experiencia",
  "1-2": "1–2 años",
  "3+": "Más de 3 años",
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "content-type": "application/json" },
    });

  if (!env.SHEETS_WEBHOOK_URL) {
    return json({ ok: false, error: "El registro de inscripciones no está configurado." }, 500);
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

  try {
    const res = await fetch(env.SHEETS_WEBHOOK_URL, {
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
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
    if (!res.ok || !data.ok) {
      return json({ ok: false, error: "No se pudo registrar la inscripción." }, 502);
    }
  } catch (err) {
    console.error("No se pudo registrar la inscripción en Sheets:", err);
    return json({ ok: false, error: "No se pudo registrar la inscripción." }, 502);
  }

  return json({ ok: true });
};
