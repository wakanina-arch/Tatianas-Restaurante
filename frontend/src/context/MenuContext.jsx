import { BACKEND_URL } from "../config.js";
import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const MenuContext = createContext();

// Hook personalizado para usar el contexto
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu debe usarse dentro de MenuProvider');
  }
  return context;
};

// Provider que envolverá la app
export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar menú desde el backend
  const cargarMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/menus`);
      if (!response.ok) {
        throw new Error('Error al cargar el menú');
      }
      const data = await response.json();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando menú:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar al iniciar
  useEffect(() => {
    cargarMenu();
  }, []);

  // Obtener platos por categoría (para cliente)
  const getPlatosPorCategoria = (categoriaKey) => {
    // Mapeo de categorías del frontend a las de MongoDB
    const mapeoCategorias = {
      primero: 'entrada',      // COMPLEMENTOS → entrada
      segundo: 'entrada',      // ENSALADAS → entrada
      postres: 'bebida',       // BEBIDAS → bebida
      otras: 'plato_fuerte'    // PIZZAS → plato_fuerte
    };
    
    const categoriaMongo = mapeoCategorias[categoriaKey];
    if (!categoriaMongo) return [];
    
    return menuItems.filter(item => 
      item.categoria === categoriaMongo && item.disponible === true
    );
  };

  // Obtener todas las categorías agrupadas (para cliente)
  const getMenuAgrupado = () => {
    const categorias = {
      primero: { titulo: '🍟 COMPLEMENTOS', icono: '🍟', platos: [] },
      segundo: { titulo: '🥗 ENSALADAS', icono: '🥗', platos: [] },
      postres: { titulo: '🥤 BEBIDAS', icono: '🥤', platos: [] },
      otras: { titulo: '🍕 PIZZAS AL HORNO', icono: '🍕', platos: [] }
    };

    // Llenar cada categoría con los platos disponibles
    Object.keys(categorias).forEach(key => {
      categorias[key].platos = getPlatosPorCategoria(key);
    });

    return categorias;
  };

  // Actualizar un plato (para admin)
  const actualizarPlato = async (id, datos) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if (response.ok) {
        // Recargar menú después de actualizar
        await cargarMenu();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error actualizando plato:', error);
      return false;
    }
  };

  const value = {
    menuItems,
    loading,
    error,
    cargarMenu,
    getPlatosPorCategoria,
    getMenuAgrupado,
    actualizarPlato
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
