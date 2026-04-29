// ========== MENÚ INTERNACIONAL (Demo 1 - ONE TO ONE) ==========
const MENU_INTERNACIONAL = [
  { id: 1, nombre: '🍢 PICOTEO', opciones: [
    { nombre: 'Alitas BBQ', precio: 8.50, imagen: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Patatas Bravas', precio: 5.50, imagen: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Nachos con queso', precio: 7.50, imagen: 'https://images.pexels.com/photos/1653929/pexels-photo-1653929.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 2, nombre: '🍤 ENTRANTES', opciones: [
    { nombre: 'Croquetas de jamón', precio: 6.50, imagen: 'https://images.pexels.com/photos/260804/pexels-photo-260804.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Calamares a la romana', precio: 8.00, imagen: 'https://images.pexels.com/photos/3894879/pexels-photo-3894879.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Gambas al ajillo', precio: 9.50, imagen: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 3, nombre: '🍷 GOURMETS', opciones: [
    { nombre: 'Solomillo al foie', precio: 24.00, imagen: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Carpaccio de res', precio: 16.00, imagen: 'https://images.pexels.com/photos/11920980/pexels-photo-11920980.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 4, nombre: '🥘 ESCUDEROS', opciones: [
    { nombre: 'Ensalada César', precio: 11.50, imagen: 'https://images.pexels.com/photos/2097095/pexels-photo-2097095.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Ensalada Caprese', precio: 10.00, imagen: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 5, nombre: '🍕 ZOMBIES', opciones: [
    { nombre: 'Pizza Carbonara', precio: 13.50, imagen: 'https://images.pexels.com/photos/2702674/pexels-photo-2702674.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Pizza Pepperoni', precio: 13.50, imagen: 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 6, nombre: '🏎️ FAST&FURIOUS', opciones: [
    { nombre: 'Hamburguesa Clásica', precio: 10.00, imagen: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Wrap de pollo', precio: 8.50, imagen: 'https://images.pexels.com/photos/3639980/pexels-photo-3639980.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 7, nombre: '🍰 POSTRES', opciones: [
    { nombre: 'Tarta de queso', precio: 5.00, imagen: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Brownie con helado', precio: 5.50, imagen: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 8, nombre: '🥤 BEBIDAS', opciones: [
    { nombre: 'Coca Cola', precio: 2.50, imagen: 'https://images.pexels.com/photos/50593/coca-cola-coke-soft-drink-ice-50593.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Cerveza', precio: 3.50, imagen: 'https://images.pexels.com/photos/1297591/pexels-photo-1297591.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]}
];

// ========== MENÚ MANABITA (Demo 2 - Sabores del Origen) ==========
const MENU_MANABITA = [
  { id: 1, nombre: '🌽 TRADICIONES MANABITAS', opciones: [
    { nombre: 'Sal Prieta', precio: 4.00, descripcion: 'Mezcla de maíz tostado, maní y achiote', imagen: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Ceviche de Sardina', precio: 7.00, descripcion: 'Sardina fresca curtida en limón con cebolla', imagen: 'https://images.pexels.com/photos/6646208/pexels-photo-6646208.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 2, nombre: '🥣 SOPAS Y CALDOS', opciones: [
    { nombre: 'Viche de Jaiba', precio: 9.00, descripcion: 'Sopa espesa de jaiba con maní y verde', imagen: 'https://images.pexels.com/photos/3712978/pexels-photo-3712978.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Sancocho de Pescado', precio: 8.50, descripcion: 'Caldo de pescado con yuca y choclo', imagen: 'https://images.pexels.com/photos/177722/pexels-photo-177722.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 3, nombre: '🍤 PLATOS FUERTES', opciones: [
    { nombre: 'Encocado de Mariscos', precio: 12.00, descripcion: 'Mariscos en salsa de coco', imagen: 'https://images.pexels.com/photos/6989281/pexels-photo-6989281.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Torta de Pescado', precio: 10.00, descripcion: 'Pasta de pescado con maní y pasas', imagen: 'https://images.pexels.com/photos/976999/pexels-photo-976999.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 4, nombre: '🍫 POSTRES Y BEBIDAS', opciones: [
    { nombre: 'Chocolate de Cacao', precio: 4.00, descripcion: 'Bebida ancestral de cacao con canela', imagen: 'https://images.pexels.com/photos/6646261/pexels-photo-6646261.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Tambores de Yuca', precio: 3.50, descripcion: 'Dulce de yuca envuelto en hoja', imagen: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]}
];

// ========== MENÚ ANDINA (Demo 3 - Sierra y Fuego) ==========
const MENU_ANDINA = [
  { id: 1, nombre: '🏔️ TRADICIONES ANDINAS', opciones: [
    { nombre: 'Runa Uchu (Cuy)', precio: 18.00, descripcion: 'Cuy asado con colada de arveja', imagen: 'https://images.pexels.com/photos/280453/pexels-photo-280453.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Borrego Asado', precio: 14.00, descripcion: 'Borrego macerado en chicha de jora', imagen: 'https://images.pexels.com/photos/616353/pexels-photo-616353.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 2, nombre: '🥣 SOPAS ANDINAS', opciones: [
    { nombre: 'Locro de Papas', precio: 6.00, descripcion: 'Cremosa sopa de papa con queso y aguacate', imagen: 'https://images.pexels.com/photos/12986944/pexels-photo-12986944.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Chuchuca', precio: 5.50, descripcion: 'Sopa de maíz seco tostado con col', imagen: 'https://images.pexels.com/photos/1309490/pexels-photo-1309490.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 3, nombre: '🍖 PLATOS FUERTES', opciones: [
    { nombre: 'Llapingachos', precio: 7.00, descripcion: 'Tortillas de papa rellenas de queso', imagen: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Cascaritas de Chancho', precio: 9.00, descripcion: 'Cuero de chancho crocante con mote', imagen: 'https://images.pexels.com/photos/1679649/pexels-photo-1679649.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 4, nombre: '🍹 BEBIDAS TRADICIONALES', opciones: [
    { nombre: 'Chicha de Jora', precio: 3.00, descripcion: 'Bebida fermentada de maíz', imagen: 'https://images.pexels.com/photos/1527608/pexels-photo-1527608.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Tortillas de Choclo', precio: 4.00, descripcion: 'Tortillas dulces de maíz tierno', imagen: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]}
];

// ========== MENÚ COSTERO (Demo 4 - Manglar y Mar) ==========
const MENU_COSTERO = [
  { id: 1, nombre: '🦪 ENTRADAS DEL MANGLAR', opciones: [
    { nombre: 'Ostras Gratinadas', precio: 8.00, descripcion: 'Ostras gratinadas con queso parmesano', imagen: 'https://images.pexels.com/photos/5607141/pexels-photo-5607141.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Cevicangre', precio: 10.00, descripcion: 'Cangrejo encocado + ceviche de camarón', imagen: 'https://images.pexels.com/photos/3712994/pexels-photo-3712994.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 2, nombre: '🥣 SOPAS MARINERAS', opciones: [
    { nombre: 'Tigrillo de Pulpo', precio: 8.50, descripcion: 'Verde majado con pulpo y maní', imagen: 'https://images.pexels.com/photos/2145931/pexels-photo-2145931.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Sopa de Cangrejo', precio: 9.00, descripcion: 'Caldo de cangrejo con yuca y choclo', imagen: 'https://images.pexels.com/photos/3712994/pexels-photo-3712994.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 3, nombre: '🍚 PLATOS MARINEROS', opciones: [
    { nombre: 'Pangora Rellena', precio: 11.00, descripcion: 'Caparazón relleno con carne de cangrejo', imagen: 'https://images.pexels.com/photos/3712994/pexels-photo-3712994.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Arroz Ayanguero', precio: 10.00, descripcion: 'Arroz mixto con mariscos y pescado', imagen: 'https://images.pexels.com/photos/6989281/pexels-photo-6989281.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]},
  { id: 4, nombre: '🥤 BEBIDAS', opciones: [
    { nombre: 'Chicha de Maní', precio: 3.00, descripcion: 'Bebida refrescante de maní y maíz', imagen: 'https://images.pexels.com/photos/1527608/pexels-photo-1527608.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { nombre: 'Champú de Arroz', precio: 3.50, descripcion: 'Bebida espesa aromatizada con canela', imagen: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ]}
];

// ========== MAPEO DE MENÚS POR COMERCIO ==========
const MENUS_POR_COMERCIO = {
  1: MENU_INTERNACIONAL,
  2: MENU_MANABITA,
  3: MENU_ANDINA,
  4: MENU_COSTERO
};

// ========== FUNCIÓN PRINCIPAL ==========
export const getMenuPublicado = (comercioId) => {
  try {
    const key = `menu_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // Verificar que el menú tenga todas las categorías que debería
      const menuEsperado = MENUS_POR_COMERCIO[comercioId];
      if (menuEsperado && parsed.length >= menuEsperado.length) {
        return parsed;
      }
    }
    
    // Si no hay menú o está incompleto, usar el menú completo
    const menuCompleto = MENUS_POR_COMERCIO[comercioId] || MENU_INTERNACIONAL;
    localStorage.setItem(key, JSON.stringify(menuCompleto));
    console.log(`📋 Menú inicializado para comercio ${comercioId} con ${menuCompleto.length} categorías`);
    return menuCompleto;
    
  } catch (e) {
    console.error('Error cargando menú:', e);
    return MENUS_POR_COMERCIO[comercioId] || MENU_INTERNACIONAL;
  }
};

// ========== FUNCIONES SECUNDARIAS ==========
export const getMenuBorrador = (comercioId) => {
  try {
    const key = `borrador_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    const publicado = getMenuPublicado(comercioId);
    localStorage.setItem(key, JSON.stringify(publicado));
    return publicado;
  } catch (e) {
    return MENUS_POR_COMERCIO[comercioId] || MENU_INTERNACIONAL;
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