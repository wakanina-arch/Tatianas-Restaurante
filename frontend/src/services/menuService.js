// src/services/menuService.js

// ========== FUNCIÓN PARA GENERAR IMAGEN TEMÁTICA ==========
const getPlatoImage = (nombre) => {
  // Mapeo de imágenes específicas por tipo de plato
  const images = {
    // Carnes
    'Alitas BBQ': 'https://images.pexels.com/photos/6210876/pexels-photo-6210876.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Solomillo': 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Carpaccio': 'https://images.pexels.com/photos/11920980/pexels-photo-11920980.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Borrego': 'https://images.pexels.com/photos/616353/pexels-photo-616353.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Cuy': 'https://images.pexels.com/photos/280453/pexels-photo-280453.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Chancho': 'https://images.pexels.com/photos/1679649/pexels-photo-1679649.jpeg?auto=compress&cs=tinysrgb&w=200',
    
    // Mariscos
    'Ceviche': 'https://images.pexels.com/photos/6646208/pexels-photo-6646208.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Viche': 'https://images.pexels.com/photos/3712978/pexels-photo-3712978.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Ostras': 'https://images.pexels.com/photos/5607141/pexels-photo-5607141.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Cangrejo': 'https://images.pexels.com/photos/3712994/pexels-photo-3712994.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Pulpo': 'https://images.pexels.com/photos/2145931/pexels-photo-2145931.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Mariscos': 'https://images.pexels.com/photos/6989281/pexels-photo-6989281.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Pescado': 'https://images.pexels.com/photos/976999/pexels-photo-976999.jpeg?auto=compress&cs=tinysrgb&w=200',
    
    // Sopas
    'Locro': 'https://images.pexels.com/photos/12986944/pexels-photo-12986944.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Sancocho': 'https://images.pexels.com/photos/177722/pexels-photo-177722.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Sopa': 'https://images.pexels.com/photos/1309490/pexels-photo-1309490.jpeg?auto=compress&cs=tinysrgb&w=200',
    
    // Postres y bebidas
    'Tarta': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Brownie': 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Chocolate': 'https://images.pexels.com/photos/6646261/pexels-photo-6646261.jpeg?auto=compress&cs=tinysrgb&w=200',
    'Chicha': 'https://images.pexels.com/photos/1527608/pexels-photo-1527608.jpeg?auto=compress&cs=tinysrgb&w=200',
    
    // Default
    'default': 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200'
  };
  
  // Buscar coincidencia parcial
  for (const [key, url] of Object.entries(images)) {
    if (nombre.includes(key)) return url;
  }
  return images.default;
};

// ========== MENÚ INTERNACIONAL (Demo 1) ==========
const MENU_INTERNACIONAL = [
  { id: 1, nombre: 'Picoteo', opciones: [
    { nombre: 'Alitas BBQ', precio: 8.50, imagen: getPlatoImage('Alitas BBQ') },
    { nombre: 'Patatas Bravas', precio: 5.50, imagen: getPlatoImage('Patatas') },
    { nombre: 'Nachos con queso', precio: 7.50, imagen: getPlatoImage('Nachos') }
  ]},
  { id: 2, nombre: 'Entrantes', opciones: [
    { nombre: 'Croquetas de jamón', precio: 6.50, imagen: getPlatoImage('Croquetas') },
    { nombre: 'Calamares a la romana', precio: 8.00, imagen: getPlatoImage('Calamares') },
    { nombre: 'Gambas al ajillo', precio: 9.50, imagen: getPlatoImage('Gambas') }
  ]},
  { id: 3, nombre: 'Gourmets', opciones: [
    { nombre: 'Solomillo al foie', precio: 24.00, imagen: getPlatoImage('Solomillo') },
    { nombre: 'Carpaccio de res', precio: 16.00, imagen: getPlatoImage('Carpaccio') }
  ]},
  { id: 4, nombre: 'Postres', opciones: [
    { nombre: 'Tarta de queso', precio: 5.00, imagen: getPlatoImage('Tarta') },
    { nombre: 'Brownie con helado', precio: 5.50, imagen: getPlatoImage('Brownie') }
  ]},
  { id: 5, nombre: 'Bebidas', opciones: [
    { nombre: 'Coca Cola', precio: 2.50, imagen: getPlatoImage('default') },
    { nombre: 'Cerveza', precio: 3.50, imagen: getPlatoImage('default') },
    { nombre: 'Agua mineral', precio: 1.50, imagen: getPlatoImage('default') }
  ]}
];

