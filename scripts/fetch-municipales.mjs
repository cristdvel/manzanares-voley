/**
 * Descarga calendario, resultados y clasificación de los equipos municipales de
 * Manzanares Voley desde los datos abiertos del Ayuntamiento de Madrid
 * ("Competiciones deportivas municipales de deportes colectivos. Temporada en
 * curso") y escribe src/data/municipales.json. Se ejecuta desde una GitHub
 * Action (cron) — ver .github/workflows/municipales.yml.
 *
 * El Ayuntamiento publica dos CSV (partidos y clasificaciones, en ISO-8859-1 y
 * separados por ";") y los renueva cada miércoles; el nombre del fichero lleva
 * la fecha (partidos_20261007.csv), así que la URL actual se pide a la API de
 * CKAN del portal en cada ejecución. Los equipos del club se localizan por
 * categoría + sexo + nombre según src/data/equipos-municipales.json.
 *
 * Pruebas sin red: JDM_PARTIDOS=ruta/partidos.csv JDM_CLASIF=ruta/clasif.csv
 * JDM_OUT=ruta/salida.json (para no tocar src/data/municipales.json)
 *
 * Uso: node scripts/fetch-municipales.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.env.JDM_OUT || join(ROOT, "src/data/municipales.json");
const CFG = join(ROOT, "src/data/equipos-municipales.json");
const CKAN = "https://datos.madrid.es/api/3/action/package_show?id=211549-0-juegos-deportivos-actual";
const FUENTE = "https://datos.madrid.es/dataset/211549-0-juegos-deportivos-actual";
const UA = { "User-Agent": "Mozilla/5.0 (manzanaresvoley.com data bot)" };

const AVISO_SIN_DATOS =
  "Todavía no hay calendario publicado para este equipo. Las competiciones municipales de categorías base arrancan el 14 de noviembre de 2026 y el Ayuntamiento publica los datos cada miércoles: aparecerá aquí automáticamente.";

async function descargar(url, intentos = 3) {
  let ultimo;
  for (let i = 1; i <= intentos; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(90_000) });
      if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      ultimo = e;
      if (i < intentos) await new Promise((r) => setTimeout(r, 3000 * i));
    }
  }
  throw ultimo;
}

async function leerFuente(envVar, patronNombre) {
  const local = process.env[envVar];
  if (local) return { buf: await readFile(local), nombre: local };
  const meta = JSON.parse((await descargar(CKAN)).toString("utf8"));
  const recurso = (meta.result?.resources || []).find(
    (r) => /csv/i.test(r.format) && patronNombre.test(r.url.split("/").pop()),
  );
  if (!recurso) throw new Error(`No encuentro el recurso ${patronNombre} en el conjunto de datos`);
  return { buf: await descargar(recurso.url), nombre: recurso.url.split("/").pop() };
}

/** CSV del Ayuntamiento: ISO-8859-1, ";" y sin comillas de escape (las que hay son literales). */
function parsear(buf) {
  const lineas = new TextDecoder("windows-1252").decode(buf).replace(/\r/g, "").split("\n").filter(Boolean);
  const cab = lineas[0].replace(/^﻿/, "").split(";");
  return lineas.slice(1).map((l) => {
    const c = l.split(";");
    const o = {};
    cab.forEach((k, i) => (o[k] = (c[i] ?? "").trim()));
    return o;
  });
}

const norm = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

const titleCase = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/([\p{L}])([\p{L}'’.]*)/gu, (_, a, b) => a.toUpperCase() + b)
    .replace(/\s+/g, " ")
    .replace(/\bCv\b/g, "CV")
    .replace(/\bCd\b/g, "CD")
    .replace(/\bCdm\b/g, "CDM")
    .replace(/\bAd\b/g, "AD")
    .replace(/\bVp\b/g, "VP")
    .trim();

const aInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};

function aIso(fecha, hora) {
  const f = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha || "");
  if (!f) return null;
  const h = /^(\d{1,2}):(\d{2})/.exec(hora || "");
  return new Date(Date.UTC(+f[1], +f[2] - 1, +f[3], h ? +h[1] : 0, h ? +h[2] : 0)).toISOString();
}

