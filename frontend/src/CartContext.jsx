import React, { createContext, useState, useCallback, useContext, useEffect, useMemo } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Estado que guarda carritos por ID de comercio: { 1: [...], 2: [...] }
  const [cartsByComercio, setCartsByComercio] = useState(() => {
    const saved = localStorage.getItem('multi_carts');
    return saved ? JSON.parse(saved) : {};
  });

  // ID del comercio donde está el usuario actualmente
  const [currentComercioId, setCurrentComercioId] = useState(null);
  
  // Órdenes completadas
  const [orders, setOrders] = useState([]);

  // Sincronizar con LocalStorage
  useEffect(() => {
    localStorage.setItem('multi_carts', JSON.stringify(cartsByComercio));
  }, [cartsByComercio]);

  // EL TRUCO: cartItems solo devuelve los platos del comercio activo
  const cartItems = useMemo(() => {
    return currentComercioId ? (cartsByComercio[currentComercioId] || []) : [];
  }, [cartsByComercio, currentComercioId]);

  // 1. Agregar al carrito (recibe el id del comercio automáticamente o se pasa)
  const addToCart = useCallback((item, comercioId) => {
    const targetId = comercioId || currentComercioId;
    if (!targetId) {
      console.warn('No hay comercio activo');
      return;
    }

    setCartsByComercio((prev) => {
      const itemsDeEsteComercio = prev[targetId] || [];
      const existingItem = itemsDeEsteComercio.find((i) => i.nombre === item.nombre);
      
      let nuevosItems;
      if (existingItem) {
        // Incrementa cantidad si ya existe
        nuevosItems = itemsDeEsteComercio.map((i) =>
          i.nombre === item.nombre 
            ? { ...i, cantidad: (i.cantidad || 1) + 1 } 
            : i
        );
      } else {
        // Agrega nuevo item
        nuevosItems = [...itemsDeEsteComercio, { ...item, cantidad: 1 }];
      }
      return { ...prev, [targetId]: nuevosItems };
    });
  }, [currentComercioId]);

  // 2. Eliminar del carrito
  const removeFromCart = useCallback((identifier, comercioId) => {
    const targetId = comercioId || currentComercioId;
    if (!targetId) return;

    setCartsByComercio((prev) => {
      const itemsDeEsteComercio = prev[targetId] || [];
      const nuevosItems = itemsDeEsteComercio.filter(
        (i) => i.nombre !== identifier && i.id !== identifier
      );
      return { ...prev, [targetId]: nuevosItems };
    });
  }, [currentComercioId]);

  // 3. Actualizar cantidad
  const updateQuantity = useCallback((identifier, newQuantity, comercioId) => {
    const targetId = comercioId || currentComercioId;
    if (!targetId) return;

    if (newQuantity <= 0) {
      removeFromCart(identifier, targetId);
    } else {
      setCartsByComercio((prev) => {
        const itemsDeEsteComercio = prev[targetId] || [];
        const nuevosItems = itemsDeEsteComercio.map((i) =>
          (i.nombre === identifier || i.id === identifier) 
            ? { ...i, cantidad: newQuantity } 
            : i
        );
        return { ...prev, [targetId]: nuevosItems };
      });
    }
  }, [currentComercioId, removeFromCart]);

  // 4. Limpiar carrito actual
  const clearCart = useCallback((comercioId) => {
    const targetId = comercioId || currentComercioId;
    if (!targetId) return;
    
    setCartsByComercio((prev) => ({ ...prev, [targetId]: [] }));
  }, [currentComercioId]);

  // 5. Cambiar de comercio (se llama desde App.jsx)
  const switchComercio = useCallback((comercioId) => {
    setCurrentComercioId(comercioId);
  }, []);

  // 6. Calcular Total Real del carrito actual
  const calculateTotal = useCallback(() => {
    const total = cartItems.reduce((acc, item) => {
      return acc + (item.precio * (item.cantidad || 1));
    }, 0);
    return total.toFixed(2);
  }, [cartItems]);

  // 7. 🔥 CONTADOR DE ITEMS - Se actualiza automáticamente
  const itemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  }, [cartItems]);

  // 8. Agregar orden completada
  const addOrder = useCallback((order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  }, []);

  // 9. Verificar si hay carrito en otro comercio (para alertas)
  const hasCartInOtherComercio = useCallback((comercioId) => {
    return Object.keys(cartsByComercio).some(id => 
      id !== String(comercioId) && cartsByComercio[id]?.length > 0
    );
  }, [cartsByComercio]);

  // 10. Obtener resumen de carritos por comercio
  const getCarritosResumen = useCallback(() => {
    const resumen = [];
    for (const [id, items] of Object.entries(cartsByComercio)) {
      if (items && items.length > 0 && Number(id) !== currentComercioId) {
        resumen.push({
          comercioId: id,
          totalItems: items.reduce((acc, i) => acc + (i.cantidad || 1), 0),
          comercioNombre: items[0]?.comercioNombre || items[0]?.nombreComercio || `Comercio ${id}`
        });
      }
    }
    return resumen;
  }, [cartsByComercio, currentComercioId]);

  const value = {
    // Carrito actual
    cartItems,
    currentComercioId,
    cartsByComercio,
    
    // Acciones principales
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    itemCount,           // ✅ Este es el que hace que el número suba 1, 2, 3...
    
    // Gestión de comercios
    switchComercio,
    setCurrentComercioId,
    hasCartInOtherComercio,
    getCarritosResumen,
    
    // Órdenes
    orders,
    addOrder,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de CartProvider');
  return context;
};