export interface Equipo {
  nombre: string;
  division: string;
  /**
   * true = la Federación de Madrid de Voleibol ya ha publicado el
   * calendario/clasificación de este equipo (ver src/data/equipos-federados.json
   * y src/data/competicion.json, que alimenta el calendario en directo).
   * Solo se usa en las categorías federadas.
   */
  calendario?: boolean;
}

export interface Categoria {
  id: string;
  label: string;
  equipos: Equipo[];
}

// Roster de la temporada 2026/2027 facilitado por el club (11 sep 2026).
//
// OJO: a día de hoy, la ficha oficial del club en fmvoley.com
// (fmvoley.com/clubes/cde_manzanares_voley) solo recoge 6 equipos
// federados con grupo dado de alta — Juvenil, Cadete y Junior femenino
// (con calendario ya publicado, calendario:true) más Infantil masculino,
// Sénior femenino e Infantil femenino (dados de alta pero "sin resultados"
// todavía). El resto de equipos federados de esta lista (masculino Sénior/
// Juvenil/Cadete A/B y femenino Junior B, Juvenil B/C, Cadete B/C e
// Infantil A/B) no tienen grupo federado publicado en la Federación en
// este momento, así que no pueden mostrar calendario ni clasificación real
// hasta que la Federación los dé de alta (la temporada empieza el
// 27/09/2026). En cuanto FMVoley publique un grupo nuevo, se añade su
// grupoId a equipos-federados.json y el scraper lo recoge solo.
export const categorias: Categoria[] = [
  {
    id: "federado-masculino",
    label: "Federado masculino",
    equipos: [
      { nombre: "Sénior", division: "Liga federada" },
      { nombre: "Juvenil", division: "Liga federada" },
      { nombre: "Cadete A", division: "Liga federada" },
      { nombre: "Cadete B", division: "Liga federada" },
      { nombre: "Infantil", division: "1ª División" },
    ],
  },
  {
    id: "federado-femenino",
    label: "Federado femenino",
    equipos: [
      { nombre: "Sénior", division: "Liga federada" },
      { nombre: "Junior A", division: "1ª División", calendario: true },
      { nombre: "Junior B", division: "Liga federada" },
      { nombre: "Juvenil A", division: "1ª División", calendario: true },
      { nombre: "Juvenil B", division: "Liga federada" },
      { nombre: "Juvenil C", division: "Liga federada" },
      { nombre: "Cadete A", division: "1ª División", calendario: true },
      { nombre: "Cadete B", division: "Liga federada" },
      { nombre: "Cadete C", division: "Liga federada" },
      { nombre: "Infantil A", division: "Liga federada" },
      { nombre: "Infantil B", division: "Liga federada" },
      { nombre: "Alevín", division: "Liga federada" },
    ],
  },
  {
    id: "municipal-femenino",
    label: "Municipal femenino",
    equipos: [
      { nombre: "Juvenil 2009", division: "Liga Municipal" },
      { nombre: "Juvenil 2010", division: "Liga Municipal" },
      { nombre: "Cadete 2011", division: "Liga Municipal" },
      { nombre: "Cadete 2012", division: "Liga Municipal" },
      { nombre: "Infantil 2013 A", division: "Liga Municipal" },
      { nombre: "Infantil 2013 F", division: "Liga Municipal" },
    ],
  },
  {
    id: "municipal-mixto",
    label: "Municipal mixto",
    equipos: [
      { nombre: "Infantil", division: "Liga Municipal · Mixto" },
      { nombre: "Alevín", division: "Liga Municipal · Mixto" },
    ],
  },
];

// Pabellones registrados en la Federación de Madrid de Voleibol
// (ficha del club en fmvoley.com).
export const sedes = [
  {
    nombre: "Colegio Nueva Castilla",
    nota: "Calle Mazaterón 12, 28051 Madrid",
  },
  {
    nombre: "Colegio Greenfield",
    nota: "Ctra. de Carabanchel a Villaverde 82, Villaverde, 28021 Madrid",
  },
];