function sede(campo) {
  // "CCN CIUDAD DE LOS MUCHACHOS:VOLEIBOL - VALLECAS" → "CCN Ciudad De Los Muchachos"
  const base = (campo || "").split(":")[0].replace(/\bVOLEIBOL\b.*$/i, "").trim();
  return base ? titleCase(base) : null;
}

function mapa(x, y) {
  const lon = parseFloat(x);
  const lat = parseFloat(y);
  if (!lon || !lat) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

const ESTADO_JUGADO = new Set(["F", "N"]); // finalizado / no presentado
const ESTADO_APLAZADO = new Set(["S", "O"]); // suspendido / aplazado por la organización

// Las jornadas de descanso vienen como un partido contra "** DESCANSA **".
const esDescanso = (nombre) => /DESCANSA/i.test(nombre);
const equipo = (nombre) => (esDescanso(nombre) ? "Descansa" : titleCase(nombre));

function aPartido(r, ids) {
  const r1 = aInt(r.Resultado1);
  const r2 = aInt(r.Resultado2);
  const descanso = esDescanso(r.Equipo_local) || esDescanso(r.Equipo_visitante);
  const jugado = !descanso && (ESTADO_JUGADO.has(r.Estado) || (!ESTADO_APLAZADO.has(r.Estado) && r1 + r2 > 0));
  const esLocal = ids.has(r.Codigo_equipo1);
  const p = {
    id: Number(`${r.Codigo_grupo}${String(aInt(r.Jornada)).padStart(3, "0")}${String(aInt(r.Partido)).padStart(3, "0")}`),
    jornada: aInt(r.Jornada),
    fechaHora: aIso(r.Fecha, r.Hora),
    local: equipo(r.Equipo_local),
    visitante: equipo(r.Equipo_visitante),
    pabellon: descanso ? null : sede(r.Campo),
    esManzanares: true,
    esLocal,
    aplazado: ESTADO_APLAZADO.has(r.Estado),
    jugado,
    fase: titleCase(r.Nombre_competicion.replace(/^\d+\s*/, "")),
  };
  const url = descanso ? undefined : mapa(r.COORD_X_CAMPO, r.COORD_Y_CAMPO);
  if (url) p.mapa = url;
  if (jugado) {
    p.setsLocal = r1;
    p.setsVisitante = r2;
    p.resultado = `${r1}-${r2}`;
  }
  return p;
}

async function main() {
  const cfg = JSON.parse(await readFile(CFG, "utf8"));
  const fp = await leerFuente("JDM_PARTIDOS", /^partidos_?\d+\.csv$/i);
  const fc = await leerFuente("JDM_CLASIF", /^clasificaciones_?\d+\.csv$/i);

  const partidos = parsear(fp.buf).filter((r) => r.Nombre_deporte === "VOLEIBOL");
  const clasif = parsear(fc.buf).filter((r) => r.Nombre_deporte === "VOLEIBOL");
  const fechaDatos = /(\d{4})(\d{2})(\d{2})/.exec(fp.nombre);
  console.log(`Voleibol municipal: ${partidos.length} partidos, ${clasif.length} filas de clasificación (${fp.nombre}).`);

  // Equipos de voleibol: código → nombre/categoría/sexo
  const equipos = new Map();
  for (const r of partidos) {
    for (const [cod, nom] of [
      [r.Codigo_equipo1, r.Equipo_local],
      [r.Codigo_equipo2, r.Equipo_visitante],
    ]) {
      if (!equipos.has(cod)) equipos.set(cod, { nombre: nom, categoria: norm(r.Nombre_categoria), sexo: r.Sexo_grupo });
    }
  }

  const hoy = new Date().toISOString().slice(0, 10);
  const grupos = cfg.equipos.map((e, i) => {
    const reCat = new RegExp(e.categoria);
    const reEq = new RegExp(e.equipo);
    const ids = new Set(
      [...equipos]
        .filter(([cod, t]) =>
          e.codigoEquipo
            ? cod === String(e.codigoEquipo)
            : reCat.test(t.categoria) && t.sexo === e.sexo && reEq.test(norm(t.nombre)),
        )
        .map(([cod]) => cod),
    );
    // Un mismo equipo tiene un código distinto en cada fase (liga, Copa…), así que
    // solo es sospechoso que encajen nombres distintos (p. ej. ROJO y BLANCO).
    const nombresDistintos = new Set([...ids].map((c) => norm(equipos.get(c).nombre)));
    if (nombresDistintos.size > 1) {
      console.warn(`⚠ "${e.nombre}" encaja con equipos distintos (${[...nombresDistintos].join(" / ")}); se mezclan. Afina su "equipo" o fija "codigoEquipo" en equipos-municipales.json.`);
    }
    const base = {
      grupoId: 800000 + i,
      categoria: e.nombre,
      division: "Juegos Deportivos Municipales",
      competicion: "Juegos Deportivos Municipales",
      fase: "Calendario pendiente de publicación",
      urlFmvoley: FUENTE,
      clasificacion: [],
      jornadas: [],
      misPartidos: [],
    };

    const filas = partidos
      .filter((r) => ids.has(r.Codigo_equipo1) || ids.has(r.Codigo_equipo2))
      .sort((a, b) => (a.Fecha + (a.Hora || "")).localeCompare(b.Fecha + (b.Hora || "")));
    if (filas.length === 0) return { ...base, aviso: AVISO_SIN_DATOS };

    // Clasificación del grupo en el que está ahora: el del próximo partido, o el del último jugado.
    const siguiente = filas.find((r) => r.Fecha >= hoy && !ESTADO_JUGADO.has(r.Estado));
    const actual = siguiente || filas[filas.length - 1];
    const tabla = clasif
      .filter((r) => r.Codigo_grupo === actual.Codigo_grupo)
      .sort((a, b) => (aInt(a.Posicion) || 999) - (aInt(b.Posicion) || 999))
      .map((r) => ({
        pos: aInt(r.Posicion),
        equipo: titleCase(r.Nombre_equipo),
        esManzanares: ids.has(r.Codigo_equipo),
        pts: Number(r.Puntos) || 0,
        pj: aInt(r.Partidos_jugados),
        pg: aInt(r.Partidos_ganados),
        pp: aInt(r.Partidos_perdidos),
        setsFavor: aInt(r.Goles_favor),
        setsContra: aInt(r.Goles_contra),
        puntosFavor: 0,
        puntosContra: 0,
      }));

    return {
      ...base,
      division: `${titleCase(actual.Nombre_competicion.replace(/^\d+\s*/, ""))} · ${titleCase(actual.Distrito)}`,
      competicion: titleCase(actual.Nombre_competicion),
      fase: actual.Nombre_grupo,
      clasificacion: tabla,
      misPartidos: filas.map((r) => aPartido(r, ids)),
    };
  });

  const conDatos = grupos.filter((g) => g.misPartidos.length > 0).length;
  const data = {
    actualizado: new Date().toISOString(),
    temporada: partidos[0]?.Nombre_temporada || cfg.temporada || "2026/2027",
    fuente: FUENTE,
    datosDel: fechaDatos ? `${fechaDatos[1]}-${fechaDatos[2]}-${fechaDatos[3]}` : null,
    grupos,
  };

  const sinFecha = (o) => JSON.stringify({ ...o, actualizado: null });
  let previo = null;
  try {
    previo = JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    /* primera ejecución */
  }
  if (previo && sinFecha(previo) === sinFecha(data)) {
    console.log(`= Sin cambios en los equipos municipales (${conDatos}/${grupos.length} con datos); no se reescribe.`);
    return;
  }
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`✓ ${OUT} (${conDatos}/${grupos.length} equipos con datos)`);
}

// El portal del Ayuntamiento solo renueva los datos una vez por semana: si una
// descarga falla se conserva el fichero anterior en vez de romper la Action.
main().catch((e) => {
  console.error("✗ No se pudieron actualizar los equipos municipales:", e.message);
  process.exit(process.env.JDM_ESTRICTO ? 1 : 0);
});
