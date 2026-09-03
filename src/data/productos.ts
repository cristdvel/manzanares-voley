// Catálogo de la tienda oficial.
// Precios a 0 € temporalmente: el pago se hace por transferencia y el
// comprobante se adjunta al tramitar el pedido.
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

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  resumen: string;
  descripcion: string;
  imagenes: Imagen[];
  caracteristicas: string[];
  variantes: Variante[];
  tallas: string[];
  disponible: boolean;
}

const TALLAS = ["XS", "S", "M", "L", "XL"];
const TALLA_UNICA = ["Única"];

export const productos: Producto[] = [
  {
    id: "camiseta-juego",
    nombre: "Camiseta de juego · 10º aniversario",
    categoria: "Equipación de juego",
    precio: 0,
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
    precio: 0,
    resumen: "Malla corta a juego con la camiseta, en «Gatos» y «Claveles».",
    descripcion:
      "Malla corta a juego con la camiseta, en los dos diseños del aniversario. Ajuste ceñido que no limita el movimiento y cintura ancha que no marca. Diseñada para que la lleven cómoda todas las categorías.",
    imagenes: [
      { src: "/img/equipacion/malla-gatos.png", variante: "Gatos" },
      { src: "/img/equipacion/malla-claveles.png", variante: "Claveles" },
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
    precio: 0,
    resumen: "Camiseta técnica para el día a día. Corte femenino o masculino.",
    descripcion:
      "Camiseta técnica para los entrenamientos del día a día, en naranja con mangas negras y el logo del club en el pecho. Disponible en corte femenino y masculino para que siente bien a todo el mundo.",
    imagenes: [
      { src: "/img/equipacion/entreno-fem.png", variante: "Femenino" },
      { src: "/img/equipacion/entreno-masc.png", variante: "Masculino" },
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
    precio: 0,
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
    precio: 0,
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
    precio: 0,
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
