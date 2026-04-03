// ============================================
// HEADER SUPERIOR FLOTANTE CON TÍTULO CENTRAL
// ============================================

import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import { CartProvider, useCart } from './CartContext';
import PaymentModal from './PaymentModal';
import WelcomeInicio from './WelcomeInicio';
//import MenuDesplegable from './layouts/MenuDesplegable';
import RegisterModal from './components/RegisterModal';
import HomePage from './pages/HomePage';  // ← Importamos el nuevo HomePage

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
    nombre: 'Bebidas',
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
  },
  {
  id: 4,
  nombre: 'Pizzas', // 👈 Debe coincidir con el id
  imagenes: [
    '/img/Pizzas/Carbonara.jpg',
    '/img/Pizzas/Champinones.jpg',
    '/img/Pizzas/Cuatro-Quesos.jpg',
    '/img/Pizzas/Hawaiana.jpg',
    '/img/Pizzas/Margherita.jpg',
  ],
  video: null,
    precio: 0.00,
    region: 'Mundo',
    historia: 'Superfood del mundo...',
    proteina: 0,
    calorias: 0,
    carbohidratos: 0,
    opciones: [
      { nombre: 'Pizza', precio: 0.00, calorias: 250, proteina: 6, carbohidratos: 40, descripcion: '...' },
      { nombre: 'Hamburguesa', precio: 0.00, calorias: 320, proteina: 5, carbohidratos: 48, descripcion: '...' },
      { nombre: 'HotDog', precio: 0.00, calorias: 180, proteina: 3, carbohidratos: 25, descripcion: '...' }
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
  const COMERCIOS = [
  { id: 1, nombre: "En su punto", imagen: "/casas/en_su_punto.JPG" },
  { id: 2, nombre: "Ceremoniales", imagen: "/casas/Ceremoniales.JPG" },
  { id: 3, nombre: "Como en casa", imagen: "/casas/Como_en_casa.JPG" },
  { id: 4, nombre: "Gusto", imagen: "/casas/IMG_4552.JPG" },
  { id: 5, nombre: "Candela Obscura", imagen: "/casas/IMG_4555.JPG" },
  { id: 6, nombre: "Kattapa", imagen: "/casas/Kattapa.JPG" },
  { id: 7, nombre: "Llap Grill", imagen: "/casas/Llap_Grill.JPG" },
  { id: 8, nombre: "Pollo a la leña", imagen: "/casas/Pollo_a_la_leña.JPG" },
  { id: 9, nombre: "Tradicional", imagen: "/casas/Tradicional.JPG" },
];
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState(null);

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

  const handleSelectCategory = (categoryLabel, comercioId = null, volverAWelcome = false) => {
  console.log('🎭 Categoría:', categoryLabel, 'Comercio:', comercioId);
  
  if (volverAWelcome) {
    setShowWelcome(true);
    setSelectedCategory(null);
    setCurrentPage('home');
    return;
  }
  
  setSelectedCategory(categoryLabel);
  setSelectedComercio(comercioId);  // ← guardamos el comercio seleccionado
  setShowWelcome(false);
  setCurrentPage('home');
};

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setSelectedCategory(null);
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
            }}
            onBackToWelcome={handleBackToWelcome}
            user={user}
          />
          
          {/* <MenuDesplegable 
  abierto={menuAbierto}
  onClose={() => setMenuAbierto(false)}
  onSelectCategoria={handleSelectCategory}
  comercioId={selectedComercio}
/> */}
          
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
    comercio={COMERCIOS.find(c => c.id === selectedComercio)}
    platillos={itemsToShow}
    user={user}
    itemCount={itemCount}
    onOpenMenu={() => setMenuAbierto(true)}
    onOpenPerfil={() => setPerfilAbierto(true)}
    onBackToWelcome={handleBackToWelcome}
    NavBarComponent={NavBar}
  />
)}


            {currentPage === 'carrito' && (
              <CartPage 
                addLog={addLog} 
                setPendingOrders={setPendingOrders}
                  user={user}
                  onVolverAlMenu={() => setCurrentPage('home')}
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
                onBack={() => setCurrentPage('home')}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

// ============================================
// HEADER SUPERIOR FLOTANTE - FULL WIDTH
// Franja de lado a lado de la pantalla
// ============================================
function NavBar({ currentPage, setCurrentPage, itemCount, onOpenMenu, onOpenPerfil, onBackToWelcome, user }) {
  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        {/* Botón Volver (izquierda) */}
        <button
          onClick={onBackToWelcome}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          style={styles.backBtn}
        >
          ←
        </button>

        {/* Logo ONE TO ONE (centro) */}
        <div style={styles.logoContainer} onClick={onBackToWelcome}>
          <span style={styles.logoIcon}>🔱</span>
          <span style={{
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#B22222',  // rojo místico
    textShadow: '0 0 5px rgba(178,34,34,0.5), 0 0 10px rgba(178,34,34,0.3)',
    animation: 'brilloRojo 2.5s infinite alternate',
  }}>ONE</span>{' '}
  <span style={{
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a3b1a',  // verde selva
    textShadow: '0 0 5px rgba(26,59,26,0.5), 0 0 10px rgba(26,59,26,0.3)',
    animation: 'brilloVerde 2.5s infinite alternate',
  }}>TO</span>{' '}
  <span style={{
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#FFD700',  // dorado
    textShadow: '0 0 5px rgba(255,215,0,0.5), 0 0 10px rgba(255,215,0,0.3)',
    animation: 'brilloDorado 2.5s infinite alternate',
  }}>ONE</span>
        </div>

        {/* Iconos derecha */}
        <div style={styles.rightIcons}>
          <NavButton page="carrito" currentPage={currentPage} setCurrentPage={setCurrentPage}>
            🛒
            {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
          </NavButton>
          {/* Dashboard (solo visible para admin) */}
  {user?.rol === 'admin_restaurante' && (
    <NavButton page="admin" currentPage={currentPage} setCurrentPage={setCurrentPage}>
      DSH
    </NavButton>
  )}
          <button onClick={onOpenPerfil} style={styles.perfilBtn}>
            👤
            {user && <span style={styles.userDot} />}
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(20, 10, 10, 0.75)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,215,0,0.15)',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
  },
  headerContent: {
    width: '100%',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.3rem',
    color: '#FFD700',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '30px',
    transition: 'all 0.2s ease',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '1.3rem',
  },
  logoText: {
    fontSize: '1rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #FF4500, #FFD700)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  rightIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    background: '#FF4500',
    color: 'white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    fontSize: '0.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfilBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    position: 'relative',
  },
  userDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '8px',
    height: '8px',
    background: '#34c759',
    borderRadius: '50%',
  },
};
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
          ? 'linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)'
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
        boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
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
// ELIMINADO: HomePage (se movió a HomePage.jsx)
// ELIMINADO: MenuItem (se movió a components/MenuItem.jsx)
// ============================================

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

