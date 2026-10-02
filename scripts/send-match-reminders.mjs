/**
 * Envía notificaciones push a quien se haya suscrito, avisando de los
 * partidos federados de Manzanares Voley que empiezan en las próximas
 * 12-36 horas (para que llegue "el día antes"). Se ejecuta desde una
 * GitHub Action con cron — ver DEPLOY.md §7.
 *
 * Lee el calendario ya descargado en src/data/competicion.json (no vuelve a
 * llamar a la Federación) y las suscripciones guardadas en un namespace de
 * Cloudflare KV (las guarda functions/api/push-subscribe.ts cuando alguien
 * pulsa "Avisos de partidos" en la web), a los que accede por la API REST
 * de Cloudflare porque esta Action no puede leer el KV directamente. Cada
 * suscripción puede llevar una lista "categorias" (equipos elegidos en el
 * panel de la web); si está vacía se avisa de todos los equipos.
 *
 * Marca cada partido ya avisado con una clave "notified:<id>" (3 días de
 * validez) para no mandar el mismo aviso dos veces aunque el cron se
 * ejecute varias veces dentro de la ventana de 24 h.
 *
 * Variables de entorno (secretos del repo en GitHub):
 *   CF_ACCOUNT_ID, CF_KV_NAMESPACE_ID, CF_API_TOKEN — acceso al KV
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT — firma de los envíos
 *
 * Uso: node scripts/send-match-reminders.mjs
 */
import webpush from "web-push";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Un secreto de GitHub pegado con un salto de línea o espacio —también en
// medio, no solo en los extremos— rompe fetch() con "Headers.append: ... is an
// invalid header value". Se queda con el primer fragmento sin espacios y avisa
// (sin imprimir el valor) para que se pueda corregir el secreto de verdad.
function limpiar(nombre) {
  const partes = (process.env[nombre] || "").split(/\s+/).filter(Boolean);
  // Cloudflare muestra bajo el token un `curl ... -H "Authorization: Bearer <token>"`
  // de ejemplo; si se pegó ese bloque entero, el token es lo que sigue a "Bearer".
  const i = partes.indexOf("Bearer");
  if (i !== -1 && partes[i + 1]) {
    console.warn(`⚠ ${nombre} parece el comando curl de ejemplo de Cloudflare en vez del token solo; se extrae el token. Conviene volver a guardar solo el token.`);
    return partes[i + 1].replace(/["'\\]/g, "");
  }
  if (partes.length > 1) {
    console.warn(`⚠ ${nombre} tiene ${partes.length} fragmentos separados por espacios o saltos de línea; se usa solo el primero. Vuelve a guardar el secreto sin saltos de línea.`);
  }
  return partes[0] || "";
}

const env = Object.fromEntries(
  ["CF_ACCOUNT_ID", "CF_KV_NAMESPACE_ID", "CF_API_TOKEN", "VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"].map(
    (n) => [n, limpiar(n)],
  ),
);

for (const [nombre, valor] of Object.entries(env)) {
  if (!valor) {
    console.error(`✗ Falta la variable de entorno ${nombre}.`);
    process.exit(1);
  }
}
if (!/^[\x21-\x7e]+$/.test(env.CF_API_TOKEN)) {
  console.error("✗ CF_API_TOKEN contiene caracteres no válidos (revisa que no tenga comillas tipográficas, tildes o símbolos raros).");
  process.exit(1);
}

webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);

const KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/storage/kv/namespaces/${env.CF_KV_NAMESPACE_ID}`;
const kvHeaders = { Authorization: `Bearer ${env.CF_API_TOKEN}` };

async function kvListKeys(prefix) {
  const nombres = [];
  let cursor;
  do {
    const url = new URL(`${KV_BASE}/keys`);
    url.searchParams.set("prefix", prefix);
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers: kvHeaders });
    const data = await res.json();
    if (!data.success) throw new Error("Error listando KV: " + JSON.stringify(data.errors));
    nombres.push(...data.result.map((r) => r.name));
    cursor = data.result_info && data.result_info.cursor ? data.result_info.cursor : undefined;
  } while (cursor);
  return nombres;
}

async function kvGet(key) {
  const res = await fetch(`${KV_BASE}/values/${encodeURIComponent(key)}`, { headers: kvHeaders });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error leyendo KV (${res.status}): revisa CF_API_TOKEN, CF_ACCOUNT_ID y CF_KV_NAMESPACE_ID.`);
  return res.text();
}

