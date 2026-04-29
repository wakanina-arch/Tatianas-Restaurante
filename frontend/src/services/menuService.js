// src/services/menuService.js

const PLATOS_DEMO = [
  { id: 1, nombre: 'Picoteo', opciones: [
    { nombre: 'Alitas BBQ', precio: 8.50 },
    { nombre: 'Patatas Bravas', precio: 5.50 },
    { nombre: 'Nachos con queso', precio: 7.50 }
  ]},
  { id: 2, nombre: 'Entrantes', opciones: [
    { nombre: 'Croquetas de jamón', precio: 6.50 },
    { nombre: 'Calamares a la romana', precio: 8.00 },
    { nombre: 'Gambas al ajillo', precio: 9.50 }
  ]},
  { id: 3, nombre: 'Gourmets', opciones: [
    { nombre: 'Solomillo al foie', precio: 24.00 },
    { nombre: 'Carpaccio de res', precio: 16.00 },
    { nombre: 'Vieiras gratinadas', precio: 18.00 }
  ]},
  { id: 4, nombre: 'Escuderos', opciones: [
    { nombre: 'Ensalada César', precio: 11.50 },
    { nombre: 'Ensalada Caprese', precio: 10.00 },
    { nombre: 'Ensalada Waldorf', precio: 10.50 }
  ]},
  { id: 5, nombre: 'Zombies', opciones: [
    { nombre: 'Pizza Carbonara', precio: 13.50 },
    { nombre: 'Pizza Pepperoni', precio: 13.50 },
    { nombre: 'Hamburguesa Monstruosa', precio: 15.00 }
  ]},
  { id: 6, nombre: 'FastFurious', opciones: [
    { nombre: 'Hamburguesa Clásica', precio: 10.00 },
    { nombre: 'Perrito Caliente', precio: 6.00 },
    { nombre: 'Wrap de pollo', precio: 8.50 }
  ]},
  { id: 7, nombre: 'Postres', opciones: [
    { nombre: 'Tarta de queso', precio: 5.00 },
    { nombre: 'Brownie con helado', precio: 5.50 },
    { nombre: 'Flan casero', precio: 4.00 }
  ]},
  { id: 8, nombre: 'Bebidas', opciones: [
    { nombre: 'Coca Cola', precio: 2.50 },
    { nombre: 'Cerveza', precio: 3.50 },
    { nombre: 'Agua mineral', precio: 1.50 }
  ]},
];

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
    // Si no hay menú guardado o está vacío, usar platos demo
    return PLATOS_DEMO;
  } catch (e) {
    console.error('Error cargando menú publicado:', e);
    return PLATOS_DEMO;
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
    return PLATOS_DEMO;
  }
};

/**
 * Guarda el menú BORRADOR
 */
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

/**
 * PUBLICA el borrador
 */
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

/**
 * Verifica si hay cambios sin publicar
 */
export const tieneCambiosSinPublicar = (comercioId) => {
  try {
    const publicado = JSON.stringify(getMenuPublicado(comercioId));
    const borrador = JSON.stringify(getMenuBorrador(comercioId));
    return publicado !== borrador;
  } catch (e) {
    return false;
  }
};

/**
 * Descarta el borrador
 */
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