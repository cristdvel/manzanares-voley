// Textos largos de las secciones "El Club" y "Tienda".
// Fotos reales del club en /public/img/ (fuente original: "Manzanares Voley/Web").

export const heroImg = "/img/hero.jpg";
export const clubImg = "/img/club-familia.jpg";
export const tiendaStripImg = "/img/equipacion.jpg";
export const historiaImg = "/img/historia.jpg";
export const staffImg = "/img/staff.jpg";

export const quienesSomos = [
  "El Club Manzanares Voley nació en abril de 2016 de la mano de un grupo de padres y madres comprometidos. Su motivación era sencilla pero poderosa: dar continuidad deportiva y competitiva a sus hijas cuando terminaban su etapa en el colegio.",
  "Bajo la guía de una entrenadora apasionada, comenzamos nuestra andadura con solo 3 equipos y 42 jugadoras, todas mujeres. Hoy, esa pequeña semilla ha florecido en un club mixto, transversal y multicultural que cuenta con 25 equipos que compiten tanto en ligas municipales como en la exigente federación madrileña.",
];

export const mvv = [
  {
    icon: "🎯",
    titulo: "Misión",
    texto:
      "Formar personas a través del voleibol, ofreciendo a niñas, niños y adultos del barrio un proyecto deportivo de calidad, cercano y competitivo, donde crecer dentro y fuera de la pista.",
  },
  {
    icon: "⭐",
    titulo: "Visión",
    texto:
      "Ser un club de referencia en Madrid por su cantera, su ambiente familiar y su compromiso con el deporte base, manteniendo viva la ilusión con la que empezamos en 2016.",
  },
  {
    icon: "❤️",
    titulo: "Valores",
    texto:
      "Pertenencia, continuidad, inclusión y educación. Cuatro ideas que explican quiénes somos y cómo entrenamos, competimos y convivimos cada temporada.",
  },
];

export const valores = [
  {
    titulo: "Sentido de Pertenencia",
    texto:
      "Cada camiseta naranja en el barrio nos identifica. Sentirse parte de Manzanares Voley es defender unos colores, cuidar a los compañeros y representar al club dentro y fuera de la pista.",
  },
  {
    titulo: "Continuidad y Legado",
    texto:
      "Valoramos nuestra historia. La mayor prueba de nuestro éxito es que muchas jugadoras que empezaron siendo niñas siguen hoy en el club como veteranas, entrenadoras o delegadas.",
  },
  {
    titulo: "Inclusión y Diversidad",
    texto:
      "Respetamos y enriquecemos el club con las múltiples nacionalidades, culturas y realidades que conviven en nuestros equipos. Aquí cabe todo el que quiera jugar.",
  },
  {
    titulo: "Educación a través del Deporte",
    texto:
      "Creemos firmemente que el deporte es una herramienta educativa. El esfuerzo, el respeto al rival, la gestión de la derrota y el compromiso con el grupo se entrenan como se entrena un saque.",
  },
];

export const pilares = [
  {
    icon: "👨‍👩‍👧",
    titulo: "Valores Familiares",
    texto:
      "Padres, madres, jugadoras y técnicos formamos una comunidad. Las decisiones se toman pensando en las personas antes que en los resultados.",
  },
  {
    icon: "🌱",
    titulo: "Cantera de Éxito",
    texto:
      "Apostamos por el jugador de casa. Preferimos hacer crecer a nuestros deportistas desde Minivoley que buscar refuerzos de fuera.",
  },
  {
    icon: "🍏",
    titulo: "El Legado Manzanita",
    texto:
      "Lo que se construye permanece. Cada generación deja el club un poco mejor de como lo encontró para la siguiente.",
  },
];

export interface Producto {
  img: string;
  titulo: string;
  texto: string;
  href?: string; // si falta, la tarjeta no lleva botón "Ver productos"
}

export const productos: Producto[] = [
  {
    img: "/img/equipacion/gatos-frente.png",
    titulo: "Equipación de juego",
    texto: "Camisetas de juego «Gatos» y «Claveles», mallas y equipación oficial del 10º aniversario.",
    href: "/equipacion",
  },
  {
    img: "/img/equipacion/claveles-frente.png",
    titulo: "Colección 10º Aniversario",
    texto: "La colección conmemorativa de la década: equipaciones, sudadera y complementos.",
    href: "/equipacion",
  },
  {
    img: "/img/equipacion/sudadera-frente.png",
    titulo: "Sudaderas y ropa de entreno",
    texto: "Sudadera del 10º aniversario, camisetas de entreno y abrigo del club.",
  },
  {
    img: "/img/equipacion/mochila.png",
    titulo: "Accesorios",
    texto: "Mochila oficial, balones y complementos del club.",
  },
];
