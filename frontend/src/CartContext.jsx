import React, { createContext, useState, useCallback, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // 1. Agregar al carrito (Capturando datos de oferta)
  const addToCart = useCallback((item) => {
  setCartItems((prevItems) => {
    // Buscamos si ya existe el mismo nombre (o ID)
    const existingItem = prevItems.find((i) => i.nombre === item.nombre);
    
    if (existingItem) {
      return prevItems.map((i) =>
        i.nombre === item.nombre
          ? { ...i, cantidad: (i.cantidad || 1) + 1 }
          : i
      );
    }
    // Si es nuevo, lo añadimos
    return [...prevItems, { ...item, cantidad: 1 }];
  });
}, []);


  const addOrder = useCallback((order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i.id === itemId ? { ...i, cantidad: newQuantity } : i
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  // 2. Calcular Total Real (Aritmética final)
  // Este total ya descuenta las ofertas para pasarlo a la pasarela de pago
  const calculateTotal = useCallback(() => {
    const total = cartItems.reduce((acc, item) => {
      // Usamos el precio que viene del plato (que ya es el rebajado si hay promo)
      return acc + (item.precio * (item.cantidad || 1));
    }, 0);
    return total.toFixed(2);
  }, [cartItems]);

  const itemCount = cartItems.reduce((sum, item) => sum + (item.cantidad || 1), 0);

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
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de CartProvider');
  return context;
};
