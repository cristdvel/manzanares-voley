// Catálogo de la tienda oficial.
// Precios (€) confirmados por el club. El pago se hace por transferencia y el
// comprobante se adjunta al tramitar el pedido.
// Descripciones y características son de MUESTRA, pendientes de revisión del club.
// Pendiente: fotos reales de correa y llavero; precio del imán.

export interface Variante {
  nombre: string;
  opciones: string[];
}

export interface Imagen {
  src: string;
  /** opción de variante a la que corresponde esta imagen (p. ej. "Gatos"). */
  variante?: string;
}

export interface TallaGrupo {
  /** etiqueta del selector, p. ej. "Talla camisetas". */
  nombre: string;
  /** mismas tallas para todo el mundo. Alternativa a "corte". */
  tallas?: string[];
  /**
   * cuando la talla depende de un selector de corte (chica/chico) que se
   * muestra junto a este grupo — el comprador elige el corte primero y la
   * lista de tallas cambia según su elección.
   */
  corte?: { chica: string[]; chico: string[] };
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  /** texto bajo el precio; si no se indica y el precio es 0 se muestra el aviso "provisional". */
  precioNota?: string;
  resumen: string;
  descripcion: string;
  imagenes: Imagen[];
  caracteristicas: string[];
  variantes: Variante[];
  /** mismas tallas para todo el mundo. Alternativa a "corte". Vacío si no hay tallas (accesorios). */
  tallas?: string[];
  /**
   * cuando la talla depende de un selector de corte (chica/chico) — el
   * comprador elige el corte primero y la lista de tallas cambia según su
   * elección. Alternativa a "tallas".
   */
  corte?: { chica: string[]; chico: string[] };
  disponible: boolean;
  /** sólo packs: prendas que incluye, p. ej. "2 × Camiseta de juego". */
  incluye?: string[];
  /** sólo packs: un selector de talla por tipo de prenda (camisetas, malla, sudadera…). */
  tallasPack?: TallaGrupo[];
  /**
   * sólo artículos sueltos (sin tallasPack): a qué prenda corresponde su
   * única talla, p. ej. "Malla" o "Camiseta de juego" — así en el excel de
   * pedidos la talla cae en la misma columna que usan los packs para esa
   * prenda, en vez de una columna "Talla" genérica.
   */
  prenda?: string;
}

const TALLAS = ["XS", "S", "M", "L", "XL"];
const TALLAS_MALLA = ["7/8", "9/11", "12/14", "16", "S", "M", "L", "XL"];
const TALLAS_ENTRENO = ["8", "12", "16", "S", "M", "L", "XL", "2XL"];
const TALLAS_CAMISETA_JUEGO_CHICA = ["XS", "S", "M", "L", "XL", "2XL"];
const TALLAS_CAMISETA_JUEGO_CHICO = ["7/8", "12/14", "16", "S", "M", "L", "XL"];
const TALLAS_PANTALON = ["7/8", "9/11", "12/14", "16", "S", "M", "L", "XL"];
const TALLAS_SUDADERA = ["7/8", "9/10", "11/12", "XS", "S", "M", "L", "XL", "2XL"];
const TALLA_UNICA = ["Única"];

