// Amistosos de pretemporada por categoría, facilitados por el club.
// La liga regular (federada o municipal) de cada categoría se publica en
// /calendario en cuanto la competición correspondiente arranca — ver
// src/data/competicion.ts.

export interface Amistoso {
  /** fecha en formato AAAA-MM-DD, para poder calcular si ya se ha jugado. */
  fechaISO: string;
  fecha: string;
  hora?: string;
  rival: string;
  lugar?: string;
  mapa?: string;
}

export interface CategoriaAmistosos {
  id: string;
  categoria: string;
  partidos: Amistoso[];
  /** aviso puntual para la categoría, p. ej. el inicio de la liga. */
  nota?: string;
}

export const amistosos: CategoriaAmistosos[] = [
  {
    id: "alevin-fem",
    categoria: "Alevín Femenino",
    partidos: [
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "09:30",
        rival: "AVP",
        lugar: "Pabellón CEIP José Hierro, Pinto (entrada puerta trasera)",
        mapa: "https://maps.apple/p/buKCcH31Q.RnmT",
      },
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "10:30",
        rival: "CV Alcalá B",
        lugar: "Pabellón CEIP José Hierro, Pinto (entrada puerta trasera)",
        mapa: "https://maps.apple/p/buKCcH31Q.RnmT",
      },
    ],
  },
  {
    id: "infantil-a-fem",
    categoria: "Infantil A Femenino",
    partidos: [
      {
        fechaISO: "2026-09-25",
        fecha: "Vie 25 sep",
        hora: "17:30",
        rival: "Colegio Saint Louis de los Franceses",
        lugar: "Pozuelo de Alarcón",
      },
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "15:30",
        rival: "Pinto",
        lugar: "Pinto · Pol. Príncipe de Asturias",
      },
    ],
    nota: "🏐 Domingo 4 de octubre comenzamos la liga de locales.",
  },
  {
    id: "infantil-b-fem",
    categoria: "Infantil B Femenino",
    partidos: [
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "09:15–12:00",
        rival: "CDV",
        lugar: "CDV",
      },
    ],
  },
  {
    id: "cadete-a-fem",
    categoria: "Cadete A Femenino",
    partidos: [
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "10:00–11:30",
        rival: "Pinto 2ª",
        lugar: "Pinto",
      },
    ],
  },
  {
    id: "cadete-c-fem",
    categoria: "Cadete C Femenino",
    partidos: [
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "16:30",
        rival: "AVP",
        lugar: "Parla",
      },
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "17:30",
        rival: "Perales",
        lugar: "Parla",
      },
    ],
  },
  {
    id: "cadete-masc-a",
    categoria: "Cadete Masculino A",
    partidos: [
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "13:00–16:00",
        rival: "Pinto 1ª",
        lugar: "Pinto",
      },
    ],
  },
  {
    id: "juvenil-c-fem",
    categoria: "Juvenil C Femenino",
    partidos: [
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "19:30",
        rival: "AVP A",
        lugar: "Parla",
      },
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "20:30",
        rival: "AVP B",
        lugar: "Parla",
      },
    ],
  },
  {
    id: "juvenil-masc",
    categoria: "Juvenil Masculino",
    partidos: [
      {
        fechaISO: "2026-09-27",
        fecha: "Dom 27 sep",
        hora: "12:00",
        rival: "AVP",
        lugar: "Parla",
      },
      {
        fechaISO: "2026-09-27",
        fecha: "Dom 27 sep",
        hora: "16:00",
        rival: "Perales",
        lugar: "Parla",
      },
    ],
  },
  {
    id: "senior-masc",
    categoria: "Sénior Masculino",
    partidos: [
      {
        fechaISO: "2026-09-26",
        fecha: "Sáb 26 sep",
        hora: "10:00 · gran final 19:00",
        rival: "III Torneo Máster «Villa de Zaratán» — Memorial Santos Antón",
        lugar: "Pabellón Infanta Juana, Zaratán (Valladolid)",
      },
      {
        fechaISO: "2026-09-27",
        fecha: "Dom 27 sep",
        hora: "17:30",
        rival: "Por confirmar",
        lugar: "Parla",
      },
      {
        fechaISO: "2026-09-27",
        fecha: "Dom 27 sep",
        hora: "20:30",
        rival: "Por confirmar",
        lugar: "Parla",
      },
    ],
    nota: "🏐 Manzanares Voley acude como invitado junto a Master Volley Spain, Master Volley Valladolid, Máster Mix Madrid, Vóley Máster Deusto y Los Abandonados por el Vóley. Entrada libre.",
  },
];

const hoyISO = new Date().toISOString().slice(0, 10);

/**
 * Amistosos que aún no se han jugado (fechaISO >= hoy), agrupados por
 * categoría, y solo las categorías que les queda al menos uno. Es lo que
 * debe pintarse en la web — nunca `amistosos` directamente — para que los
 * partidos ya disputados desaparezcan solos.
 */
export const amistososVigentes: CategoriaAmistosos[] = amistosos
  .map((c) => ({ ...c, partidos: c.partidos.filter((p) => p.fechaISO >= hoyISO) }))
  .filter((c) => c.partidos.length > 0);