// ============================================
// CARRITO - ESTILO CRISTAL ESMERILADO (ORIGINAL MEJORADO)
// ============================================
function CartPage({ addLog, setPendingOrders, user, onVolverAlMenu }) {
  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const [payOpen, setPayOpen] = useState(false);
  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <section style={cartStyles.container}>
        <div style={cartStyles.emptyCard}>
          <span style={cartStyles.emptyIcon}>🛒</span>
          <h2 style={cartStyles.emptyTitle}>Tu Carrito</h2>
          <p style={cartStyles.emptyText}>Tu carrito está vacío. ¡Agrega platos deliciosos!</p>
        </div>
      </section>
    );
  }

  return (
    <section style={cartStyles.container}>
      <h2 style={cartStyles.pageTitle}>Revisa tu Carrito 🔱</h2>
      
      <div style={cartStyles.cartCard}>
        <div style={cartStyles.itemsList}>
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
          user={user}
          onVolver={onVolverAlMenu}
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
    <div style={cartStyles.cartItem}>
      <div style={cartStyles.itemInfo}>
        <h4 style={cartStyles.itemName}>{item.nombre}</h4>
        <p style={cartStyles.itemPrice}>${item.precio.toFixed(2)} c/u</p>
      </div>
      
      <div style={cartStyles.itemActions}>
        <div style={cartStyles.quantityControl}>
          <button 
            onClick={() => onUpdateQuantity(item.id, cantidad - 1)}
            disabled={cantidad <= 1}
            style={cantidad <= 1 ? cartStyles.qtyBtnDisabled : cartStyles.qtyBtn}
          >
            −
          </button>
          <span style={cartStyles.qtyValue}>{cantidad}</span>
          <button 
            onClick={() => onUpdateQuantity(item.id, cantidad + 1)}
            style={cartStyles.qtyBtn}
          >
            +
          </button>
        </div>

        <div style={cartStyles.itemTotal}>${(item.precio * cantidad).toFixed(2)}</div>

        <button 
          onClick={() => onRemove(item.id)}
          style={cartStyles.removeBtn}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function CartSummary({ total, onCheckout, user, onVolver }) {
  return (
    <div style={cartStyles.summaryCard}>
      <h3 style={cartStyles.summaryTitle}>Resumen</h3>
      
      <div style={cartStyles.summaryRow}>
        <span>Subtotal</span>
        <span>${total}</span>
      </div>
      <div style={cartStyles.summaryRow}>
        <span>Envío</span>
        <span style={{ color: '#34c759' }}>Gratis</span>
      </div>
      
      {!user && (
        <div style={cartStyles.promoBox}>
          <p style={cartStyles.promoText}>✨ ¿Eres cliente frecuente?</p>
          <button style={cartStyles.promoBtn}>
            Regístrate y obtén 10% OFF
          </button>
        </div>
      )}
      
      {user && (
        <div style={cartStyles.memberBadge}>
          🎉 10% de descuento para miembros
        </div>
      )}
      
      <div style={cartStyles.totalRow}>
        <span>Total</span>
        <span style={cartStyles.totalAmount}>${total}</span>
      </div>
      
      <button onClick={onCheckout} style={cartStyles.checkoutBtn}>
        Proceder al Pago
      </button>
      
      <button
        onClick={onVolver}
        style={cartStyles.backBtn}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(1, 64, 14, 0.05)';
          e.currentTarget.style.borderColor = '#FF8C42';
          e.currentTarget.style.color = '#FF8C42';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255, 179, 71, 0.3)';
          e.currentTarget.style.color = '#01400e';
        }}
      >
        🍽️ Seguir Comprando
      </button>
    </div>
  );
}