export const productos: Producto[] = [
  // ---------------- PACKS ----------------
  {
    id: "pack-federado-femenino",
    nombre: "Pack Federado Femenino",
    categoria: "Packs",
    precio: 146,
    resumen: "El equipo completo de temporada para jugadoras federadas.",
    descripcion:
      "Todo lo que necesita una jugadora federada para la temporada en un único pedido: 2 camisetas de juego, 1 camiseta de entreno (naranja, para el día a día) y 1 de entrada en calor (fucsia, para antes de los partidos), 1 sudadera del 10º aniversario, 1 mochila oficial y 2 mallas de partido. Eliges la talla de cada prenda por separado; el club asigna los diseños de camiseta y malla según disponibilidad (puedes indicar tu preferencia en las notas del pedido).",
    imagenes: [
      // Camiseta de juego: los dos diseños, frente y espalda
      { src: "/img/equipacion/gatos-frente.png" },
      { src: "/img/equipacion/gatos-espalda.png" },
      { src: "/img/equipacion/claveles-frente.png" },
      { src: "/img/equipacion/claveles-espalda.png" },
      // Camiseta de entreno (naranja), frente y espalda
      { src: "/img/equipacion/entreno-fem.png" },
      { src: "/img/equipacion/entreno-fem-espalda.png" },
      // Camiseta de entrada en calor federado (fucsia), frente y espalda
      { src: "/img/equipacion/calentamiento-frente.png" },
      { src: "/img/equipacion/calentamiento-espalda.png" },
      // Sudadera
      { src: "/img/equipacion/sudadera-frente.png" },
      { src: "/img/equipacion/sudadera-espalda.png" },
      // Mallas de partido: los dos diseños, frente y espalda
      { src: "/img/equipacion/malla-gatos.png" },
      { src: "/img/equipacion/malla-gatos-espalda.png" },
      { src: "/img/equipacion/malla-claveles.png" },
      { src: "/img/equipacion/malla-claveles-espalda.png" },
      // Mochila
      { src: "/img/equipacion/mochila.png" },
    ],
    incluye: [
      "2 × Camiseta de juego",
      "1 × Camiseta de entreno (naranja)",
      "1 × Camiseta de entrada en calor federado (fucsia)",
      "1 × Sudadera 10º aniversario",
      "1 × Mochila oficial",
      "2 × Malla de partido",
    ],
    caracteristicas: [
      "Ahorro frente a comprar cada prenda por separado",
      "Eliges la talla de cada prenda por separado",
      "Diseños de camiseta y malla asignados por el club según stock",
      "Personalizable con nombre y dorsal en la camiseta de juego (indícalo en las notas)",
    ],
    variantes: [],
    tallas: TALLAS_CAMISETA_JUEGO_CHICA,
    tallasPack: [
      { nombre: "Talla camiseta de juego", tallas: TALLAS_CAMISETA_JUEGO_CHICA },
      { nombre: "Talla camiseta de entreno", tallas: TALLAS_ENTRENO },
      { nombre: "Talla camiseta de calentamiento", tallas: TALLAS_ENTRENO },
      { nombre: "Talla malla", tallas: TALLAS_MALLA },
      { nombre: "Talla sudadera", tallas: TALLAS_SUDADERA },
    ],
    disponible: true,
  },
  {
    id: "pack-federado-masculino",
    nombre: "Pack Federado Masculino",
    categoria: "Packs",
    precio: 146,
    resumen: "El conjunto completo de temporada para jugadores federados.",
    descripcion:
      "El conjunto de temporada para jugadores federados: 2 pantalones de juego, 2 camisetas de juego, 1 camiseta de entreno (naranja, para el día a día) y 1 de entrada en calor (fucsia, para antes de los partidos), 1 sudadera del 10º aniversario y 1 mochila oficial. Eliges la talla de cada prenda por separado; el club asigna los diseños según disponibilidad.",
    imagenes: [
      // Camiseta de juego: los dos diseños, frente y espalda
      { src: "/img/equipacion/gatos-frente.png" },
      { src: "/img/equipacion/gatos-espalda.png" },
      { src: "/img/equipacion/claveles-frente.png" },
      { src: "/img/equipacion/claveles-espalda.png" },
      // Pantalón de juego: los dos diseños
      { src: "/img/equipacion/pantalon-gatos.jpg" },
      { src: "/img/equipacion/pantalon-claveles.jpg" },
      // Camiseta de entreno (naranja), frente y espalda
      { src: "/img/equipacion/entreno-fem.png" },
      { src: "/img/equipacion/entreno-fem-espalda.png" },
      // Camiseta de entrada en calor federado (fucsia), frente y espalda
      { src: "/img/equipacion/calentamiento-frente.png" },
      { src: "/img/equipacion/calentamiento-espalda.png" },
      // Sudadera
      { src: "/img/equipacion/sudadera-frente.png" },
      { src: "/img/equipacion/sudadera-espalda.png" },
      // Mochila
      { src: "/img/equipacion/mochila.png" },
    ],
    incluye: [
      "2 × Pantalón de juego",
      "2 × Camiseta de juego",
      "1 × Camiseta de entreno (naranja)",
      "1 × Camiseta de entrada en calor federado (fucsia)",
      "1 × Sudadera 10º aniversario",
      "1 × Mochila oficial",
    ],
    caracteristicas: [
      "Ahorro frente a comprar cada prenda por separado",
      "Eliges la talla de cada prenda por separado",
      "Diseños de camiseta y pantalón asignados por el club según stock",
      "Personalizable con nombre y dorsal en la camiseta de juego (indícalo en las notas)",
    ],
    variantes: [],
    tallas: TALLAS_CAMISETA_JUEGO_CHICO,
    tallasPack: [
      { nombre: "Talla camiseta de juego", tallas: TALLAS_CAMISETA_JUEGO_CHICO },
      { nombre: "Talla camiseta de entreno", tallas: TALLAS_ENTRENO },
      { nombre: "Talla camiseta de calentamiento", tallas: TALLAS_ENTRENO },
      { nombre: "Talla pantalón", tallas: TALLAS_PANTALON },
      { nombre: "Talla sudadera", tallas: TALLAS_SUDADERA },
    ],
    disponible: true,
  },
  {
    id: "pack-municipal",
    nombre: "Pack Municipal",
    categoria: "Packs",
    precio: 70,
    resumen: "Lo justo para competición municipal: 2 camisetas de juego y 2 de entreno.",
    descripcion:
      "El pack para jugadoras y jugadores de competición municipal: 2 camisetas de juego y 2 camisetas de entreno naranjas. Eliges la talla de las camisetas; el club asigna los diseños según disponibilidad.",
    imagenes: [
      // Camiseta de juego: los dos diseños, frente y espalda
      { src: "/img/equipacion/gatos-frente.png" },
      { src: "/img/equipacion/gatos-espalda.png" },
      { src: "/img/equipacion/claveles-frente.png" },
      { src: "/img/equipacion/claveles-espalda.png" },
      { src: "/img/equipacion/entreno-fem.png" },
      { src: "/img/equipacion/entreno-fem-espalda.png" },
    ],
    incluye: [
      "2 × Camiseta de juego",
      "2 × Camiseta de entreno naranja",
    ],
    caracteristicas: [
      "Ahorro frente a comprar cada prenda por separado",
      "Eliges la talla de la camiseta de juego y de la de entreno por separado",
      "Diseños asignados por el club según stock",
      "Personalizable con nombre y dorsal en la camiseta de juego (indícalo en las notas)",
    ],
    variantes: [],
    tallasPack: [
      {
        nombre: "Talla camiseta de juego",
        corte: { chica: TALLAS_CAMISETA_JUEGO_CHICA, chico: TALLAS_CAMISETA_JUEGO_CHICO },
      },
      { nombre: "Talla camiseta de entreno", tallas: TALLAS_ENTRENO },
    ],
    disponible: true,
  },

  // ---------------- ARTÍCULOS SUELTOS ----------------
  {
    id: "camiseta-juego",
    nombre: "Camiseta de juego · 10º aniversario",
    categoria: "Equipación de juego",
    precio: 40,
    resumen: "Camiseta oficial de competición, en los diseños «Gatos» y «Claveles».",
    descripcion:
      "Camiseta oficial de competición de la colección del 10º aniversario, disponible en los dos diseños conmemorativos: «Gatos» y «Claveles». Sublimación total, escudo del aniversario y corte pensado para el juego. Es la prenda que se usa en todos los partidos federados y municipales.",
    imagenes: [
      { src: "/img/equipacion/gatos-frente.png", variante: "Gatos" },
      { src: "/img/equipacion/gatos-espalda.png", variante: "Gatos" },
      { src: "/img/equipacion/claveles-frente.png", variante: "Claveles" },
      { src: "/img/equipacion/claveles-espalda.png", variante: "Claveles" },
    ],
    caracteristicas: [
      "Tejido técnico 100% poliéster, ligero y transpirable",
      "Sublimación total: el estampado no se agrieta ni se despega",
      "Costuras planas anti-rozaduras",
      "Cortes distintos para chica y chico; elige el tuyo antes de la talla",
      "Personalizable con nombre y dorsal (indícalo en las notas del pedido)",
    ],
    variantes: [{ nombre: "Diseño", opciones: ["Gatos", "Claveles"] }],
    corte: { chica: TALLAS_CAMISETA_JUEGO_CHICA, chico: TALLAS_CAMISETA_JUEGO_CHICO },
    prenda: "Camiseta de juego",
    disponible: true,
  },
  {
    id: "malla-juego",
    nombre: "Malla de juego · 10º aniversario",
    categoria: "Equipación de juego",
    precio: 25,
    resumen: "Malla corta a juego con la camiseta, en «Gatos» y «Claveles».",
    descripcion:
      "Malla corta a juego con la camiseta, en los dos diseños del aniversario. Ajuste ceñido que no limita el movimiento y cintura ancha que no marca. Diseñada para que la lleven cómoda todas las categorías.",
    imagenes: [
      { src: "/img/equipacion/malla-gatos.png", variante: "Gatos" },
      { src: "/img/equipacion/malla-gatos-espalda.png", variante: "Gatos" },
      { src: "/img/equipacion/malla-claveles.png", variante: "Claveles" },
      { src: "/img/equipacion/malla-claveles-espalda.png", variante: "Claveles" },
    ],
    caracteristicas: [
      "Tejido elástico en 4 direcciones",
      "Cintura ancha que no marca",
      "Sublimación total a juego con la camiseta",
      "Secado rápido",
    ],
    variantes: [{ nombre: "Diseño", opciones: ["Gatos", "Claveles"] }],
    tallas: TALLAS_MALLA,
    prenda: "Malla",
    disponible: true,
  },
  {
    id: "camiseta-entreno",
    nombre: "Camiseta de entreno",
    categoria: "Ropa de entreno",
    precio: 10,
    resumen: "Camiseta técnica naranja para el entreno del día a día.",
    descripcion:
      "Camiseta técnica para los entrenamientos del día a día, en naranja con mangas negras y el logo del club en el pecho.",
    imagenes: [
      { src: "/img/equipacion/entreno-fem.png" },
      { src: "/img/equipacion/entreno-fem-espalda.png" },
    ],
    caracteristicas: [
      "Poliéster técnico transpirable",
      "Logo del club estampado en el pecho",
      "Corte unisex",
      "Uso recomendado para todas las categorías",
    ],
    variantes: [],
    tallas: TALLAS_ENTRENO,
    prenda: "Camiseta de entreno",
    disponible: true,
  },
  {
    id: "camiseta-calentamiento",
    nombre: "Camiseta de entrada en calor federado",
    categoria: "Ropa de entreno",
    precio: 10,
    resumen: "Camiseta fucsia de entrada en calor para partidos, equipos federados.",
    descripcion:
      "Camiseta fucsia que usan los equipos federados para el calentamiento previo al partido (distinta de la camiseta de entreno naranja del día a día).",
    imagenes: [
      { src: "/img/equipacion/calentamiento-frente.png" },
      { src: "/img/equipacion/calentamiento-espalda.png" },
    ],
    caracteristicas: [
      "Solo para equipos federados: uso previo al partido",
      "Poliéster técnico transpirable",
      "Corte unisex",
    ],
    variantes: [],
    tallas: TALLAS_ENTRENO,
    prenda: "Camiseta de calentamiento",
    disponible: true,
  },
  {
    id: "sudadera-aniversario",
    nombre: "Sudadera 10º aniversario",
    categoria: "Sudaderas y abrigo",
    precio: 30,
    resumen: "Sudadera con capucha gris con el logo «10 aniversario».",
    descripcion:
      "Sudadera con capucha gris jaspeado, con el logo «10 aniversario» en el pecho y las huellas en la espalda. La pieza estrella de la colección: para el pabellón, el cole o la calle.",
    imagenes: [
      { src: "/img/equipacion/sudadera-frente.png" },
      { src: "/img/equipacion/sudadera-espalda.png" },
    ],
    caracteristicas: [
      "Mezcla algodón/poliéster, interior tipo felpa",
      "Capucha con cordón y bolsillo canguro",
      "Estampado serigrafiado en negro",
      "Unisex",
    ],
    variantes: [],
    tallas: TALLAS_SUDADERA,
    prenda: "Sudadera",
    disponible: true,
  },
  {
    id: "abrigo-nepal",
    nombre: "Abrigo Nepal",
    categoria: "Sudaderas y abrigo",
    precio: 60,
    resumen: "Abrigo acolchado negro con capucha para el invierno.",
    descripcion:
      "Abrigo acolchado negro con capucha, para los pabellones fríos y los desplazamientos de invierno. Ligero pero cálido, con el logo del club y el dorsal bordados.",
    imagenes: [{ src: "/img/equipacion/abrigo.png" }],
    caracteristicas: [
      "Acolchado ligero y cálido",
      "Capucha fija, cierre de cremallera",
      "Bolsillos laterales con cremallera",
      "Logo del club y dorsal bordados",
    ],
    variantes: [],
    tallas: TALLAS,
    prenda: "Abrigo",
    disponible: true,
  },
  {
    id: "mochila",
    nombre: "Mochila oficial",
    categoria: "Accesorios",
    precio: 26,
    resumen: "Mochila negra con compartimento inferior para el calzado.",
    descripcion:
      "Mochila negra con compartimento inferior separado para el calzado y el logo del club estampado. La que usan todos los equipos para entrenar y competir.",
    imagenes: [{ src: "/img/equipacion/mochila.png" }],
    caracteristicas: [
      "Compartimento inferior separado para botas/zapatillas",
      "Bolsillo grande principal + bolsillo frontal",
      "Tirantes acolchados y asa superior",
      "Capacidad ~30 L",
    ],
    variantes: [],
    tallas: TALLA_UNICA,
    prenda: "Mochila",
    disponible: true,
  },
  // TODO: falta foto real y descripción/características confirmadas por el
  // club para estos 7 artículos (precios ya confirmados). De momento usan
  // /img/equipacion/proximamente.svg como imagen provisional.
  {
    id: "toalla",
    nombre: "Toalla oficial",
    categoria: "Accesorios",
    precio: 30,
    resumen: "Toalla con el logo del club.",
    descripcion: "Toalla oficial del club, con el logo de Manzanares Voley estampado.",
    imagenes: [{ src: "/img/equipacion/toalla.jpg" }],
    caracteristicas: ["Estampado a color con el logo del 10º aniversario"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
  {
    id: "taza",
    nombre: "Taza oficial",
    categoria: "Accesorios",
    precio: 8,
    resumen: "Taza con el logo del club.",
    descripcion: "Taza oficial del club, con el logo de Manzanares Voley estampado.",
    imagenes: [{ src: "/img/equipacion/taza.jpg" }],
    caracteristicas: ["Estampado a color con el logo del 10º aniversario"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
  {
    id: "botella",
    nombre: "Botella oficial",
    categoria: "Accesorios",
    precio: 12,
    resumen: "Botella reutilizable con el logo del club.",
    descripcion: "Botella reutilizable oficial del club, con el logo de Manzanares Voley estampado y mosquetón para engancharla a la mochila.",
    imagenes: [{ src: "/img/equipacion/botella.jpg" }, { src: "/img/equipacion/botella-2.jpg" }],
    caracteristicas: ["Con mosquetón para enganchar a la mochila"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
  {
    id: "bufanda",
    nombre: "Bufanda oficial",
    categoria: "Accesorios",
    precio: 12,
    resumen: "Bufanda con los colores del club.",
    descripcion: "Bufanda oficial del club, con los colores y el logo de Manzanares Voley.",
    imagenes: [{ src: "/img/equipacion/bufanda.jpg" }],
    caracteristicas: ["Estampado a color con el logo del 10º aniversario"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
  {
    id: "correa",
    nombre: "Correa oficial",
    categoria: "Accesorios",
    precio: 3,
    resumen: "Correa con el logo del club.",
    descripcion: "Correa oficial del club, con el logo de Manzanares Voley estampado.",
    imagenes: [{ src: "/img/equipacion/proximamente.svg" }],
    caracteristicas: ["Foto pendiente de subir por el club"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
  {
    id: "llavero",
    nombre: "Llavero oficial",
    categoria: "Accesorios",
    precio: 3,
    resumen: "Llavero con el logo del club.",
    descripcion: "Llavero oficial del club, con el logo de Manzanares Voley.",
    imagenes: [{ src: "/img/equipacion/proximamente.svg" }],
    caracteristicas: ["Foto pendiente de subir por el club"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
  {
    id: "banderin",
    nombre: "Banderín oficial",
    categoria: "Accesorios",
    precio: 8,
    resumen: "Banderín con el escudo del club.",
    descripcion: "Banderín oficial del club, con el escudo de Manzanares Voley y flecos.",
    imagenes: [{ src: "/img/equipacion/banderin.jpg" }],
    caracteristicas: ["Con flecos y cordón para colgar"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
  // TODO: precio del imán pendiente de confirmar por el club.
  {
    id: "iman",
    nombre: "Imán oficial",
    categoria: "Accesorios",
    precio: 0,
    resumen: "Imán de nevera con el logo del club.",
    descripcion: "Imán de nevera oficial del club, con el logo de Manzanares Voley.",
    imagenes: [{ src: "/img/equipacion/imanes.jpg" }],
    caracteristicas: ["Foto de muestra; precio pendiente de confirmar por el club"],
    variantes: [],
    tallas: TALLA_UNICA,
    disponible: true,
  },
];

export const categoriasTienda = [...new Set(productos.map((p) => p.categoria))];

export const getProducto = (id: string) => productos.find((p) => p.id === id);

export function getRelacionados(prod: Producto, max = 3): Producto[] {
  const mismos = productos.filter((p) => p.id !== prod.id && p.categoria === prod.categoria);
  const otros = productos.filter((p) => p.id !== prod.id && p.categoria !== prod.categoria);
  return [...mismos, ...otros].slice(0, max);
}
