// Catálogo de la tienda oficial.
// Precios a 0 € temporalmente: el pago se hace por transferencia y el
// comprobante se adjunta al tramitar el pedido.
// Descripciones y características son de MUESTRA, pendientes de revisión del club.

export interface Variante {
  nombre: string;
  opciones: string[];
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  imagenes: string[];
  descripcion: string;
  caracteristicas: string[];
  variantes: Variante[];
  tallas: string[];
  disponible: boolean;
}

const TALLAS_JUEGO = ["4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL", "XXL"];
const TALLAS_ROPA = ["6", "8", "10", "12", "14", "XS", "S", "M", "L", "XL", "XXL"];
const TALLA_UNICA = ["Única"];

export const productos: Producto[] = [
  {
    id: "camiseta-juego",
    nombre: "Camiseta de juego · 10º aniversario",
    categoria: "Equipación de juego",
    precio: 0,
    imagenes: ["/img/equipacion/gatos-frente.png", "/img/equipacion/claveles-frente.png"],
    descripcion:
      "Camiseta oficial de competición de la colección del 10º aniversario, disponible en los dos diseños conmemorativos: «Gatos» y «Claveles». Sublimación total y escudo del aniversario.",
    caracteristicas: [
      "Tejido técnico 100% poliéster, ligero y transpirable",
      "Sublimación total: el estampado no se agrieta ni se despega",
      "Costuras planas anti-rozaduras",
      "Corte unisex; consulta la guía de tallas antes de pedir",
      "Personalizable con nombre y dorsal (indícalo en las notas del pedido)",
    ],
    variantes: [{ nombre: "Diseño", opciones: ["Gatos", "Claveles"] }],
    tallas: TALLAS_JUEGO,
    disponible: true,
  },
  {
    id: "malla-juego",
    nombre: "Malla de juego · 10º aniversario",
    categoria: "Equipación de juego",
    precio: 0,
    imagenes: ["/img/equipacion/malla-gatos.png", "/img/equipacion/malla-claveles.png"],
    descripcion:
      "Malla corta a juego con la camiseta, en los dos diseños del aniversario. Ajuste ceñido que no limita el movimiento.",
    caracteristicas: [
      "Tejido elástico en 4 direcciones",
      "Cintura ancha que no marca",
      "Sublimación total a juego con la camiseta",
      "Secado rápido",
    ],
    variantes: [{ nombre: "Diseño", opciones: ["Gatos", "Claveles"] }],
    tallas: TALLAS_JUEGO,
    disponible: true,
  },
  {
    id: "camiseta-entreno",
    nombre: "Camiseta de entreno",
    categoria: "Ropa de entreno",
    precio: 0,
    imagenes: ["/img/equipacion/entreno-fem.png", "/img/equipacion/entreno-masc.png"],
    descripcion:
      "Camiseta técnica para los entrenamientos del día a día, en naranja con mangas negras. Disponible en corte femenino y masculino.",
    caracteristicas: [
      "Poliéster técnico transpirable",
      "Logo del club estampado en el pecho",
      "Corte específico femenino o masculino",
      "Uso recomendado para todas las categorías",
    ],
    variantes: [{ nombre: "Corte", opciones: ["Femenino", "Masculino"] }],
    tallas: TALLAS_ROPA,
    disponible: true,
  },
  {
    id: "sudadera-aniversario",
    nombre: "Sudadera 10º aniversario",
    categoria: "Sudaderas y abrigo",
    precio: 0,
    imagenes: ["/img/equipacion/sudadera-frente.png", "/img/equipacion/sudadera-espalda.png"],
    descripcion:
      "Sudadera con capucha gris jaspeado, con el logo «10 aniversario» en el pecho y las huellas en la espalda. La pieza estrella de la colección.",
    caracteristicas: [
      "Mezcla algodón/poliéster, interior tipo felpa",
      "Capucha con cordón y bolsillo canguro",
      "Estampado serigrafiado en negro",
      "Unisex",
    ],
    variantes: [],
    tallas: TALLAS_ROPA,
    disponible: true,
  },
  {
    id: "abrigo-nepal",
    nombre: "Abrigo Nepal",
    categoria: "Sudaderas y abrigo",
    precio: 0,
    imagenes: ["/img/equipacion/abrigo.png"],
    descripcion:
      "Abrigo acolchado negro con capucha, para los pabellones fríos y los desplazamientos de invierno.",
    caracteristicas: [
      "Acolchado ligero y cálido",
      "Capucha fija, cierre de cremallera",
      "Bolsillos laterales con cremallera",
      "Logo del club y dorsal bordados",
    ],
    variantes: [],
    tallas: TALLAS_ROPA,
    disponible: true,
  },
  {
    id: "mochila",
    nombre: "Mochila oficial",
    categoria: "Accesorios",
    precio: 0,
    imagenes: ["/img/equipacion/mochila.png"],
    descripcion:
      "Mochila negra con compartimento inferior para el calzado y el logo del club estampado. La que usan todos los equipos.",
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
