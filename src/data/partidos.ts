export interface Partido {
  cat: string;
  local: string;
  visitante: string;
  meta: string;
}

// Datos de ejemplo de la temporada 2025/2026. Rivales por confirmar.
export const partidos: Partido[] = [
  {
    cat: "Infantil",
    local: "Infantil A",
    visitante: "[Rival por confirmar]",
    meta: "Sábado 6 sep · Pabellón Tomás Bretón · 11:00 h",
  },
  {
    cat: "Cadete Fem.",
    local: "Cadete Fem.",
    visitante: "[Rival por confirmar]",
    meta: "Sábado 6 sep · Pabellón Perú · 12:30 h",
  },
  {
    cat: "Juvenil",
    local: "Juvenil A",
    visitante: "[Rival por confirmar]",
    meta: "Domingo 7 sep · Pabellón San Ignacio · 10:00 h",
  },
];
