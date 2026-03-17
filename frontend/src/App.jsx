import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import ComandasDrawer from './ComandasDrawer';
import { CartProvider, useCart } from './CartContext';
import MediaCarousel from './components/MediaCarousel';
import PaymentModal from './PaymentModal';
import WelcomeInicio from './WelcomeInicio';
import MenuDesplegable from './layouts/MenuDesplegable';
import RegisterModal from './components/RegisterModal';

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
    '/img/Bebidas/CervezaHeineken.jpg',
    ],
    video: null,
    precio: 0.00,
    region: 'Puno',
    historia: 'Superfood andino...',
    proteina: 0,
    calorias: 0,
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

// ✅ CORRECTO - Todo dentro de MainApp
function MainApp() {
  const { itemCount } = useCart();
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  // Cargar usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('oneToOneUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.log('Error cargando usuario:', e);
      }
    }
  }, []);

  const handleSelectCategory = (category, volverAWelcome = false) => {
    console.log('Categoría seleccionada:', category);
    
    if (volverAWelcome) {
      setShowWelcome(true);
      setCurrentPage('home');
      return;
    }
    
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

  useEffect(() => {
    console.log('showWelcome:', showWelcome);
    console.log('selectedCategory:', selectedCategory);
    console.log('currentPage:', currentPage);
  }, [showWelcome, selectedCategory, currentPage]);

  const itemsToShow = menuItems.length > 0 ? menuItems : DEFAULT_MENU_ITEMS;

  const handleRegister = (userData, modo) => {
  console.log('📝 RegisterModal - handleRegister:', { userData, modo });
  
  if (modo === 'logout') {
    setUser(null);
    localStorage.removeItem('oneToOneUser');
  } else {
    setUser(userData);
    localStorage.setItem('oneToOneUser', JSON.stringify(userData));
  }
};

  return (
    <div className="app">
      {showWelcome ? (
        <WelcomeInicio onSelectCategory={handleSelectCategory} />
      ) : (
        <>
          <NavBar
  currentPage={currentPage} 
  setCurrentPage={setCurrentPage} 
  itemCount={itemCount}
  onOpenMenu={() => setMenuAbierto(true)}
  onOpenPerfil={() => {
  console.log('🟢 MainApp: onOpenPerfil ejecutado');
  setPerfilAbierto(true);
}} // ← ¡ESTA LÍNEA ES CLAVE!
  user={user}
/>
          
          <MenuDesplegable 
            abierto={menuAbierto}
            onClose={() => setMenuAbierto(false)}
            onSelectCategoria={handleSelectCategory}
            />
            <RegisterModal 
          open={perfilAbierto}
          onClose={() => setPerfilAbierto(false)}
          onRegister={handleRegister}
          modo="editar"
          usuario={user}
        />
          
          <main className="main-content" style={{ paddingTop: '100px' }}>
            {currentPage === 'home' && (
              <HomePage 
                platillos={itemsToShow.filter(item => 
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
} // ← ¡CIERRE DE MainApp!

// ============================================
// HEADER SUPERIOR FLOTANTE CON TÍTULO CENTRAL
// ============================================
function NavBar({ currentPage, setCurrentPage, itemCount, onOpenMenu, onOpenPerfil, user }) {
  console.log('🔵 NavBar - onOpenPerfil es una función:', typeof onOpenPerfil === 'function');
  console.log('🔵 NavBar - user existe:', !!user);
  
  return (
    <header style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: '95%',
      maxWidth: 1200,
      // Efecto vidrio nativo (ajustado para mayor transparencia):
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 60,
      padding: '0.4rem 1.2rem', // Ligeramente más compacto
      // Sombra tipo iPhone (más sutil):
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      
      {/* ===== IZQUIERDA - MENÚ HAMBURGUESA ===== */}
      <button
        onClick={() => {
          console.log('🟢 Click en botón menu');
          if (onOpenMenu) {
            console.log('🟢 Abriendo menú');
            onOpenMenu();
          } else {
            console.log('🔴 ERROR: onOpenMenu no está definido');
          }
        }} 
        style={{  
          background: 'transparent',
          border: 'none',
          borderRadius: 40,
          padding: '0.5rem 0.8rem', // Padding horizontal reducido
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s ease'
        }}  
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{ width: 22, height: 2, background: 'var(--verde-selva)', borderRadius: 2 }} />
        <div style={{ width: 22, height: 2, background: 'var(--maracuya)', borderRadius: 2 }} />
        <div style={{ width: 22, height: 2, background: 'var(--morado-primario)', borderRadius: 2 }} />
      </button>

      {/* ===== CENTRO - LOGO ONE TO ONE ===== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        padding: '0.3rem 1rem',
        borderRadius: 40,
        transition: 'background 0.2s ease'
      }}
      onClick={() => setCurrentPage('home')}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{
          fontSize: '1.6rem',
          filter: 'drop-shadow(0 2px 4px rgba(1, 64, 14, 0.2))'
        }}>
          🔱
        </span>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1.1
        }}>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #01400e 0%, #2a6b2f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px'
          }}>
            ONE TO ONE
          </span>
        </div>
      </div>

      {/* ===== DERECHA - ACCIONES ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Carrito */}
        <NavButton 
          page="carrito" 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
        >
          <span style={{ fontSize: '1.2rem', opacity: 0.9 }}>🛒</span>
          {itemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -3,
              right: -3,
              background: '#ff3b30', // Rojo iOS
              color: 'white',
              width: 18,
              height: 18,
              borderRadius: '50%',
              fontSize: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid white',
              fontWeight: '600'
            }}>
              {itemCount}
            </span>
          )}
        </NavButton>

        {/* Perfil de Usuario */}
        <button
          onClick={onOpenPerfil}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: 40,
            padding: '0.5rem 0.7rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'background 0.2s ease',
            position: 'relative',
            opacity: 0.9
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          👤
          {user && (
            <span style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              background: '#34c759', // Verde iOS
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          )}
        </button>

        {/* Dashboard - Solo admin */}
        <button
          onClick={() => setCurrentPage('admin')}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: 30,
            padding: '0.3rem 0.7rem',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.5px',
            color: '#8e8e93', // Gris iOS
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(142, 142, 147, 0.1)';
            e.currentTarget.style.color = '#6366f1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#8e8e93';
          }}
        >
          DSH
        </button>
      </div>
    </header>
  );
}
// ============================================
// BOTÓN DE NAVEGACIÓN (reutilizable)
// ============================================
function NavButton({ page, currentPage, setCurrentPage, children }) {
  const isActive = currentPage === page;
  
  return (
    <button
      onClick={() => setCurrentPage(page)}
      style={{
        background: isActive 
          ? 'linear-gradient(135deg, var(--morado-primario) 0%, var(--morado-secundario) 100%)'
          : 'transparent',
        border: 'none',
        borderRadius: '40px',
        padding: '0.5rem 1rem',
        fontSize: '0.95rem',
        fontWeight: isActive ? '600' : '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: isActive ? 'white' : 'var(--gris-texto)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        position: 'relative',
        boxShadow: isActive ? '0 4px 10px rgba(102, 126, 234, 0.3)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );
}

// ============================================
// COMPONENTES DE PÁGINA
// ============================================
function HomePage({ platillos }) {
  const { addToCart } = useCart();
  
  return (
    <section className="home-page">
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

function MenuItem({ item, addToCart }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const selectedData = item.opciones?.find(o => o.nombre === selectedOption);
  const currentPrice = selectedData?.precio ?? item.precio ?? 0;
  
  const nutrition = {
    calorias: selectedData?.calorias ?? item.calorias ?? 0,
    proteina: selectedData?.proteina ?? item.proteina ?? 0,
    carbohidratos: selectedData?.carbohidratos ?? item.carbohidratos ?? 0
  };

  const description = selectedData?.descripcion || item.historia;
  
  const OfertaBadge = () => {
    if (!item.enOferta) return null;
    return (
      <span style={styles.ofertaBadge}>
        🏷️ {item.tagPromo} -{item.descuentoAplicado}%
      </span>
    );
  };

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
            🔱 {item.nombre}
          </div>
        )}
      </div>

      <div className="food-info" style={styles.foodInfo}>
        <div style={styles.categoryHeader}>
          <h2 style={styles.categoryTitle}>
            {item.nombre}
            <OfertaBadge />
          </h2>
        </div>
        
        <p style={styles.categoryDescription}>{description}</p>

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
  const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  ];

  if (!item.imagenes || item.imagenes.length === 0) {
    FALLBACK_IMAGES.forEach(url => {
      items.push({ tipo: 'imagen', url });
    });
  } else {
    item.imagenes.forEach(url => {
      if (url) items.push({ tipo: 'imagen', url });
    });
  }

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

function CartSummary({ total, onCheckout, onClear, user }) {
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
      
      {/* Mensaje de descuento para no registrados */}
      {!user && (
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          borderRadius: '10px',
          padding: '0.8rem',
          margin: '1rem 0',
          textAlign: 'center',
          border: '1px dashed var(--mango)'
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--gris-texto)', marginBottom: '0.3rem' }}>
            ✨ ¿Eres cliente frecuente?
          </p>
          <button
            onClick={() => {/* Abrir registro */}}
            style={{
              background: 'transparent',
              border: '2px solid var(--mango)',
              borderRadius: '20px',
              padding: '0.3rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--maracuya)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Regístrate y obtén descuentos
          </button>
        </div>
      )}
      
      {/* Badge de descuento para registrados */}
      {user && (
        <div style={{
          background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
          borderRadius: '10px',
          padding: '0.5rem',
          margin: '1rem 0',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--verde-selva)', fontWeight: 'bold' }}>
            🎉 10% de descuento para miembros
          </p>
        </div>
      )}
      
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
// ESTILOS ADICIONALES
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

const styles = {
  foodCard: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',     // Centra todo verticalmente
  background: 'transparent',
  overflow: 'visible',
  marginBottom: '3.5rem',
  padding: '0 20px'         // Margen lateral para el iPhone
},
  foodMedia: {
  width: '100%',
  aspectRatio: '1 / 1',      // 👈 Forzamos el formato cuadrado de tu captura
  maxWidth: '320px',        // 👈 Medida ideal para iPhone (ni muy grande ni muy pequeña)
  margin: '0 auto 25px auto', // Centrado y con separación de la galleta
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#1a1a1a',
  borderRadius: '20px',     // Bordes suaves como el anuncio de Asus
  zIndex: 1,
  boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
},
  foodImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
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
  foodInfo: {
  width: '100%',
  maxWidth: '320px',        // 👈 MISMA MEDIDA que el carrusel para simetría
  margin: '0 auto',         // Centrada con el carrusel
  padding: '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  background: 'white',
  borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
  zIndex: 2,
  minHeight: 'auto',        // Deja que crezca según el texto
  maxHeight: 'none'         // Quitamos el scroll interno para que sea una "galleta" real
},
  categoryHeader: {
    marginBottom: '0.5rem'
  },
  categoryTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: 'var(--verde-selva)',
    margin: '0 0 0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    flexWrap: 'wrap',
    letterSpacing: '-0.5px'
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
    lineHeight: 1.7,
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
    padding: '0.3rem 0.1rem',
    borderRadius: '10px',
    marginBottom: '0.8rem',
    border: '1px solid var(--borde-tropical)',
    fontSize: '0.8rem',
    gap: '0.3rem'
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

// ============================================
// ESTILOS PARA HOVER Y TOOLTIPS
// ============================================
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

  /* Tooltip para admin */
  .admin-tooltip {
    opacity: 0 !important;
    transition: opacity 0.2s ease !important;
  }
  
  div:hover > .admin-tooltip {
    opacity: 1 !important;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    header {
      padding: 0.5rem 1rem !important;
    }
  }
  
  @media (max-width: 480px) {
    .logo-text {
      font-size: 1rem !important;
    }
    .logo-subtitle {
      display: none !important;
    }
  }
`;

// ============================================
// AGREGAR ESTILOS AL DOCUMENTO
// ============================================
document.head.appendChild(style);
document.head.appendChild(styleSheet);