// ============================================
// ESTILOS CRISTAL ESMERILADO (GLASSMORPHISM)
// ============================================
const cartStyles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '1rem',
    width: '100%'
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: '#039921',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  cartCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 32,
    padding: '1.2rem',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)'
  },
  itemsList: {
    marginBottom: '1.5rem'
  },
  cartItem: {
    padding: '1rem 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
  },
  itemInfo: {
    marginBottom: '0.5rem'
  },
  itemName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: '#01400e'
  },
  itemPrice: {
    margin: '0.2rem 0 0',
    fontSize: '0.8rem',
    color: '#666'
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(0, 0, 0, 0.03)',
    padding: '0.2rem 0.2rem',
    borderRadius: 30
  },
  qtyBtn: {
    background: 'transparent',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: 16,
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#FF8C42',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyBtnDisabled: {
    background: 'transparent',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: 16,
    cursor: 'not-allowed',
    fontSize: '1.2rem',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyValue: {
    minWidth: 32,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  itemTotal: {
    fontWeight: '700',
    color: '#FF8C42',
    fontSize: '0.9rem',
    minWidth: '70px'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    opacity: 0.5,
    transition: 'opacity 0.2s ease',
    padding: '4px'
  },
  summaryCard: {
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    paddingTop: '1rem'
  },
  summaryTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#01400e'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    color: '#666'
  },
  promoBox: {
    background: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 20,
    padding: '0.8rem',
    margin: '1rem 0',
    textAlign: 'center'
  },
  promoText: {
    fontSize: '0.75rem',
    color: '#666',
    margin: '0 0 0.5rem 0'
  },
  promoBtn: {
    background: 'transparent',
    border: '1px solid #FF8C42',
    borderRadius: 30,
    padding: '0.3rem 0.8rem',
    fontSize: '0.7rem',
    color: '#FF8C42',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  memberBadge: {
    background: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 20,
    padding: '0.5rem',
    margin: '1rem 0',
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#01400e'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1rem 0',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#01400e',
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(255, 179, 71, 0.2)'
  },
  totalAmount: {
    color: '#FF8C42',
    fontSize: '1.2rem'
  },
  checkoutBtn: {
    width: '100%',
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #01400e 0%, #2a6b2f 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 40,
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '0.5rem'
  },
  backBtn: {
    width: '100%',
    padding: '0.8rem',
    background: 'transparent',
    border: '1px solid rgba(255, 179, 71, 0.3)',
    borderRadius: 40,
    fontWeight: '500',
    fontSize: '0.9rem',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  emptyContainer: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center'
  },
  emptyCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 32,
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.2rem',
    color: '#01400e',
    marginBottom: '0.5rem'
  },
  emptyText: {
    fontSize: '0.85rem',
    color: '#666'
  }
};

// Efectos hover
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .checkout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(1, 64, 14, 0.3);
  }
  
  .clear-btn:hover {
    border-color: #FF8C42;
    color: #FF8C42;
  }
  
  .promo-btn:hover {
    background: rgba(255, 140, 66, 0.1);
  }
  
  .remove-btn:hover {
    opacity: 1 !important;
    color: #ff3b30;
  }
    @keyframes brilloRojo {
  0% { text-shadow: 0 0 2px rgba(178,34,34,0.3); }
  100% { text-shadow: 0 0 12px rgba(178,34,34,0.8); }
}
@keyframes brilloVerde {
  0% { text-shadow: 0 0 2px rgba(26,59,26,0.3); }
  100% { text-shadow: 0 0 12px rgba(26,59,26,0.8); }
}
@keyframes brilloDorado {
  0% { text-shadow: 0 0 2px rgba(255,215,0,0.3); }
  100% { text-shadow: 0 0 12px rgba(255,215,0,0.8); }
}
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}