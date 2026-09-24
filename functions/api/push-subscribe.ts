/**
 * Cloudflare Pages Function — guarda (POST) o borra (DELETE) una suscripción
 * de notificaciones push en el KV "PUSH_SUBS", para poder avisar de próximos
 * partidos desde scripts/send-match-reminders.mjs. Ver DEPLOY.md §7.
 *
 * El POST admite una lista opcional "categorias" (nombres tal cual aparecen
 * en equipos-federados.json, p. ej. "Cadete Femenino B") para que la
 * persona solo reciba avisos de esos equipos. Una lista vacía o ausente
 * significa "todos los equipos" (comportamiento por defecto).
 *
 * Bindings (Pages → Settings → Functions → KV namespace bindings):
 *   PUSH_SUBS (obligatoria) — namespace donde se guardan las suscripciones
 */

interface Env {
  PUSH_SUBS: KVNamespaceLike;
}

interface KVNamespaceLike {
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

interface PushSubscriptionJSONLike {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.PUSH_SUBS) {
    return json({ ok: false, error: "Las notificaciones no están configuradas." }, 500);
  }

  let body: { subscription?: PushSubscriptionJSONLike; categorias?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Formato de solicitud no válido." }, 400);
  }

  const sub = body?.subscription;
  if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return json({ ok: false, error: "Suscripción no válida." }, 400);
  }

  const categorias = Array.isArray(body?.categorias)
    ? body.categorias.filter((c): c is string => typeof c === "string")
    : [];

  await env.PUSH_SUBS.put("sub:" + sub.endpoint, JSON.stringify({ ...sub, categorias }));
  return json({ ok: true });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.PUSH_SUBS) {
    return json({ ok: false, error: "Las notificaciones no están configuradas." }, 500);
  }

  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Formato de solicitud no válido." }, 400);
  }

  if (!body?.endpoint) {
    return json({ ok: false, error: "Falta el endpoint de la suscripción." }, 400);
  }

  await env.PUSH_SUBS.delete("sub:" + body.endpoint);
  return json({ ok: true });
};
