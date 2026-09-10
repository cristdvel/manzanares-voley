// Catálogo de la tienda oficial.
// Precios (€) confirmados por el club. El pago se hace por transferencia y el
// comprobante se adjunta al tramitar el pedido.
// Pendiente: precio del Abrigo Nepal y la foto del pantalón de juego que
// incluye el Pack Federado Masculino.
// Descripciones y características son de MUESTRA, pendientes de revisión del club.

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
  tallas: string[];
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
  tallas: string[];
  disponible: boolean;
  /** sólo packs: prendas que incluye, p. ej. "2 × Camiseta de juego". */
  incluye?: string[];
  /** sólo packs: un selector de talla por tipo de prenda (camisetas, malla, sudadera…). */
  tallasPack?: TallaGrupo[];
}

const TALLAS = ["XS", "S", "M", "L", "XL"];
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
      "Todo lo que necesita una jugadora federada para la temporada en un único pedido: 2 camisetas de juego, 2 camisetas de entreno, 1 sudadera del 10º aniversario, 1 mochila oficial y 2 mallas de partido. Eliges la talla de cada prenda (camisetas, mallas y sudadera); el club asigna los diseños de camiseta y malla según disponibilidad (puedes indicar tu preferencia en las notas del pedido).",
    imagenes: [
      // Camiseta de juego: los dos diseños, frente y espalda
      { src: "/img/equipacion/gatos-frente.png" },
      { src: "/img/equipacion/gatos-espalda.png" },
      { src: "/img/equipacion/claveles-frente.png" },
      { src: "/img/equipacion/claveles-espalda.png" },
      // Camiseta de entreno: corte femenino y masculino, frente y espalda
      { src: "/img/equipacion/entreno-fem.png" },
      { src: "/img/equipacion/entreno-fem-espalda.png" },
      { src: "/img/equipacion/entreno-masc.png" },
      { src: "/img/equipacion/entreno-masc-espalda.png" },
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
      "2 × Camiseta de entreno",
      "1 × Sudadera 10º aniversario",
      "1 × Mochila oficial",
      "2 × Malla de partido",
    ],
    caracteristicas: [
      "Ahorro frente a comprar cada prenda por separado",
      "Eliges talla de camisetas, de mallas y de sudadera por separado",
      "Diseños de camiseta y malla asignados por el club según stock",
      "Personalizable con nombre y dorsal (indícalo en las notas)",
    ],
    variantes: [],
    tallas: TALLAS,
    tallasPack: [
      { nombre: "Talla camisetas", tallas: TALLAS },
      { nombre: "Talla mallas", tallas: TALLAS },
      { nombre: "Talla sudadera", tallas: TALLAS },
    ],
    disponible: true,
  },
  {
    id: "pack-federado-masculino",
    nombre: "Pack Federado Masculino",
    categoria: "Packs",
    precio: 146,
    // TODO: cargar la foto del pantalón de juego (/img/equipacion/pantalon-juego.png).
    resumen: "El conjunto completo de temporada para jugadores federados.",
    descripcion:
      "El conjunto de temporada para jugadores federados: 2 pantalones de juego, 2 camisetas de juego, 2 camisetas de entreno, 1 sudadera del 10º aniversario y 1 mochila oficial. Eliges la talla de cada prenda (camisetas, pantalón y sudadera); el club asigna los diseños según disponibilidad.",
    imagenes: [
      // Camiseta de juego: los dos diseños, frente y espalda
      { src: "/img/equipacion/gatos-frente.png" },
      { src: "/img/equipacion/gatos-espalda.png" },
      { src: "/img/equipacion/claveles-frente.png" },
      { src: "/img/equipacion/claveles-espalda.png" },
      // Camiseta de entreno: corte femenino y masculino, frente y espalda
      { src: "/img/equipacion/entreno-fem.png" },
      { src: "/img/equipacion/entreno-fem-espalda.png" },
      { src: "/img/equipacion/entreno-masc.png" },
      { src: "/img/equipacion/entreno-masc-espalda.png" },
      // Sudadera
      { src: "/img/equipacion/sudadera-frente.png" },
      { src: "/img/equipacion/sudadera-espalda.png" },
      // Mochila
      { src: "/img/equipacion/mochila.png" },
    ],
    incluye: [
      "2 × Pantalón de juego",
      "2 × Camiseta de juego",
      "2 × Camiseta de entreno",
      "1 × Sudadera 10º aniversario",
      "1 × Mochila oficial",
    ],
    caracteristicas: [
      "Ahorro frente a comprar cada prenda por separado",
      "Eliges talla de camisetas, de pantalón y de sudadera por separado",
      "Foto del pantalón de juego pendiente de subir",
      "Personalizable con nombre y dorsal (indícalo en las notas)",
    ],
    variantes: [],
    tallas: TALLAS,
    tallasPack: [
      { nombre: "Talla camisetas", tallas: TALLAS },
      { nombre: "Talla pantalón", tallas: TALLAS },
      { nombre: "Talla sudadera", tallas: TALLAS },
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
      { src: "/img/equipacion/gatos-frente.png" },
      { src: "/img/equipacion/gatos-espalda.png" },
      { src: "/img/equipacion/entreno-fem.png" },
      { src: "/img/equipacion/entreno-fem-espalda.png" },
    ],
    incluye: [
      "2 × Camiseta de juego",
      "2 × Camiseta de entreno naranja",
    ],
    caracteristicas: [
      "Ahorro frente a comprar cada prenda por separado",
      "Una talla para las 4 camisetas",
      "Diseños asignados por el club según stock",
      "Personalizable con nombre y dorsal (indícalo en las notas)",
    ],
    variantes: [],
    tallas: TALLAS,
    tallasPack: [{ nombre: "Talla camisetas", tallas: TALLAS }],
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
      "Corte unisex; consulta la guía de tallas antes de pedir",
      "Personalizable con nombre y dorsal (indícalo en las notas del pedido)",
    ],
    variantes: [{ nombre: "Diseño", opciones: ["Gatos", "Claveles"] }],
    tallas: TALLAS,
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
    tallas: TALLAS,
    disponible: true,
  },
  {
    id: "camiseta-entreno",
    nombre: "Camiseta de entreno",
    categoria: "Ropa de entreno",
    precio: 30,
    resumen: "Camiseta técnica para el día a día. Corte femenino o masculino.",
    descripcion:
      "Camiseta técnica para los entrenamientos del día a día, en naranja con mangas negras y el logo del club en el pecho. Disponible en corte femenino y masculino para que siente bien a todo el mundo.",
    imagenes: [
      { src: "/img/equipacion/entreno-fem.png", variante: "Femenino" },
      { src: "/img/equipacion/entreno-fem-espalda.png", variante: "Femenino" },
      { src: "/img/equipacion/entreno-masc.png", variante: "Masculino" },
      { src: "/img/equipacion/entreno-masc-espalda.png", variante: "Masculino" },
    ],
    caracteristicas: [
      "Poliéster técnico transpirable",
      "Logo del club estampado en el pecho",
      "Corte específico femenino o masculino",
      "Uso recomendado para todas las categorías",
    ],
    variantes: [{ nombre: "Corte", opciones: ["Femenino", "Masculino"] }],
    tallas: TALLAS,
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
    tallas: TALLAS,
    disponible: true,
  },
  {
    id: "abrigo-nepal",
    nombre: "Abrigo Nepal",
    categoria: "Sudaderas y abrigo",
    precio: 0, // TODO: el club no ha facilitado el precio de este artículo.
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