async function kvPut(key, value, ttlSeconds) {
  const url = new URL(`${KV_BASE}/values/${encodeURIComponent(key)}`);
  if (ttlSeconds) url.searchParams.set("expiration_ttl", String(ttlSeconds));
  const res = await fetch(url, { method: "PUT", headers: kvHeaders, body: value });
  if (!res.ok) throw new Error("Error escribiendo en KV: " + (await res.text()));
}

async function kvDelete(key) {
  await fetch(`${KV_BASE}/values/${encodeURIComponent(key)}`, { method: "DELETE", headers: kvHeaders });
}

// Ventana de aviso: entre 12 y 36 horas antes del partido.
const HORAS_DESDE = 12;
const HORAS_HASTA = 36;

async function partidosEnVentana() {
  const raw = JSON.parse(await readFile(join(ROOT, "src/data/competicion.json"), "utf8"));
  const ahora = Date.now();
  const desde = ahora + HORAS_DESDE * 3600e3;
  const hasta = ahora + HORAS_HASTA * 3600e3;
  return (raw.proximos || []).filter((p) => {
    if (!p.fechaHora) return false;
    const t = new Date(p.fechaHora).getTime();
    return t >= desde && t <= hasta;
  });
}

function textoAviso(p) {
  const fecha = new Date(p.fechaHora);
  const hora = String(fecha.getUTCHours()).padStart(2, "0") + ":" + String(fecha.getUTCMinutes()).padStart(2, "0");
  return {
    title: `Mañana juega ${p.categoria}`,
    body: `${p.local} vs ${p.visitante} · ${hora}${p.pabellon ? " · " + p.pabellon : ""}`,
  };
}

async function main() {
  const partidos = await partidosEnVentana();
  if (partidos.length === 0) {
    console.log(`Sin partidos en la ventana de aviso (${HORAS_DESDE}-${HORAS_HASTA} h).`);
    return;
  }

  const pendientes = [];
  for (const p of partidos) {
    const yaAvisado = await kvGet(`notified:${p.id}`);
    if (!yaAvisado) pendientes.push(p);
  }
  if (pendientes.length === 0) {
    console.log("Todos los partidos de la ventana ya tenían el aviso enviado.");
    return;
  }

  const subKeys = await kvListKeys("sub:");
  console.log(`${pendientes.length} partido(s) nuevo(s) · ${subKeys.length} suscripción(es).`);

  for (const p of pendientes) {
    const { title, body } = textoAviso(p);
    const payload = JSON.stringify({ title, body, url: "/calendario" });

    let enviados = 0;
    let interesados = 0;
    for (const key of subKeys) {
      const raw = await kvGet(key);
      if (!raw) continue;
      const subscription = JSON.parse(raw);
      // "categorias" vacío o ausente = quiere avisos de todos los equipos.
      const categorias = Array.isArray(subscription.categorias) ? subscription.categorias : [];
      if (categorias.length > 0 && !categorias.includes(p.categoria)) continue;
      interesados++;
      try {
        await webpush.sendNotification(subscription, payload);
        enviados++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await kvDelete(key); // suscripción caducada o revocada por el navegador
        } else {
          console.error(`  ✗ Error enviando a ${key}:`, err.statusCode || "", err.body || err.message);
        }
      }
    }
    console.log(`  ✓ "${title}" — enviado a ${enviados}/${interesados} (de ${subKeys.length} suscripciones totales)`);
    await kvPut(`notified:${p.id}`, "1", 60 * 60 * 24 * 3); // 3 días de margen
  }
}

main().catch((err) => {
  console.error("✗ Error:", err);
  process.exit(1);
});
