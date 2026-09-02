export interface Partido {
  cat: string;
  local: string;
  visitante: string;
  fecha: string;
}

// Datos de ejemplo de la temporada 2025/2026. Rivales por confirmar.
export const partidos: Partido[] = [
  {
    cat: "Infantil",
    local: "Infantil A",
    visitante: "[Rival por confirmar]",
    fecha: "Sábado 6 de septiembre",
  },
  {
    cat: "Cadete Fem.",
    local: "Cadete Fem.",
    visitante: "[Rival por confirmar]",
    fecha: "Sábado 6 de septiembre",
  },
  {
    cat: "Juvenil",
    local: "Juvenil A",
    visitante: "[Rival por confirmar]",
    fecha: "Domingo 7 de septiembre",
  },
];
