import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Agregar item al carrito
  const addToCart = useCallback((item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        // Si existe, incrementar cantidad
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, cantidad: (i.cantidad || 1) + 1 }
            : i
        );
      } else {
        // Si no existe, agregar nuevo item con cantidad 1
        return [...prevItems, { ...item, cantidad: 1 }];
      }
    });
  }, []);

    // Estado para órdenes pagadas
    const [orders, setOrders] = useState([]);

    // Función para agregar una orden
   /* --- TRASPLANTE DE LÓGICA KANBAN --- */
const addOrder = useCallback((order) => {
  const orderConStatus = {
    ...order,
    // Generamos el ID si no existe para que el Repositorio de Auditoría lo rastree
    id: order.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    // 🟢 ESTADO INICIAL: Activa el botón verde en ComandasDrawer
    estado: 'Recibido', 
    // ⏱️ MARCA DE TIEMPO: Para el temporizador de cocina
    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    items: order.items || [],
    total: parseFloat(order.total) || 0
  };

  setOrders((prevOrders) => [...prevOrders, orderConStatus]);
  console.log("🚀 Orden teletransportada a cocina:", orderConStatus);
}, []);

// El resto sigue igual...
const removeFromCart = useCallback((itemId) => {
  setCartItems((prevItems) =>
    prevItems.filter((i) => i.id !== itemId)
  );
}, []);


  // Actualizar cantidad
  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i.id === itemId
            ? { ...i, cantidad: newQuantity }
            : i
        )
      );
    }
  }, [removeFromCart]);

  // Limpiar carrito
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calcular total
  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.precio * (item.cantidad || 1));
    }, 0).toFixed(2);
  }, [cartItems]);

  // Contar items
  const itemCount = cartItems.length;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    itemCount,
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
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};
