import raw from "./municipales.json";
import type { Grupo } from "./competicion";

export interface Municipales {
  actualizado: string;
  temporada: string;
  fuente: string;
  /** fecha (AAAA-MM-DD) del fichero del Ayuntamiento del que salen los datos */
  datosDel: string | null;
  grupos: Grupo[];
}

export const municipales = raw as Municipales;
export const gruposMunicipales = municipales.grupos;

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-10-07" → "7 oct 2026" */
export function datosDelTexto(): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(municipales.datosDel || "");
  return m ? `${Number(m[3])} ${MESES[Number(m[2]) - 1]} ${m[1]}` : null;
}

/** ¿Algún equipo municipal tiene ya calendario publicado? */
export const hayDatosMunicipales = gruposMunicipales.some((g) => g.misPartidos.length > 0);
