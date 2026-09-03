/**
 * Descarga calendario y clasificación de los equipos federados de Manzanares Voley
 * desde la API pública de la Federación de Madrid de Voleibol y escribe
 * src/data/competicion.json. Se ejecuta desde una GitHub Action (cron).
 *
 * Uso: node scripts/fetch-competicion.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://intranet.fmvoley.com/api/competiciones/";
const OUT = join(ROOT, "src/data/competicion.json");
const CFG = join(ROOT, "src/data/equipos-federados.json");

async function api(path) {
  const res = await fetch(API + path, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  const json = await res.json();
  if (json?.Error?.HasError || json?.error?.hasError) {
    throw new Error(`${path} → ${json.Error?.Message || json.error?.message}`);
  }
  return json.content;
}

/** "DD/MM/YYYY" o "DD/MM/YYYY H:mm" → ISO (o null) */
function toIso(fecha, hora) {
  if (!fecha) return null;
  const [d, m, y] = fecha.split("/").map(Number);
  if (!d || !m || !y) return null;
  let hh = 0,
    mm = 0;
  if (hora && /\d/.test(hora)) [hh, mm] = hora.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm)).toISOString();
}

const titleCase = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/([\p{L}])([\p{L}'’.]*)/gu, (_, a, b) => a.toUpperCase() + b)
    .replace(/\s+/g, " ")
    .replace(/\b([A-D])\.?\s+\1\b/g, "$1") // "A A" -> "A"
    .replace(/\bCv\b/g, "CV")
    .replace(/\bVp\b/g, "VP")
    .replace(/\bA\.\s*D\.\b/gi, "A.D.")
    .replace(/\bC\.\s*V\./gi, "CV")
    .replace(/\.Com\b/gi, ".com")
    .trim();

async function fetchGrupo({ categoria, grupoId }, clubId) {
  const datos = await api(`getDatosGrupoCompeticion?grupoId=${grupoId}`);
  const clasifRaw = await api(`getClasificacionGrupo?grupoId=${grupoId}`);
  const jornadasRaw = await api(`getJornadasCalendario?grupoId=${grupoId}`);

  const clasificacion = (clasifRaw || [])
    .filter((t) => t.mostrarClasificacion !== false)
    .map((t) => ({
      pos: Number(t.posicion) || 0,
      equipo: titleCase(t.nombre),
      esManzanares: String(t.club_Id) === String(clubId) || /manzanares/i.test(t.nombre),
      pts: Number(t.puntos) || 0,
      pj: Number(t.jugados) || 0,
      pg: Number(t.ganados) || 0,
      pp: Number(t.perdidos) || 0,
      setsFavor: Number(t.sets_a_favor) || 0,
      setsContra: Number(t.sets_en_contra) || 0,
      puntosFavor: Number(t.puntos_a_favor) || 0,
      puntosContra: Number(t.puntos_en_contra) || 0,
    }))
    .sort((a, b) => a.pos - b.pos);

  // Aplanar partidos y marcar los de Manzanares
  const esMio = (p) =>
    String(p.clubLocalId) === String(clubId) || String(p.clubVisitanteId) === String(clubId);
  const misPartidos = [];
  const jornadas = (jornadasRaw || []).map((j) => ({
    numero: Number(j.numero) || 0,
    fecha: toIso(j.fecha),
    partidos: (j.partidos || []).map((p) => {
      const partido = {
        id: p.id,
        jornada: Number(j.numero) || 0,
        fechaHora: toIso(p.fecha, p.hora),
        local: titleCase(p.equipo_local),
        visitante: titleCase(p.equipo_visitante),
        pabellon: titleCase(p.pabellon) || null,
        esManzanares: esMio(p),
        esLocal: String(p.clubLocalId) === String(clubId),
        aplazado: !!p.esAplazado,
      };
      if (partido.esManzanares) misPartidos.push(partido);
      return partido;
    }),
  }));

  // Detalle de los partidos de Manzanares: sede, hora, mapa y resultado
  await Promise.all(
    misPartidos.map(async (p) => {
      try {
        const d = await api(`getPartido?partidoId=${p.id}`);
        if (!d) return;
        if (d.pabellon) p.pabellon = titleCase(d.pabellon);
        if (d.direccion) p.direccion = d.direccion.trim();
        // Solo si el enlace lleva coordenadas o consulta real (no el "search" vacío)
        if (d.urlGoogleMaps && /[?@]/.test(d.urlGoogleMaps)) p.mapa = d.urlGoogleMaps.trim();
        if (d.fecha_hora) {
          const [f, h] = String(d.fecha_hora).split(" ");
          const iso = toIso(f, h);
          if (iso) p.fechaHora = iso;
        }
        p.jugado = !!d.finalizado;
        if (d.finalizado) {
          p.setsLocal = Number(d.sets_local);
          p.setsVisitante = Number(d.sets_visitante);
          p.resultado = `${d.sets_local}-${d.sets_visitante}`;
        }
      } catch {
        p.jugado = p.jugado ?? false;
      }
    }),
  );

  const urlFmvoley = `https://fmvoley.com/clasificaciones-y-resultados`;

  return {
    grupoId,
    categoria,
    division: titleCase(datos?.division) || "",
    competicion: titleCase(datos?.competicion) || categoria,
    fase: titleCase(datos?.fase) || "",
    urlFmvoley,
    clasificacion,
    jornadas,
    misPartidos: misPartidos.sort((a, b) =>
      (a.fechaHora || "").localeCompare(b.fechaHora || ""),
    ),
  };
}

async function main() {
  const cfg = JSON.parse(await readFile(CFG, "utf8"));
  const grupos = [];
  for (const g of cfg.grupos) {
    process.stdout.write(`· ${g.categoria} (grupo ${g.grupoId})… `);
    grupos.push(await fetchGrupo(g, cfg.clubId));
    console.log("ok");
  }

  // Próximos y últimos partidos de Manzanares (todas las categorías)
  const todos = grupos.flatMap((g) =>
    g.misPartidos.map((p) => ({ ...p, categoria: g.categoria })),
  );
  const ahora = Date.now();
  const proximos = todos
    .filter((p) => !p.jugado && p.fechaHora && new Date(p.fechaHora).getTime() >= ahora - 864e5)
    .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
    .slice(0, 8);
  const ultimos = todos
    .filter((p) => p.jugado)
    .sort((a, b) => (b.fechaHora || "").localeCompare(a.fechaHora || ""))
    .slice(0, 8);

  const data = {
    actualizado: new Date().toISOString(),
    temporada: cfg.temporada,
    grupos,
    proximos,
    ultimos,
  };

  // Solo reescribir si cambió algo más que la marca de tiempo, para no
  // ensuciar el historial con commits que solo tocan "actualizado".
  const sinFecha = (o) => JSON.stringify({ ...o, actualizado: null });
  let previo = null;
  try {
    previo = JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    /* primera ejecución */
  }
  if (previo && sinFecha(previo) === sinFecha(data)) {
    console.log("\n= Sin cambios en calendario ni clasificación; no se reescribe.");
    return;
  }

  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`\n✓ ${OUT} (${grupos.length} grupos, ${proximos.length} próximos, ${ultimos.length} resultados)`);
}

main().catch((e) => {
  console.error("\n✗ Error:", e.message);
  process.exit(1);
});
