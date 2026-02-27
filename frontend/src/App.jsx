import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import ComandasDrawer from './ComandasDrawer';
import { CartProvider, useCart } from './CartContext';
import MediaCarousel from './components/MediaCarousel';
import PaymentModal from './PaymentModal';
import WelcomeScreen from './WelcomeScreen';

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const STORAGE_KEYS = {
  MENU: 'restaurante_menu',
  PENDING: 'restaurante_pending',
  LOGS: 'restaurante_logs'
};

const DEFAULT_MENU_ITEMS = [
  {
    id: 1,
    nombre: 'Primero',
    imagenes: [
      '/img/Complementos/Alitas1.png',
      '/img/Complementos/Alitas2.png',
      '/img/Complementos/Bistec convinado.png',
    ],
    video: null,
    precio: 0.00,
    region: 'Andes',
    historia: 'Plato típico andino...',
    calorias: 0,
    proteina: 0,
    carbohidratos: 0,
    opciones: [
      { nombre: 'Menestra', precio: 0.00, calorias: 320, proteina: 8, carbohidratos: 45, descripcion: '...' },
      { nombre: 'Guatita', precio: 0.00, calorias: 480, proteina: 22, carbohidratos: 35, descripcion: '...' },
      { nombre: 'Pollo', precio: 0.00, calorias: 280, proteina: 25, carbohidratos: 15, descripcion: '...' }
    ]
  },
  {
    id: 2,
    nombre: 'Segundo',
    imagenes: [
      '/img/Ensaladas/Ensalada Alemana de Patata.jpg',
      '/img/Ensaladas/Ensalada Caprese.jpg',
      '/img/Ensaladas/Ensalada César.jpg',
    ],
    video: null,
    precio: 0.00,
    region: 'Costa',
    historia: 'Tradicional plato costero...',
    calorias: 0,
    proteina: 0,
    carbohidratos: 0,
    opciones: [
      { nombre: 'Pescado', precio: 0.00, calorias: 220, proteina: 28, carbohidratos: 12, descripcion: '...' },
      { nombre: 'Camarón', precio: 0.00, calorias: 180, proteina: 24, carbohidratos: 8, descripcion: '...' },
      { nombre: 'Mixto', precio: 0.00, calorias: 200, proteina: 26, carbohidratos: 10, descripcion: '...' }
    ]
  },
  {
    id: 3,
    nombre: 'Postre',
    imagenes: [
      '/img/Bebidas/AguaMineral.jpg',
      '/img/Bebidas/CervezaClub.jpg',
      '/img/Bebidas/CervezaGuinness.jpg',
    ],
    video: null,
    precio: 0.00,
    region: 'Puno',
    historia: 'Superfood andino...',
    calorias: 0,
    proteina: 0,
    carbohidratos: 0,
    opciones: [
      { nombre: 'Flan', precio: 0.00, calorias: 250, proteina: 6, carbohidratos: 40, descripcion: '...' },
      { nombre: 'Pudín', precio: 0.00, calorias: 320, proteina: 5, carbohidratos: 48, descripcion: '...' },
      { nombre: 'Helado', precio: 0.00, calorias: 180, proteina: 3, carbohidratos: 25, descripcion: '...' }
    ]
  }
];

// ============================================
// HOOK PERSONALIZADO PARA LOCALSTORAGE
// ============================================
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}