// ========== MENÚ MANABITA (Demo 2) ==========
const MENU_MANABITA = [
  { id: 1, nombre: 'Tradiciones Manabitas', opciones: [
    { nombre: 'Sal Prieta', precio: 4.00, descripcion: 'Mezcla de maíz tostado, maní y achiote', imagen: getPlatoImage('default') },
    { nombre: 'Ceviche de Sardina', precio: 7.00, descripcion: 'Sardina fresca curtida en limón', imagen: getPlatoImage('Ceviche') }
  ]},
  { id: 2, nombre: 'Sopas y Caldos', opciones: [
    { nombre: 'Viche de Jaiba', precio: 9.00, descripcion: 'Sopa espesa de jaiba con maní y verde', imagen: getPlatoImage('Viche') },
    { nombre: 'Sancocho de Pescado', precio: 8.50, descripcion: 'Caldo de pescado con yuca y choclo', imagen: getPlatoImage('Sancocho') }
  ]},
  { id: 3, nombre: 'Platos Fuertes', opciones: [
    { nombre: 'Encocado de Mariscos', precio: 12.00, descripcion: 'Mariscos en salsa de coco', imagen: getPlatoImage('Mariscos') },
    { nombre: 'Torta de Pescado', precio: 10.00, descripcion: 'Pasta de pescado con maní y pasas', imagen: getPlatoImage('Pescado') }
  ]},
  { id: 4, nombre: 'Postres y Bebidas', opciones: [
    { nombre: 'Chocolate de Cacao', precio: 4.00, descripcion: 'Bebida ancestral de cacao', imagen: getPlatoImage('Chocolate') },
    { nombre: 'Tambores de Yuca', precio: 3.50, descripcion: 'Dulce de yuca envuelto en hoja', imagen: getPlatoImage('default') }
  ]}
];

// ========== MENÚ ANDINA (Demo 3) ==========
const MENU_ANDINA = [
  { id: 1, nombre: 'Tradiciones Andinas', opciones: [
    { nombre: 'Runa Uchu (Cuy)', precio: 18.00, descripcion: 'Cuy asado con colada de arveja', imagen: getPlatoImage('Cuy') },
    { nombre: 'Borrego Asado', precio: 14.00, descripcion: 'Borrego macerado en chicha de jora', imagen: getPlatoImage('Borrego') }
  ]},
  { id: 2, nombre: 'Sopas y Caldos', opciones: [
    { nombre: 'Locro de Papas', precio: 6.00, descripcion: 'Cremosa sopa de papa con queso', imagen: getPlatoImage('Locro') },
    { nombre: 'Chuchuca', precio: 5.50, descripcion: 'Sopa de maíz seco con col', imagen: getPlatoImage('Sopa') }
  ]},
  { id: 3, nombre: 'Platos Fuertes', opciones: [
    { nombre: 'Llapingachos', precio: 7.00, descripcion: 'Tortillas de papa rellenas de queso', imagen: getPlatoImage('default') },
    { nombre: 'Cascaritas de Chancho', precio: 9.00, descripcion: 'Cuero de chancho crocante', imagen: getPlatoImage('Chancho') }
  ]},
  { id: 4, nombre: 'Postres y Bebidas', opciones: [
    { nombre: 'Chicha de Jora', precio: 3.00, descripcion: 'Bebida fermentada de maíz', imagen: getPlatoImage('Chicha') },
    { nombre: 'Tortillas de Choclo', precio: 4.00, descripcion: 'Tortillas dulces de maíz tierno', imagen: getPlatoImage('default') }
  ]}
];

