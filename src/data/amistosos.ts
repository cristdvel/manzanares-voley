// Amistosos de pretemporada por categoría, facilitados por el club.
// La liga regular (federada o municipal) de cada categoría se publica en
// /calendario en cuanto la competición correspondiente arranca — ver
// src/data/competicion.ts.

export interface Amistoso {
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
        fecha: "Sáb 26 sep",
        hora: "09:30",
        rival: "AVP",
        lugar: "Pabellón CEIP José Hierro, Pinto (entrada puerta trasera)",
        mapa: "https://maps.apple/p/buKCcH31Q.RnmT",
      },
      {
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
        fecha: "Vie 25 sep",
        hora: "17:30",
        rival: "Colegio Saint Louis de los Franceses",
        lugar: "Pozuelo de Alarcón",
      },
      {
        fecha: "Sáb 26 sep",
        hora: "15:30",
        rival: "San Justo",
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
        fecha: "Dom 27 sep",
        hora: "16:30",
        rival: "AVP",
        lugar: "Parla",
      },
      {
        fecha: "Dom 27 sep",
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
        fecha: "Dom 27 sep",
        hora: "13:00–16:00",
        rival: "Pinto Juvenil 2ª",
        lugar: "Pinto",
      },
    ],
  },
  {
    id: "juvenil-c-fem",
    categoria: "Juvenil C Femenino",
    partidos: [
      {
        fecha: "Dom 27 sep",
        hora: "19:30",
        rival: "AVP A",
        lugar: "Parla",
      },
      {
        fecha: "Dom 27 sep",
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
        fecha: "Dom 27 sep",
        hora: "12:00",
        rival: "AVP",
        lugar: "Parla",
      },
      {
        fecha: "Dom 27 sep",
        hora: "16:00",
        rival: "Perales",
        lugar: "Parla",
      },
    ],
  },
  {
    id: "senior-master",
    categoria: "Sénior · Torneo Máster",
    partidos: [
      {
        fecha: "Sáb 26 sep",
        hora: "10:00 · gran final 19:00",
        rival: "III Torneo Máster «Villa de Zaratán» — Memorial Santos Antón",
        lugar: "Pabellón Infanta Juana, Zaratán (Valladolid)",
      },
    ],
    nota: "🏐 Manzanares Voley acude como invitado junto a Master Volley Spain, Master Volley Valladolid, Máster Mix Madrid, Vóley Máster Deusto y Los Abandonados por el Vóley. Entrada libre.",
  },
];
