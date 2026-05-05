// ===== IMÁGENES LOCALES DEMO 1 =====
const IMAGENES_PICOTEO = ['/img/Picoteo/Alitas2.png', '/img/Picoteo/Nachos%20con%20queso.png', '/img/Picoteo/Bowl%20Patatas%20fritas.png'];
const IMAGENES_ENTRANTES = ['/img/Entrantes/Bolon%20de%20Verde.JPG', '/img/Entrantes/Tigrillo.JPG', '/img/Entrantes/Ceviche%20de%20Camaron.JPG', '/img/Entrantes/Locro%20de%20Papa.JPG', '/img/Entrantes/Mote%20Pillo.JPG', '/img/Entrantes/Patacones%20con%20Queso.JPG'];
const IMAGENES_GOURMETS = ['/img/Gourmets/Cuy%20Asado.JPG', '/img/Gourmets/Encebollado.JPG', '/img/Gourmets/Encocado%20de%20Pescado.JPG', '/img/Gourmets/Estofado%20de%20Pollo.JPG'];

// ===== IMÁGENES WEB (libres de derechos) para DEMO 2 y 3 =====
const IMAGENES_WEB = {
  ceviche: 'https://images.pexels.com/photos/6646202/pexels-photo-6646202.jpeg?auto=compress&cs=tinysrgb&w=300',
  encebollado: 'https://images.pexels.com/photos/3712978/pexels-photo-3712978.jpeg?auto=compress&cs=tinysrgb&w=300',
  encocado: 'https://images.pexels.com/photos/6989281/pexels-photo-6989281.jpeg?auto=compress&cs=tinysrgb&w=300',
  patacones: 'https://images.pexels.com/photos/2291742/pexels-photo-2291742.jpeg?auto=compress&cs=tinysrgb&w=300',
  cuy: 'https://images.pexels.com/photos/280453/pexels-photo-280453.jpeg?auto=compress&cs=tinysrgb&w=300',
  locro: 'https://images.pexels.com/photos/12986944/pexels-photo-12986944.jpeg?auto=compress&cs=tinysrgb&w=300',
  mote: 'https://images.pexels.com/photos/1309490/pexels-photo-1309490.jpeg?auto=compress&cs=tinysrgb&w=300',
  bolon: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300'
};

// ===== DEMO 1: ONE TO ONE (IMÁGENES LOCALES) =====
const MENU_DEMO1 = [
  { nombre: 'Picoteo', opciones: [
    { nombre: 'Alitas BBQ', precio: 8.50, imagen: IMAGENES_PICOTEO[0] },
    { nombre: 'Nachos con queso', precio: 7.50, imagen: IMAGENES_PICOTEO[1] },
    { nombre: 'Patatas Bravas', precio: 6.50, imagen: IMAGENES_PICOTEO[2] }
  ]},
  { nombre: 'Entrantes', opciones: [
    { nombre: 'Bolon de Verde', precio: 5.50, imagen: IMAGENES_ENTRANTES[0] },
    { nombre: 'Tigrillo', precio: 6.00, imagen: IMAGENES_ENTRANTES[1] },
    { nombre: 'Ceviche de Camaron', precio: 7.00, imagen: IMAGENES_ENTRANTES[2] }
  ]},
  { nombre: 'Gourmets', opciones: [
    { nombre: 'Cuy Asado', precio: 18.00, imagen: IMAGENES_GOURMETS[0] },
    { nombre: 'Encebollado', precio: 6.00, imagen: IMAGENES_GOURMETS[1] },
    { nombre: 'Encocado de Pescado', precio: 10.00, imagen: IMAGENES_GOURMETS[2] }
  ]},
  { nombre: 'Escuderos', opciones: [{ nombre: 'Mote Pillo', precio: 4.50, imagen: IMAGENES_ENTRANTES[4] }] },
  { nombre: 'Zombies', opciones: [] },
  { nombre: 'FastFurious', opciones: [] },
  { nombre: 'Postres', opciones: [] },
  { nombre: 'Bebidas', opciones: [] }
];

// ===== DEMO 2: SABORES DEL ORIGEN (IMÁGENES WEB) =====
const MENU_DEMO2 = [
  { nombre: 'Picoteo', opciones: [
    { nombre: 'Ceviche de Camaron', precio: 7.00, imagen: IMAGENES_WEB.ceviche },
    { nombre: 'Patacones con Queso', precio: 5.00, imagen: IMAGENES_WEB.patacones }
  ]},
  { nombre: 'Entrantes', opciones: [
    { nombre: 'Encebollado', precio: 6.00, imagen: IMAGENES_WEB.encebollado },
    { nombre: 'Encocado de Pescado', precio: 10.00, imagen: IMAGENES_WEB.encocado }
  ]},
  { nombre: 'Gourmets', opciones: [
    { nombre: 'Estofado de Pollo', precio: 8.00, imagen: IMAGENES_WEB.encocado }
  ]}
];

// ===== DEMO 3: SIERRA Y FUEGO (IMÁGENES WEB) =====
const MENU_DEMO3 = [
  { nombre: 'Picoteo', opciones: [
    { nombre: 'Bolon de Verde', precio: 5.50, imagen: IMAGENES_WEB.bolon }
  ]},
  { nombre: 'Entrantes', opciones: [
    { nombre: 'Locro de Papa', precio: 5.00, imagen: IMAGENES_WEB.locro },
    { nombre: 'Mote Pillo', precio: 4.50, imagen: IMAGENES_WEB.mote }
  ]},
  { nombre: 'Gourmets', opciones: [
    { nombre: 'Cuy Asado', precio: 18.00, imagen: IMAGENES_WEB.cuy }
  ]}
];

const MENUS_POR_COMERCIO = { 1: MENU_DEMO1, 2: MENU_DEMO2, 3: MENU_DEMO3 };

export const getMenuPublicado = (comercioId) => {
  const key = `menu_comercio_${comercioId}`;
  const saved = localStorage.getItem(key);
  if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
  const menu = MENUS_POR_COMERCIO[comercioId] || MENU_DEMO1;
  localStorage.setItem(key, JSON.stringify(menu));
  return menu;
};

export const getMenuBorrador = (comercioId) => getMenuPublicado(comercioId);
export const saveMenuBorrador = (comercioId, menu) => { 
  localStorage.setItem(`menu_comercio_${comercioId}`, JSON.stringify(menu)); 
  return true; 
};
export const publicarMenu = (comercioId) => ({ success: true });
export const tieneCambiosSinPublicar = () => false;
export const descartarBorrador = (comercioId) => getMenuPublicado(comercioId);