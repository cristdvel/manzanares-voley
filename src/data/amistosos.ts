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
        rival: "Por confirmar",
        lugar: "Pinto · Pol. Príncipe de Asturias",
      },
    ],
    nota: "🏐 Domingo 4 de octubre comenzamos la liga de locales.",
  },
  {
    id: "alevin-fem",
    categoria: "Alevín Femenino",
    partidos: [
      {
        fecha: "Sáb 26 sep",
        hora: "09:30",
        rival: "AVP",
        lugar: "Pabellón CEIP José Hierro (entrada puerta trasera)",
        mapa: "https://maps.apple/p/buKCcH31Q.RnmT",
      },
      {
        fecha: "Sáb 26 sep",
        hora: "10:30",
        rival: "CV Alcalá B",
        lugar: "Pabellón CEIP José Hierro (entrada puerta trasera)",
        mapa: "https://maps.apple/p/buKCcH31Q.RnmT",
      },
    ],
  },
];
