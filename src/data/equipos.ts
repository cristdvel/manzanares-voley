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
  /** plazas libres del grupo de escuela, p. ej. "Quedan 2 plazas" o "Completa". */
  plazas?: string;
}

export interface Categoria {
  id: string;
  label: string;
  equipos: Equipo[];
}

// Roster de la temporada 2026/2027 facilitado por el club (11 sep 2026).
//
// Todos los equipos federados tienen ya su grupo en la Federación (el
// Alevín femenino se dio de alta el 7 oct 2026: 1ª Aut. Zonal, grupo B), así
// que todos muestran calendario y clasificación reales (calendario:true).
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
      { nombre: "Alevín", division: "1ª División Aut. Zonal", calendario: true, grupoId: 34338, grupo: "B" },
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
      { nombre: "Infantil naranja", division: "Juegos Deportivos Municipales" },
      { nombre: "Infantil azul", division: "Juegos Deportivos Municipales" },
      { nombre: "Infantil", division: "Juegos Deportivos Municipales" },
      { nombre: "Cadete", division: "Juegos Deportivos Municipales" },
      { nombre: "Cadete azul", division: "Juegos Deportivos Municipales" },
      { nombre: "Cadete naranja", division: "Juegos Deportivos Municipales" },
      { nombre: "Juvenil 2010", division: "Juegos Deportivos Municipales" },
      { nombre: "Juvenil blanco", division: "Juegos Deportivos Municipales" },
    ],
  },
  {
    id: "municipal-mixto",
    label: "Municipal mixto",
    equipos: [
      { nombre: "Benjamín · T. Bretón Manzanares", division: "Juegos Deportivos Municipales · Mixto" },
      { nombre: "Alevín · T. Bretón Manzanares", division: "Juegos Deportivos Municipales · Mixto" },
      { nombre: "Infantil", division: "Juegos Deportivos Municipales · Mixto" },
    ],
  },
  {
    id: "escuelas",
    label: "Escuelas",
    equipos: [
      { nombre: "Mixto Sénior", division: "Escuela Cebada", plazas: "Completa" },
      { nombre: "Juvenil Femenino", division: "Escuela Aluche", plazas: "Quedan plazas" },
      { nombre: "Cadete Femenino 2012", division: "Escuela Cebada", plazas: "Quedan 2 plazas" },
      { nombre: "Infantil Femenino 2013", division: "Escuela Fundí", plazas: "Queda 1 plaza" },
      { nombre: "Cadete Femenino 2011", division: "Escuela Fundí", plazas: "Quedan 2 plazas" },
      { nombre: "Cadete Femenino", division: "Escuela Aluche", plazas: "Quedan plazas" },
      { nombre: "Infantil Femenino", division: "Escuela Aluche", plazas: "Quedan plazas" },
      { nombre: "Infantil Mixto", division: "Escuela Gallur", plazas: "Quedan plazas" },
      { nombre: "Alevín Masculino", division: "Escuela Cebada", plazas: "Quedan plazas" },
      { nombre: "Alevín y Benjamín", division: "Escuela Gallur", plazas: "Quedan plazas" },
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
