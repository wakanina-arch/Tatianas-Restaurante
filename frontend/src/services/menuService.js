// src/services/menuService.js

// ========== MENÚ INTERNACIONAL (Demo 1 - ONE TO ONE) ==========
const MENU_INTERNACIONAL = [
  { id: 1, nombre: 'Picoteo', opciones: [
    { nombre: 'Alitas BBQ', precio: 8.50, descripcion: 'Alitas de pollo con salsa BBQ casera' },
    { nombre: 'Patatas Bravas', precio: 5.50, descripcion: 'Patatas con salsa brava y alioli' },
    { nombre: 'Nachos con queso', precio: 7.50, descripcion: 'Totopos con queso fundido y guacamole' }
  ]},
  { id: 2, nombre: 'Entrantes', opciones: [
    { nombre: 'Croquetas de jamón', precio: 6.50, descripcion: 'Croquetas cremosas de jamón serrano' },
    { nombre: 'Calamares a la romana', precio: 8.00, descripcion: 'Calamares frescos rebozados' },
    { nombre: 'Gambas al ajillo', precio: 9.50, descripcion: 'Gambas salteadas con ajo y guindilla' }
  ]},
  { id: 3, nombre: 'Gourmets', opciones: [
    { nombre: 'Solomillo al foie', precio: 24.00, descripcion: 'Solomillo de res con láminas de foie' },
    { nombre: 'Carpaccio de res', precio: 16.00, descripcion: 'Finas láminas de res con parmesano' }
  ]},
  { id: 4, nombre: 'Postres', opciones: [
    { nombre: 'Tarta de queso', precio: 5.00, descripcion: 'Tarta de queso con mermelada de frutos rojos' },
    { nombre: 'Brownie con helado', precio: 5.50, descripcion: 'Brownie de chocolate con helado de vainilla' }
  ]},
  { id: 5, nombre: 'Bebidas', opciones: [
    { nombre: 'Coca Cola', precio: 2.50 },
    { nombre: 'Cerveza', precio: 3.50 },
    { nombre: 'Agua mineral', precio: 1.50 }
  ]}
];

// ========== MENÚ MANABITA (Demo 2 - Sabores del Origen) ==========
const MENU_MANABITA = [
  { id: 1, nombre: 'Tradiciones Manabitas', opciones: [
    { nombre: 'Sal Prieta', precio: 4.00, descripcion: 'Mezcla de maíz tostado, maní y achiote - Acompaña plátano asado' },
    { nombre: 'Ceviche de Sardina (Pinchagua)', precio: 7.00, descripcion: 'Sardina fresca curtida en limón con cebolla y cilantro' }
  ]},
  { id: 2, nombre: 'Sopas y Caldos', opciones: [
    { nombre: 'Viche de Jaiba', precio: 9.00, descripcion: 'Sopa espesa de jaiba con maní, verde y pescado - Tradición de Machalilla' },
    { nombre: 'Sancocho de Pescado', precio: 8.50, descripcion: 'Caldo de pescado con yuca, verde y choclo' }
  ]},
  { id: 3, nombre: 'Platos Fuertes', opciones: [
    { nombre: 'Encocado de Mariscos', precio: 12.00, descripcion: 'Mariscos en salsa de coco - Receta de Súa, Esmeraldas' },
    { nombre: 'Torta de Pescado', precio: 10.00, descripcion: 'Pasta de pescado con maní, pasas y huevo - Tradición de Machalilla' }
  ]},
  { id: 4, nombre: 'Postres y Bebidas', opciones: [
    { nombre: 'Chocolate de Cacao Original', precio: 4.00, descripcion: 'Bebida ancestral de cacao con canela y pimienta' },
    { nombre: 'Tambores de Yuca', precio: 3.50, descripcion: 'Dulce de yuca envuelto en hoja de lechuguín' }
  ]}
];

// ========== MENÚ ANDINA (Demo 3 - Sierra y Fuego) ==========
const MENU_ANDINA = [
  { id: 1, nombre: 'Tradiciones Andinas', opciones: [
    { nombre: 'Runa Uchu (Cuy Asado)', precio: 18.00, descripcion: 'Cuy asado acompañado de colada de arveja - Tradición de Tisaleo' },
    { nombre: 'Borrego Asado', precio: 14.00, descripcion: 'Borrego macerado en chicha de jora - Pillaro' }
  ]},
  { id: 2, nombre: 'Sopas y Caldos', opciones: [
    { nombre: 'Locro de Papas', precio: 6.00, descripcion: 'Cremosa sopa de papa con queso y aguacate' },
    { nombre: 'Chuchuca', precio: 5.50, descripcion: 'Sopa de maíz seco tostado con col - San José de Minas' }
  ]},
  { id: 3, nombre: 'Platos Fuertes', opciones: [
    { nombre: 'Llapingachos', precio: 7.00, descripcion: 'Tortillas de papa rellenas de queso con chorizo' },
    { nombre: 'Cascaritas de Chancho', precio: 9.00, descripcion: 'Cuero de chancho crocante con mote - Cañar' }
  ]},
  { id: 4, nombre: 'Postres y Bebidas', opciones: [
    { nombre: 'Chicha de Jora y Amaranto', precio: 3.00, descripcion: 'Bebida fermentada de maíz - Tradición Cañari' },
    { nombre: 'Tortillas de Choclo', precio: 4.00, descripcion: 'Tortillas dulces de maíz tierno' }
  ]}
];

