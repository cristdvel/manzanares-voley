// Textos largos de las secciones "El Club" y "Tienda".
// Reemplazar imágenes de Unsplash por fotos reales antes del lanzamiento.

export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const heroImg = unsplash("1592656094267-764a45160876", 1600);
export const tiendaStripImg = unsplash("1571902943202-507ec2618e8f");
export const clubImg = unsplash("1612872087720-bb876e2e67d1");

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

export const staff = [
  { role: "Presidencia" },
  { role: "Dirección deportiva" },
  { role: "Coordinación de cantera" },
  { role: "Preparación física" },
  { role: "Coordinación femenina" },
  { role: "Secretaría y delegación" },
];

export const productos = [
  {
    img: unsplash("1517649763962-0c623066013b"),
    titulo: "Equipación de juego",
    texto: "Camiseta, pantalón y medias oficiales del club.",
  },
  {
    img: unsplash("1556821840-3a63f95609a7"),
    titulo: "Sudaderas y ropa de entreno",
    texto: "Sudaderas, cortavientos y camisetas técnicas.",
  },
  {
    img: unsplash("1579952363873-27f3bade9f55"),
    titulo: "Accesorios",
    texto: "Balones, mochilas y complementos del club.",
  },
  {
    img: unsplash("1560089000-7433a4ebbd64"),
    titulo: "Colección 10º Aniversario",
    texto: "Tazas, camisetas conmemorativas y detalles de la década.",
  },
];
