import raw from "./competicion.json";

export interface FilaClasificacion {
  pos: number;
  equipo: string;
  esManzanares: boolean;
  pts: number;
  pj: number;
  pg: number;
  pp: number;
  setsFavor: number;
  setsContra: number;
  puntosFavor: number;
  puntosContra: number;
}

export interface Partido {
  id: number;
  jornada: number;
  fechaHora: string | null;
  local: string;
  visitante: string;
  pabellon: string | null;
  direccion?: string;
  mapa?: string;
  esManzanares: boolean;
  esLocal: boolean;
  aplazado: boolean;
  jugado?: boolean;
  resultado?: string;
  setsLocal?: number;
  setsVisitante?: number;
  categoria?: string;
}

export interface Jornada {
  numero: number;
  fecha: string | null;
  partidos: Partido[];
}

export interface Grupo {
  grupoId: number;
  categoria: string;
  division: string;
  competicion: string;
  fase: string;
  urlFmvoley: string;
  clasificacion: FilaClasificacion[];
  jornadas: Jornada[];
  misPartidos: Partido[];
}

export interface Competicion {
  actualizado: string;
  temporada: string;
  grupos: Grupo[];
  proximos: Partido[];
  ultimos: Partido[];
}

export const competicion = raw as Competicion;
export const { grupos, proximos, ultimos, temporada, actualizado } = competicion;

/** ¿Se ha jugado ya algún partido esta temporada? */
export const hayResultados =
  ultimos.length > 0 || grupos.some((g) => g.clasificacion.some((f) => f.pj > 0));

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function fechaCorta(iso: string | null): string {
  if (!iso) return "Por confirmar";
  const d = new Date(iso);
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}

export function horaCorta(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  if (h === 0 && m === 0) return null; // hora sin publicar
  return `${h}:${String(m).padStart(2, "0")} h`;
}

export function actualizadoTexto(): string {
  const d = new Date(actualizado);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${String(
    d.getUTCHours(),
  ).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}