// ========== MENÚ COSTERO (Demo 4 - Manglar y Mar) ==========
const MENU_COSTERO = [
  { id: 1, nombre: 'Entradas del Manglar', opciones: [
    { nombre: 'Ostras Gratinadas', precio: 8.00, descripcion: 'Ostras frescas gratinadas con queso parmesano - Ayangue' },
    { nombre: 'Cevicangre', precio: 10.00, descripcion: 'Cangrejo encocado + ceviche de camarón - Río Verde' }
  ]},
  { id: 2, nombre: 'Sopas Marineras', opciones: [
    { nombre: 'Tigrillo de Pulpo', precio: 8.50, descripcion: 'Verde majado con pulpo y maní - Manglaralto' },
    { nombre: 'Sopa de Cangrejo', precio: 9.00, descripcion: 'Caldo de cangrejo con yuca y choclo - Comuna Engabao' }
  ]},
  { id: 3, nombre: 'Platos Fuertes', opciones: [
    { nombre: 'Pangora Rellena', precio: 11.00, descripcion: 'Caparazón relleno con carne de cangrejo - Data de Posorja' },
    { nombre: 'Arroz Ayanguero', precio: 10.00, descripcion: 'Arroz mixto con mariscos y pescado - Ayangue' }
  ]},
  { id: 4, nombre: 'Bebidas', opciones: [
    { nombre: 'Chicha de Maní', precio: 3.00, descripcion: 'Bebida refrescante de maní y maíz - Chanduy' },
    { nombre: 'Champú de Arroz y Maní', precio: 3.50, descripcion: 'Bebida espesa aromatizada con canela' }
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

/**
 * Obtiene el menú PUBLICADO de un comercio
 */
export const getMenuPublicado = (comercioId) => {
  try {
    const key = `menu_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Verificar si tiene platos o está vacío
      const tienePlatos = parsed.some(cat => cat.opciones?.length > 0);
      if (tienePlatos) return parsed;
    }
    // Si no hay menú guardado, usar el menú por defecto del comercio
    return MENUS_POR_COMERCIO[comercioId] || MENU_DEFAULT;
  } catch (e) {
    console.error('Error cargando menú publicado:', e);
    return MENUS_POR_COMERCIO[comercioId] || MENU_DEFAULT;
  }
};

/**
 * Obtiene el menú BORRADOR de un comercio
 */
export const getMenuBorrador = (comercioId) => {
  try {
    const key = `borrador_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    const publicado = getMenuPublicado(comercioId);
    localStorage.setItem(key, JSON.stringify(publicado));
    return publicado;
  } catch (e) {
    console.error('Error cargando borrador:', e);
    return MENUS_POR_COMERCIO[comercioId] || MENU_DEFAULT;
  }
};

export const saveMenuBorrador = (comercioId, menu) => {
  try {
    const key = `borrador_comercio_${comercioId}`;
    localStorage.setItem(key, JSON.stringify(menu));
    return true;
  } catch (e) {
    console.error('Error guardando borrador:', e);
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
    const key = `menu_comercio_${comercioId}`;
    localStorage.setItem(key, JSON.stringify(menuLimpio));
    localStorage.setItem(`borrador_comercio_${comercioId}`, JSON.stringify(menuLimpio));
    return { success: true, menu: menuLimpio };
  } catch (e) {
    console.error('Error publicando menú:', e);
    return { success: false, error: e.message };
  }
};

export const tieneCambiosSinPublicar = (comercioId) => {
  try {
    const publicado = JSON.stringify(getMenuPublicado(comercioId));
    const borrador = JSON.stringify(getMenuBorrador(comercioId));
    return publicado !== borrador;
  } catch (e) {
    return false;
  }
};

export const descartarBorrador = (comercioId) => {
  try {
    const publicado = getMenuPublicado(comercioId);
    const key = `borrador_comercio_${comercioId}`;
    localStorage.setItem(key, JSON.stringify(publicado));
    return publicado;
  } catch (e) {
    console.error('Error descartando borrador:', e);
    return null;
  }
};