// ========== MENÚ COSTERO (Demo 4) ==========
const MENU_COSTERO = [
  { id: 1, nombre: 'Entradas del Manglar', opciones: [
    { nombre: 'Ostras Gratinadas', precio: 8.00, descripcion: 'Ostras gratinadas con queso', imagen: getPlatoImage('Ostras') },
    { nombre: 'Cevicangre', precio: 10.00, descripcion: 'Cangrejo encocado + ceviche', imagen: getPlatoImage('Cangrejo') }
  ]},
  { id: 2, nombre: 'Sopas Marineras', opciones: [
    { nombre: 'Tigrillo de Pulpo', precio: 8.50, descripcion: 'Verde majado con pulpo y maní', imagen: getPlatoImage('Pulpo') },
    { nombre: 'Sopa de Cangrejo', precio: 9.00, descripcion: 'Caldo de cangrejo con yuca', imagen: getPlatoImage('Cangrejo') }
  ]},
  { id: 3, nombre: 'Platos Fuertes', opciones: [
    { nombre: 'Pangora Rellena', precio: 11.00, descripcion: 'Caparazón relleno de cangrejo', imagen: getPlatoImage('Cangrejo') },
    { nombre: 'Arroz Ayanguero', precio: 10.00, descripcion: 'Arroz mixto con mariscos', imagen: getPlatoImage('Mariscos') }
  ]},
  { id: 4, nombre: 'Bebidas', opciones: [
    { nombre: 'Chicha de Maní', precio: 3.00, descripcion: 'Bebida refrescante', imagen: getPlatoImage('Chicha') },
    { nombre: 'Champú de Arroz', precio: 3.50, descripcion: 'Bebida espesa con canela', imagen: getPlatoImage('default') }
  ]}
];

// ========== MAPEO DE MENÚS POR COMERCIO ==========
const MENUS_POR_COMERCIO = {
  1: MENU_INTERNACIONAL,
  2: MENU_MANABITA,
  3: MENU_ANDINA,
  4: MENU_COSTERO
};

const MENU_DEFAULT = MENU_INTERNACIONAL;

// ========== FUNCIONES EXPORTADAS ==========
export const getMenuPublicado = (comercioId) => {
  try {
    const key = `menu_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      const tienePlatos = parsed.some(cat => cat.opciones?.length > 0);
      if (tienePlatos) return parsed;
    }
    const menuPorDefecto = MENUS_POR_COMERCIO[comercioId] || MENU_DEFAULT;
    localStorage.setItem(key, JSON.stringify(menuPorDefecto));
    return menuPorDefecto;
  } catch (e) {
    console.error('Error cargando menú:', e);
    return MENUS_POR_COMERCIO[comercioId] || MENU_DEFAULT;
  }
};

export const getMenuBorrador = (comercioId) => {
  try {
    const key = `borrador_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    const publicado = getMenuPublicado(comercioId);
    localStorage.setItem(key, JSON.stringify(publicado));
    return publicado;
  } catch (e) {
    return MENUS_POR_COMERCIO[comercioId] || MENU_DEFAULT;
  }
};

export const saveMenuBorrador = (comercioId, menu) => {
  try {
    localStorage.setItem(`borrador_comercio_${comercioId}`, JSON.stringify(menu));
    return true;
  } catch (e) {
    return false;
  }
};

export const publicarMenu = (comercioId) => {
  try {
    const borrador = getMenuBorrador(comercioId);
    const menuLimpio = borrador.map(categoria => ({
      ...categoria,
      opciones: categoria.opciones.filter(opt => !opt._deleted)
    }));
    localStorage.setItem(`menu_comercio_${comercioId}`, JSON.stringify(menuLimpio));
    localStorage.setItem(`borrador_comercio_${comercioId}`, JSON.stringify(menuLimpio));
    return { success: true, menu: menuLimpio };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export const tieneCambiosSinPublicar = (comercioId) => {
  try {
    const publicado = JSON.stringify(getMenuPublicado(comercioId));
    const borrador = JSON.stringify(getMenuBorrador(comercioId));
    return publicado !== borrador;
  } catch {
    return false;
  }
};

export const descartarBorrador = (comercioId) => {
  try {
    const publicado = getMenuPublicado(comercioId);
    localStorage.setItem(`borrador_comercio_${comercioId}`, JSON.stringify(publicado));
    return publicado;
  } catch {
    return null;
  }
};