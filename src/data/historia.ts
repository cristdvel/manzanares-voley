export interface Hito {
  year: string;
  titulo: string;
  texto: string;
}

export const hitos: Hito[] = [
  { year: "2016", titulo: "Fundación oficial", texto: "3 equipos, 42 jugadoras." },
  { year: "2016/17", titulo: "Primeras ligas federadas", texto: "Participación en la AMB CUP en Portugal." },
  { year: "2017/18", titulo: "Primer campeón", texto: "Benjamín Mixto, Copa Primavera." },
  { year: "2018/19", titulo: "Ascenso histórico", texto: "Infantil Femenino asciende a 2ª División." },
  { year: "2019/20", titulo: "Pandemia COVID-19", texto: "Entrenamientos online para mantener al club unido." },
  { year: "2020/21", titulo: "Retorno a la pista", texto: "Cadete Femenino asciende a 2ª División." },
  { year: "2021/22", titulo: "Final Four", texto: "Infantil Masculino llega a la Final Four de 1ª División." },
  { year: "2022/23", titulo: "Doble ascenso", texto: "Dos equipos suben a 1ª División. Bronce nacional en la Copa de España." },
  { year: "2023/24", titulo: "7 fases finales", texto: "Infantil Masculino, subcampeón INVICTO." },
  { year: "2024/25", titulo: "7 escuelas vinculadas", texto: "Copa de España organizada en 3 sedes." },
  { year: "2025/26", titulo: "25 equipos", texto: "+325 deportistas. Estreno de la web oficial." },
];

export interface Logro {
  icon: string;
  titulo: string;
  year: string;
}

export const palmares: Logro[] = [
  { icon: "🏆", titulo: "Benjamín Mixto — Campeón Copa Primavera", year: "2017/18" },
  { icon: "🥈", titulo: "Infantil Femenino — Ascenso a 2ª División", year: "2018/19" },
  { icon: "🥈", titulo: "Cadete Femenino — Ascenso a 2ª División", year: "2020/21" },
  { icon: "🏆", titulo: "Infantil Masculino — Final Four 1ª División", year: "2021/22" },
  { icon: "🥉", titulo: "Bronce nacional — Copa de España", year: "2022/23" },
  { icon: "🏆", titulo: "Doble ascenso a 1ª División", year: "2022/23" },
  { icon: "🥈", titulo: "Infantil Masculino — Subcampeón INVICTO", year: "2023/24" },
];
