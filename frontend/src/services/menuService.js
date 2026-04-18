// src/services/menuService.js

const DEFAULT_MENU = [
  { id: 1, nombre: 'Picoteo', opciones: [] },
  { id: 2, nombre: 'Entrantes', opciones: [] },
  { id: 3, nombre: 'Gourmets', opciones: [] },
  { id: 4, nombre: 'Escuderos', opciones: [] },
  { id: 5, nombre: 'Zombies', opciones: [] },
  { id: 6, nombre: 'FastFurious', opciones: [] },
  { id: 7, nombre: 'Postres', opciones: [] },
  { id: 8, nombre: 'Bebidas', opciones: [] },
];

/**
 * Obtiene el menú PUBLICADO de un comercio
 */
export const getMenuPublicado = (comercioId) => {
  try {
    const key = `menu_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : DEFAULT_MENU;
  } catch (e) {
    console.error('Error cargando menú publicado:', e);
    return DEFAULT_MENU;
  }
};

/**
 * Obtiene el menú BORRADOR de un comercio
 * Si no existe, se inicializa con el menú publicado
 */
export const getMenuBorrador = (comercioId) => {
  try {
    const key = `borrador_comercio_${comercioId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    // Si no hay borrador, usar el menú publicado como base
    const publicado = getMenuPublicado(comercioId);
    localStorage.setItem(key, JSON.stringify(publicado));
    return publicado;
  } catch (e) {
    console.error('Error cargando borrador:', e);
    return DEFAULT_MENU;
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
 * PUBLICA el borrador (sobrescribe el menú público)
 */
export const publicarMenu = (comercioId) => {
  try {
    const borrador = getMenuBorrador(comercioId);
    
    // ✅ SOLUCIÓN: Filtrar platos marcados como eliminados
    const menuLimpio = borrador.map(categoria => ({
      ...categoria,
      opciones: categoria.opciones.filter(opt => !opt._deleted)
    }));
    
    const key = `menu_comercio_${comercioId}`;
    localStorage.setItem(key, JSON.stringify(menuLimpio));
    
    // Actualizar también el borrador para que quede limpio
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
 * Descarta el borrador (vuelve al menú publicado)
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