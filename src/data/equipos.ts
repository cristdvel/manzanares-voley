export interface Equipo {
  nombre: string;
  division: string;
  meta: string;
}

export interface Categoria {
  id: string;
  label: string;
  equipos: Equipo[];
}

// Horarios y divisiones de ejemplo, coherentes con la información del club.
// Pendiente de confirmar los datos definitivos de la temporada.
export const categorias: Categoria[] = [
  {
    id: "minivoley",
    label: "Minivoley",
    equipos: [
      { nombre: "Minivoley Mixto A", division: "Iniciación · Mixto", meta: "Lunes y jueves 17:30 h · Pabellón Colegio Perú" },
      { nombre: "Minivoley Mixto B", division: "Iniciación · Mixto", meta: "Martes y jueves 17:30 h · Pabellón Larra" },
    ],
  },
  {
    id: "benjamin",
    label: "Benjamín",
    equipos: [
      { nombre: "Benjamín Mixto A", division: "Liga Municipal · Mixto", meta: "Lunes y miércoles 18:00 h · Pabellón Jovellanos" },
      { nombre: "Benjamín Mixto B", division: "Liga Municipal · Mixto", meta: "Martes y jueves 18:00 h · Pabellón Larra" },
    ],
  },
  {
    id: "alevin",
    label: "Alevín",
    equipos: [
      { nombre: "Alevín Femenino A", division: "Liga Municipal", meta: "Lunes y miércoles 18:00 h · Pabellón Colegio Perú" },
      { nombre: "Alevín Masculino", division: "Liga Municipal", meta: "Martes y jueves 18:00 h · Pabellón Colegio Perú" },
    ],
  },
  {
    id: "infantil",
    label: "Infantil",
    equipos: [
      { nombre: "Infantil A", division: "1ª División", meta: "Martes y jueves 18:30 h · Pabellón Tomás Bretón" },
      { nombre: "Infantil B", division: "2ª División", meta: "Lunes y miércoles 18:30 h · Pabellón San Ignacio" },
      { nombre: "Infantil Masculino", division: "1ª División", meta: "Martes y jueves 19:00 h · Pabellón Tomás Bretón" },
    ],
  },
  {
    id: "cadete",
    label: "Cadete",
    equipos: [
      { nombre: "Cadete Femenino A", division: "2ª División", meta: "Lunes y miércoles 19:30 h · Pabellón San Ignacio" },
      { nombre: "Cadete Femenino B", division: "3ª División", meta: "Martes y jueves 19:00 h · Pabellón Dicenta" },
      { nombre: "Cadete Masculino", division: "2ª División", meta: "Lunes y miércoles 19:30 h · Pabellón Tomás Bretón" },
    ],
  },
  {
    id: "juvenil",
    label: "Juvenil",
    equipos: [
      { nombre: "Juvenil A", division: "1ª División", meta: "Martes y jueves 20:00 h · Pabellón San Ignacio" },
      { nombre: "Juvenil Femenino B", division: "2ª División", meta: "Lunes y miércoles 20:00 h · Pabellón Dicenta" },
    ],
  },
  {
    id: "adultos",
    label: "Adultos",
    equipos: [
      { nombre: "Escuela de Adultos", division: "Recreativo · Mixto", meta: "Viernes 20:00 h · Pistas Senior Salamanca" },
      { nombre: "Sénior Femenino", division: "Liga Municipal", meta: "Martes y jueves 21:00 h · Pistas Senior Salamanca" },
    ],
  },
];

// Pabellones registrados en la Federación de Madrid de Voleibol.
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