function MainApp() {
  const { itemCount } = useCart();
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowWelcome(false);
    setCurrentPage('home');
  };
  
  const [menuItems, setMenuItems] = useLocalStorage(STORAGE_KEYS.MENU, DEFAULT_MENU_ITEMS);
  const [pendingOrders, setPendingOrders] = useLocalStorage(STORAGE_KEYS.PENDING, []);
  const [log, setLog] = useLocalStorage(STORAGE_KEYS.LOGS, []);
  const [finishedOrders, setFinishedOrders] = useState([]);
  const [payOpen, setPayOpen] = useState(false);

  const handleSaveMenu = (updatedMenu) => setMenuItems(updatedMenu);
  const addLog = (entry) => setLog((prev) => [...prev, { ...entry, timestamp: new Date().toISOString() }]);

  return (
    <div className="app">
      {showWelcome ? (
        <WelcomeScreen 
          onSelectCategory={handleSelectCategory}
          onUserLogin={setUser}
        />
      ) : (
        <>
          <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} itemCount={itemCount} />
          <main className="main-content">
            {currentPage === 'home' && (
  <HomePage 
    platillos={menuItems.filter(item => 
      !selectedCategory || item.nombre === selectedCategory
    )} 
  />
)}
            {currentPage === 'carrito' && (
              <CartPage 
                addLog={addLog} 
                setPendingOrders={setPendingOrders} 
              />
            )}
            {currentPage === 'admin' && (
              <AdminPage
                menuItems={menuItems}
                onSaveMenu={handleSaveMenu}
                log={log}
                addLog={addLog}
                pendingOrders={pendingOrders}
                setPendingOrders={setPendingOrders}
                finishedOrders={finishedOrders}
                setFinishedOrders={setFinishedOrders}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

// ============================================
// COMPONENTES DE UI
// ============================================

function NavBar({ currentPage, setCurrentPage, itemCount }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">🍽️ One To One</h1>
        <div className="nav-links">
          <NavButton 
            page="home" 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
          >
            Menú
          </NavButton>
          <NavButton 
            page="carrito" 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
          >
            🛒 Carrito {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </NavButton>
          <NavButton 
            page="admin" 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
          >
            Dashboard
          </NavButton>
        </div>
      </div>
    </nav>
  );
}

function NavButton({ page, currentPage, setCurrentPage, children }) {
  return (
    <button 
      className={currentPage === page ? 'nav-btn active' : 'nav-btn'} 
      onClick={() => setCurrentPage(page)}
    >
      {children}
    </button>
  );
}

function HomePage({ platillos }) {
  const { addToCart } = useCart();
  
  return (
    <section className="home-page">
      <HeroSection />
      <div className="menu-container">
        {platillos.map((platillo) => (
          <MenuItem 
            key={platillo.id} 
            item={platillo}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <div className="hero" style={{ textAlign: 'center' }}>
      <img 
        src="/The-One-icon.png" 
        alt="Logo One To One" 
        style={{
          width: '90px',
          height: '90px',
          marginBottom: '0.5rem',
          borderRadius: '22px',
          boxShadow: '0 4px 18px rgba(118,75,162,0.13)'
        }}
      />
      <h2 style={{ marginBottom: '0.3rem' }}>One To One 🎉</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        ¡Descubre nuestros deliciosos menús diarios con platos típicos!
      </p>
    </div>
  );
}

function MenuItem({ item, addToCart }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Opción seleccionada
  const selectedData = item.opciones?.find(o => o.nombre === selectedOption);

  // Precio actual
  const currentPrice = selectedData?.precio ?? item.precio ?? 0;
  {item.enOferta && selectedData?.precioOriginal && (
  <span style={{
    fontSize: '0.7rem',
    color: '#999',
    textDecoration: 'line-through',
    marginRight: '0.3rem'
  }}>
    ${selectedData.precioOriginal.toFixed(2)}
  </span>
)}

  // Nutrición
  const nutrition = {
    calorias: selectedData?.calorias ?? item.calorias ?? 0,
    proteina: selectedData?.proteina ?? item.proteina ?? 0,
    carbohidratos: selectedData?.carbohidratos ?? item.carbohidratos ?? 0
  };

  // Descripción
  const description = selectedData?.descripcion || item.historia;
   // Badge de oferta para la categoría
  const OfertaBadge = () => {
    if (!item.enOferta) return null;
    
    return (
      <span style={styles.ofertaBadge}>
        🏷️ {item.tagPromo} -{item.descuentoAplicado}%
      </span>
    );
  };

  // Items multimedia para carrusel
  const mediaItems = buildMediaItems(item);

  const handleAddToCart = () => {
    if (!selectedOption) {
      alert('Por favor selecciona una opción');
      return;
    }

    addToCart({
      ...item,
      id: `${item.id}-${selectedOption}`,
      variante: selectedOption,
      nombre: `${item.nombre} - ${selectedOption}`,
      precio: currentPrice,
      ...nutrition,
      cantidad: 1
    });
    
    setSelectedOption(null);
  };

  return (
   <div className="food-card" style={styles.foodCard}>
  {/* Imagen o carrusel */}
  <div className="food-media" style={styles.foodMedia}>
    {item.imagenes && item.imagenes[0] ? (
      <img 
        src={item.imagenes[0]} 
        alt={item.nombre}
        className="food-image"
        style={styles.foodImage}
      />
    ) : (
      <div style={styles.noImage}>
        🍽️ {item.nombre}
      </div>
    )}
  </div>

      {/* Información */}
      <div className="food-info" style={styles.foodInfo}>
        {/* Título de categoría más grande y con color */}
        <div style={styles.categoryHeader}>
          <h2 style={styles.categoryTitle}>
            {item.nombre}
            <OfertaBadge />
          </h2>
        </div>
        
        <p style={styles.categoryDescription}>{description}</p>

        {/* Opciones con checkbox alineado y precio a la derecha */}
        <div style={styles.optionsContainer}>
          {item.opciones?.map((opt, idx) => {
            const tieneOferta = item.enOferta && opt.precioOriginal;
            const precioOriginal = tieneOferta ? opt.precioOriginal : null;
            const precioActual = opt.precio || 0;
            
            return (
              <label key={idx} style={styles.optionRow}>
                <div style={styles.optionLeft}>
                  <input 
                    type="checkbox"
                    checked={selectedOption === opt.nombre}
                    onChange={() => setSelectedOption(selectedOption === opt.nombre ? null : opt.nombre)}
                    style={styles.checkbox}
                  />
                  <span style={styles.optionName}>{opt.nombre}</span>
                </div>
                <div style={styles.optionRight}>
                  {tieneOferta && (
                    <span style={styles.precioOriginal}>
                      ${precioOriginal.toFixed(2)}
                    </span>
                  )}
                  <span style={styles.precioActual}>
                    ${precioActual.toFixed(2)}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Nutrición */}
        <div style={styles.nutritionInfo}>
          <span style={styles.nutritionItem}>
            <span style={styles.nutritionIcon}>🥗</span>
            <span style={styles.nutritionValue}>{nutrition.calorias}</span> kcal
          </span>
          <span style={styles.nutritionItem}>
            <span style={styles.nutritionIcon}>🥩</span>
            <span style={styles.nutritionValue}>{nutrition.proteina}</span>g prot
          </span>
          <span style={styles.nutritionItem}>
            <span style={styles.nutritionIcon}>🍚</span>
            <span style={styles.nutritionValue}>{nutrition.carbohidratos}</span>g carb
          </span>
        </div>

        {/* Footer con precio y botón */}
        <div style={styles.footer}>
          <div style={styles.precioContainer}>
            {selectedOption && selectedData && item.enOferta && selectedData.precioOriginal && (
              <span style={styles.precioOriginalGrande}>
                ${selectedData.precioOriginal.toFixed(2)}
              </span>
            )}
            <span style={styles.precioFinal}>
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          <button 
            style={styles.addButton}
            onClick={handleAddToCart}
            disabled={!selectedOption}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

function buildMediaItems(item) {
  const items = [];
  
  // Unsplash fallback images
  const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  ];

  // Si no hay imágenes, usar fallbacks
  if (!item.imagenes || item.imagenes.length === 0) {
    FALLBACK_IMAGES.forEach(url => {
      items.push({ tipo: 'imagen', url });
    });
  } else {
    // Usar imágenes del item
    item.imagenes.forEach(url => {
      if (url) items.push({ tipo: 'imagen', url });
    });
  }

  // Agregar video si existe
  if (item.video) {
    items.push({ tipo: 'video', url: item.video });
  }

  return items;
}

function CartPage({ addLog, setPendingOrders }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart();
  const [payOpen, setPayOpen] = useState(false);
  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h2>Tu Carrito</h2>
        <div className="empty-state">
          <p>Tu carrito está vacío. ¡Agrega platos deliciosos! 🛒</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2>Tu Carrito 🛒</h2>
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
        
        <CartSummary
          total={total}
          onCheckout={() => setPayOpen(true)}
          onClear={clearCart}
        />
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        total={total}
        addLog={addLog}
        setPendingOrders={setPendingOrders}
      />
    </section>
  );
}

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const cantidad = item.cantidad || 1;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.nombre}</h4>
        <p className="item-price">${item.precio.toFixed(2)}</p>
      </div>
      
      <div className="cart-item-controls">
        <button 
          className="qty-btn"
          onClick={() => onUpdateQuantity(item.id, cantidad - 1)}
          disabled={cantidad <= 1}
        >
          -
        </button>
        <span className="qty">{cantidad}</span>
        <button 
          className="qty-btn"
          onClick={() => onUpdateQuantity(item.id, cantidad + 1)}
        >
          +
        </button>
      </div>

      <div className="cart-item-total">
        <p>${(item.precio * cantidad).toFixed(2)}</p>
      </div>

      <button 
        className="delete-btn"
        onClick={() => onRemove(item.id)}
        aria-label="Eliminar item"
      >
        🗑️
      </button>
    </div>
  );
}

function CartSummary({ total, onCheckout, onClear }) {
  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Subtotal:</span>
        <span>${total}</span>
      </div>
      <div className="summary-row">
        <span>Envío:</span>
        <span>Gratis</span>
      </div>
      <div className="summary-row total">
        <span>Total:</span>
        <span className="total-amount">${total}</span>
      </div>
      <button className="checkout-btn" onClick={onCheckout}>
        Proceder al Pago
      </button>
      <button className="clear-btn" onClick={onClear}>
        Vaciar Carrito
      </button>
    </div>
  );
}

// ============================================
// ESTILOS ADICIONALES (para el carrusel fallback)
// ============================================
const style = document.createElement('style');
style.textContent = `
  .carousel-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ffb347 0%, #ff6b35 100%);
    color: white;
    font-size: 2rem;
  }

  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .qty {
    min-width: 30px;
    text-align: center;
    font-weight: bold;
  }

  .cart-item-total {
    font-weight: bold;
    color: var(--maracuya);
  }

  .checkout-btn, .clear-btn {
    width: 100%;
    padding: 0.8rem;
    margin-top: 0.5rem;
    border-radius: 40px;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .checkout-btn {
    background: var(--verde-selva);
    color: var(--mango);
  }

  .checkout-btn:hover {
    background: var(--maracuya);
    color: white;
  }

  .clear-btn {
    background: #f8f9fa;
    color: var(--gris-texto);
    border: 2px solid var(--maracuya);
  }

  .clear-btn:hover {
    background: var(--maracuya);
    color: white;
  }
`;
// ============================================
// ESTILOS PARA EL COMPONENTE MENUITE M
// ============================================
const styles = {
  foodCard: {
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
  background: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
  // Proporción áurea general
  maxWidth: '600px',
  margin: '0 auto 2rem auto'
},

  
  foodMedia: {
  width: '100%',
  height: '0',
  paddingBottom: '61.8%',      // ← 1/1.618 = 0.618
  position: 'relative',
  overflow: 'visible',
  backgroundColor: 'var(--crema-tropical)',
  borderRadius: '16px 16px 0 0', // ← Bordes redondeados solo arriba
    zIndex: 1
  },

foodImage: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease', // ← Efecto hover
},
  
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'white',
    fontSize: '1.5rem'
  },
  
  // Busca esta sección en tu objeto styles
foodInfo: {
  padding: '1.2rem 1.2rem',     // ← Padding reducido
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',                // ← Gap reducido
  background: 'white',
  flex: 1,
  // La altura se ajusta automáticamente al contenido
  minHeight: '200px',           // ← Altura mínima (opcional)
  maxHeight: '350px',           // ← Altura máxima controlada
  overflowY: 'auto'             // ← Scroll si el contenido excede
},

  
  categoryHeader: {
    marginBottom: '0.5rem'
  },
  
  categoryTitle: {
  fontSize: '2.2rem',           // ← Título grande y elegante
  fontWeight: '800',
  color: 'var(--verde-selva)',
  margin: '0 0 0.5rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  flexWrap: 'wrap',
  letterSpacing: '-0.5px'       // ← Mejora legibilidad
},
  
  ofertaBadge: {
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    padding: '0.3rem 0.8rem',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
    display: 'inline-block'
  },
  
  categoryDescription: {
  fontSize: '0.95rem',
  color: 'var(--gris-texto)',
  lineHeight: 1.7,              // ← Mejor espaciado
  marginBottom: '1rem',
  fontStyle: 'italic',
  opacity: 0.9
},
  
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
    marginBottom: '1.5rem'
  },
  
  optionRow: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.3rem 1rem',
  background: 'var(--crema-tropical)',
  borderRadius: '12px',
  border: '2px solid var(--borde-tropical)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  // Proporción áurea en el espaciado
  marginBottom: '0.5rem'
},
  
  optionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--maracuya)'
  },
  
  optionName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--gris-texto)'
  },
  
  optionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  
  precioOriginal: {
    fontSize: '0.85rem',
    color: '#999',
    textDecoration: 'line-through'
  },
  
  precioActual: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--maracuya)'
  },
  
  nutritionInfo: {
  display: 'flex',
  justifyContent: 'space-around',
  background: 'rgba(255, 179, 71, 0.1)',
  padding: '0.3rem 0.1rem',        // ← Padding reducido (antes 0.5rem)
  borderRadius: '10px',             // ← Radio más pequeño (antes 30px)
  marginBottom: '0.8rem',           // ← Margen inferior reducido (antes 1.5rem)
  border: '1px solid var(--borde-tropical)', // ← Borde más fino (antes 2px)
  fontSize: '0.8rem',               // ← Texto más pequeño
  gap: '0.3rem'                     // ← Espacio entre elementos
},
  
  nutritionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '0.9rem',
    color: 'var(--gris-texto)'
  },
  
  nutritionIcon: {
    fontSize: '1.1rem'
  },
  
  nutritionValue: {
    fontWeight: '700',
    color: 'var(--verde-selva)'
  },
  
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '2px solid var(--mango)'
  },
  
  precioContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  
  precioOriginalGrande: {
    fontSize: '1rem',
    color: '#999',
    textDecoration: 'line-through'
  },
  
  precioFinal: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--maracuya)'
  },
  
  addButton: {
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '40px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

// Estilos adicionales para hover
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .option-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
    border-color: var(--maracuya) !important;
  }
  
  .add-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  }
  
  .add-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
   optionRow: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.2rem 0.4rem',     // ← Padding mínimo
  background: 'var(--crema-tropical)',
  borderRadius: '4px',           // ← Radio más pequeño
  border: '1px solid var(--borde-tropical)', // ← Borde más fino
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginBottom: '0.1rem',
  minHeight: '28px'              // ← Altura mínima
},
optionLeft: {
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem'
},

checkbox: {
  width: '12px',
  height: '12px',
  cursor: 'pointer',
  accentColor: 'var(--maracuya)'
},

optionName: {
  fontSize: '0.85rem',
  fontWeight: '400',
  color: 'var(--gris-texto)'
},

optionRight: {
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem'
},

precioOriginal: {
  fontSize: '0.65rem',
  color: '#999',
  textDecoration: 'line-through'
},

precioActual: {
  fontSize: '0.9rem',
  fontWeight: '500',
  color: 'var(--maracuya)'
}
    
`;

document.head.appendChild(styleSheet);
document.head.appendChild(style);