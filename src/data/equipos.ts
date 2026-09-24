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
  /** grupoId de la FMVoley (ver equipos-federados.json) cuando calendario es true;
   * permite enlazar directo a su pestaña en /calendario. */
  grupoId?: number;
  /**
   * letra del grupo dentro de su división en la FMVoley (p. ej. "B"), cuando
   * la propia Federación distingue más de un grupo en esa división — se
   * muestra bajo la división para no confundirlo con el nombre del equipo.
   */
  grupo?: string;
}

export interface Categoria {
  id: string;
  label: string;
  equipos: Equipo[];
}

// Roster de la temporada 2026/2027 facilitado por el club (11 sep 2026).
//
// A día de hoy (24 sep 2026) solo el Alevín femenino sigue sin grupo
// federado publicado por la Federación, así que es el único que aún no
// puede mostrar calendario ni clasificación real (calendario:true en el
// resto). En cuanto FMVoley lo dé de alta, se añade su grupoId a
// equipos-federados.json y el scraper lo recoge solo.
export const categorias: Categoria[] = [
  {
    id: "federado-masculino",
    label: "Federado masculino",
    equipos: [
      { nombre: "Infantil", division: "1ª División Aut. Preferente", calendario: true, grupoId: 34021 },
      { nombre: "Cadete A", division: "2ª División Aut. Preferente", calendario: true, grupoId: 34252, grupo: "A" },
      { nombre: "Cadete B", division: "1ª División Aut. Zonal", calendario: true, grupoId: 34259 },
      { nombre: "Juvenil", division: "2ª División Aut. Preferente", calendario: true, grupoId: 34244, grupo: "B" },
      { nombre: "Sénior", division: "1ª División Aut. Zonal", calendario: true, grupoId: 34234, grupo: "B" },
    ],
  },
  {
    id: "federado-femenino",
    label: "Federado femenino",
    equipos: [
      { nombre: "Alevín", division: "Liga federada" },
      { nombre: "Infantil A", division: "2ª División Aut. Preferente", calendario: true, grupoId: 34047, grupo: "B" },
      { nombre: "Infantil B", division: "2ª División Aut. Zonal", calendario: true, grupoId: 34099, grupo: "C" },
      { nombre: "Cadete A", division: "1ª División Aut. Preferente", calendario: true, grupoId: 33922 },
      { nombre: "Cadete B", division: "1ª División Aut. Zonal", calendario: true, grupoId: 34122, grupo: "B" },
      { nombre: "Cadete C", division: "3ª División Aut. Zonal", calendario: true, grupoId: 34155, grupo: "D" },
      { nombre: "Juvenil A", division: "1ª División Aut. Preferente", calendario: true, grupoId: 33929 },
      { nombre: "Juvenil B", division: "1ª División Aut. Zonal", calendario: true, grupoId: 34173, grupo: "B" },
      { nombre: "Juvenil C", division: "3ª División Aut. Zonal", calendario: true, grupoId: 34200, grupo: "B" },
      { nombre: "Junior A", division: "1ª División Aut. Preferente", calendario: true, grupoId: 33941 },
      { nombre: "Junior B", division: "1ª División Aut. Zonal", calendario: true, grupoId: 34215, grupo: "A" },
      { nombre: "Sénior", division: "2ª División Aut. Preferente", calendario: true, grupoId: 34075, grupo: "A" },
    ],
  },
  {
    id: "municipal-femenino",
    label: "Municipal femenino",
    equipos: [
      { nombre: "Infantil 2013 A", division: "Liga Municipal" },
      { nombre: "Infantil 2013 F", division: "Liga Municipal" },
      { nombre: "Cadete 2011", division: "Liga Municipal" },
      { nombre: "Cadete 2012", division: "Liga Municipal" },
      { nombre: "Juvenil 2009", division: "Liga Municipal" },
      { nombre: "Juvenil 2010", division: "Liga Municipal" },
    ],
  },
  {
    id: "municipal-mixto",
    label: "Municipal mixto",
    equipos: [
      { nombre: "Alevín", division: "Liga Municipal · Mixto" },
      { nombre: "Infantil", division: "Liga Municipal · Mixto" },
    ],
  },
];

export interface FotoEquipo {
  equipo: string;
  categoria: string;
  foto: string;
}

// Fotos reales de la temporada, facilitadas por el club (14 sep 2026).
// La foto de "Cadete masculino" no venía separada por A/B: se muestra
// sin distinguir hasta que el club confirme a qué equipo corresponde.
export const fotosEquipos: FotoEquipo[] = [
  { equipo: "Sénior", categoria: "Femenino", foto: "/img/equipos/senior-femenino.jpg" },
  { equipo: "Sénior", categoria: "Masculino", foto: "/img/equipos/senior-masculino.jpg" },
  { equipo: "Junior A", categoria: "Femenino", foto: "/img/equipos/junior-a-femenino.jpg" },
  { equipo: "Junior B", categoria: "Femenino", foto: "/img/equipos/junior-b-femenino.jpg" },
  { equipo: "Juvenil A", categoria: "Femenino", foto: "/img/equipos/juvenil-a-femenino.jpg" },
  { equipo: "Juvenil", categoria: "Masculino", foto: "/img/equipos/juvenil-masculino.jpg" },
  { equipo: "Cadete", categoria: "Masculino", foto: "/img/equipos/cadete-masculino.jpg" },
  { equipo: "Infantil A", categoria: "Femenino", foto: "/img/equipos/infantil-a-femenino.jpg" },
  { equipo: "Alevín", categoria: "Femenino", foto: "/img/equipos/alevin-femenino.jpg" },
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
