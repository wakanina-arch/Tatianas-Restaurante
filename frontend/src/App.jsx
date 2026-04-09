// ============================================
// HEADER SUPERIOR FLOTANTE CON TÍTULO CENTRAL
// ============================================

import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import { CartProvider, useCart } from './CartContext';
import PaymentModal from './PaymentModal';
import WelcomeInicio from './WelcomeInicio';
import RegisterModal from './components/RegisterModal';
import HomePage from './pages/HomePage';
import LoginComercio from './pages/LoginComercio';
import AdminComercio from './pages/AdminComercio';
import RegistroComercio from './pages/RegistroComercio';

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const STORAGE_KEYS = {
  PENDING: 'restaurante_pending',
  LOGS: 'restaurante_logs'
};

const DEFAULT_MENU_ITEMS = [
  {
    id: 1,
    nombre: 'Picoteo',
    opciones: [
      { nombre: 'Alitas BBQ', precio: 8.50, descripcion: 'Alitas glaseadas con salsa BBQ' },
      { nombre: 'Patatas Bravas', precio: 5.50, descripcion: 'Patatas con salsa brava' },
      { nombre: 'Nachos con queso', precio: 7.50, descripcion: 'Nachos con queso fundido' },
    ]
  },
  {
    id: 2,
    nombre: 'Entrantes',
    opciones: [
      { nombre: 'Croquetas de jamón', precio: 6.50, descripcion: 'Croquetas caseras de jamón' },
      { nombre: 'Calamares a la romana', precio: 8.00, descripcion: 'Calamares frescos rebozados' },
      { nombre: 'Gambas al ajillo', precio: 9.50, descripcion: 'Gambas salteadas con ajo' },
    ]
  },
  {
    id: 3,
    nombre: 'Gourmets',
    opciones: [
      { nombre: 'Solomillo al foie', precio: 24.00, descripcion: 'Solomillo con foie micuit' },
      { nombre: 'Carpaccio de res', precio: 16.00, descripcion: 'Carpaccio con parmesano' },
      { nombre: 'Vieiras gratinadas', precio: 18.00, descripcion: 'Vieiras con gratin de queso' },
    ]
  },
  {
    id: 4,
    nombre: 'Escuderos',
    opciones: [
      { nombre: 'Ensalada César', precio: 11.50, descripcion: 'Lechuga, pollo, crutones, parmesano' },
      { nombre: 'Ensalada Caprese', precio: 10.00, descripcion: 'Tomate, mozzarella, albahaca' },
      { nombre: 'Ensalada Waldorf', precio: 10.50, descripcion: 'Manzana, nueces, apio' },
    ]
  },
  {
    id: 5,
    nombre: 'Zombies',
    opciones: [
      { nombre: 'Pizza Carbonara', precio: 13.50, descripcion: 'Salsa carbonara, queso, bacon' },
      { nombre: 'Pizza Pepperoni', precio: 13.50, descripcion: 'Pepperoni, queso, salsa de tomate' },
      { nombre: 'Hamburguesa Monstruosa', precio: 15.00, descripcion: 'Doble carne, queso, bacon' },
    ]
  },
  {
    id: 6,
    nombre: 'FastFurious',
    opciones: [
      { nombre: 'Hamburguesa Clásica', precio: 10.00, descripcion: 'Carne, lechuga, tomate, cebolla' },
      { nombre: 'Perrito Caliente', precio: 6.00, descripcion: 'Salchicha, pan, salsas' },
      { nombre: 'Wrap de pollo', precio: 8.50, descripcion: 'Pollo, lechuga, salsa ranch' },
    ]
  },
  {
    id: 7,
    nombre: 'Postres',
    opciones: [
      { nombre: 'Tarta de queso', precio: 5.00, descripcion: 'Tarta de queso casera' },
      { nombre: 'Brownie con helado', precio: 5.50, descripcion: 'Brownie de chocolate con helado' },
      { nombre: 'Flan casero', precio: 4.00, descripcion: 'Flan tradicional con caramelo' },
    ]
  },
  {
    id: 8,
    nombre: 'Bebidas',
    opciones: [
      { nombre: 'Coca Cola', precio: 2.50, descripcion: 'Refresco de cola' },
      { nombre: 'Cerveza', precio: 3.50, descripcion: 'Cerveza rubia' },
      { nombre: 'Agua mineral', precio: 1.50, descripcion: 'Agua mineral' },
    ]
  },
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
      const current = localStorage.getItem(key);
      const next = JSON.stringify(storedValue);
      // Solo escribir si el valor realmente cambió (evita QuotaExceededError en loop)
      if (current !== next) {
        localStorage.setItem(key, next);
      }
    } catch (error) {
      // Si es QuotaExceeded, intentar limpiar claves huérfanas y reintentar
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        try {
          // Limpiar menús de comercios que ya no existen
          const registros = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
          const idsValidos = new Set(registros.map(r => String(r.id)));
          Object.keys(localStorage).forEach(k => {
            const match = k.match(/^menu_comercio_(.+)$/);
            if (match && match[1] !== 'default' && !idsValidos.has(match[1])) {
              localStorage.removeItem(k);
            }
          });
          localStorage.setItem(key, JSON.stringify(storedValue));
        } catch {
          console.warn(`localStorage lleno, no se pudo guardar "${key}"`);
        }
      }
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
  const [selectedComercioAdmin, setSelectedComercioAdmin] = useState(null);
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

  // Obtener clave de localStorage para el menú del comercio
  const getMenuKey = (comercioId) => `menu_comercio_${comercioId || 'default'}`;
  const [menuItemsRaw, setMenuItemsRaw] = useLocalStorage(getMenuKey(selectedComercio), DEFAULT_MENU_ITEMS);

  // Sincronizar nombres de categoría legacy (ej: "Aperturas" → "Entrantes")
  const CATEGORIAS_FIJAS = ['Picoteo', 'Entrantes', 'Gourmets', 'Escuderos', 'Zombies', 'FastFurious', 'Postres', 'Bebidas'];
  const menuItems = menuItemsRaw.map((item, idx) => {
    if (idx < CATEGORIAS_FIJAS.length && item.nombre !== CATEGORIAS_FIJAS[idx]) {
      return { ...item, nombre: CATEGORIAS_FIJAS[idx] };
    }
    return item;
  });
  const setMenuItems = (val) => {
    // Al guardar, también forzar nombres correctos
    const fixed = (typeof val === 'function' ? val(menuItemsRaw) : val).map((item, idx) => {
      if (idx < CATEGORIAS_FIJAS.length && item.nombre !== CATEGORIAS_FIJAS[idx]) {
        return { ...item, nombre: CATEGORIAS_FIJAS[idx] };
      }
      return item;
    });
    setMenuItemsRaw(fixed);
  };

  const [pendingOrders, setPendingOrders] = useLocalStorage(STORAGE_KEYS.PENDING, []);
  const [log, setLog] = useLocalStorage(STORAGE_KEYS.LOGS, []);
  const [finishedOrders, setFinishedOrders] = useState([]);
  const [payOpen, setPayOpen] = useState(false);

  const handleSaveMenu = (updatedMenu) => setMenuItems(updatedMenu);
  const addLog = (entry) => setLog((prev) => [...prev, { ...entry, timestamp: new Date().toISOString() }]);

  const handleSelectCategory = (categoryLabel, comercioId = null, volverAWelcome = false) => {
    if (volverAWelcome) {
      setShowWelcome(true);
      setSelectedCategory(null);
      setCurrentPage('home');
      return;
    }
    setSelectedCategory(categoryLabel);
    setSelectedComercio(comercioId);
    setShowWelcome(false);
    setCurrentPage('home');
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setSelectedCategory(null);
    setCurrentPage('home');
  };

  const handleRegister = (userData, modo) => {
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
      {currentPage === 'comercio-login' && (
        <LoginComercio
          onLogin={(id) => {
            setSelectedComercioAdmin(id);
            setSelectedComercio(id);
            setCurrentPage('comercio-admin');
          }}
          onBack={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'registro-comercio' && (
        <RegistroComercio
          onRegistro={(data) => console.log('Comercio registrado:', data)}
          onBack={() => setCurrentPage('home')}
          onIrAlPanel={(comercioId) => {
            setSelectedComercioAdmin(comercioId);
            setSelectedComercio(comercioId);
            setCurrentPage('comercio-admin');
          }}
        />
      )}

      {currentPage === 'comercio-admin' && selectedComercioAdmin && (
        <AdminComercio
          comercioId={selectedComercioAdmin}
          menuItems={menuItems}
          onSaveMenu={handleSaveMenu}
          onBack={() => {
            setCurrentPage('home');
            setSelectedComercioAdmin(null);
            setSelectedComercio(null);
            setShowWelcome(true);
          }}
        />
      )}

      {showWelcome ? (
        <WelcomeInicio
          onSelectCategory={handleSelectCategory}
          onAccesoComercio={() => setCurrentPage('comercio-login')}
        onRegistroComercio={() => setCurrentPage('registro-comercio')}
        currentPage={currentPage}
        />
      ) : (
        <>
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <button onClick={handleBackToWelcome} style={styles.backBtn}>←</button>
              <div style={styles.logoContainer} onClick={handleBackToWelcome}>
                <span style={styles.logoIcon}>🔱</span>
                <span style={styles.logoText}>ONE TO ONE</span>
              </div>
              <div style={styles.rightIcons}>
                <button onClick={() => setCurrentPage('carrito')} style={styles.iconBtn}>
                  🛒{itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
                </button>
                <button onClick={() => setPerfilAbierto(true)} style={styles.iconBtn}>
                  👤{user && <span style={styles.userDot} />}
                </button>
              </div>
            </div>
          </header>

          <RegisterModal
            open={perfilAbierto}
            onClose={() => setPerfilAbierto(false)}
            onRegister={handleRegister}
            modo="editar"
            usuario={user}
          />

          <main style={{ paddingTop: '100px', minHeight: 'calc(100vh - 100px)', width: '100%' }}>
            {currentPage === 'home' && (
              <HomePage
                comercio={COMERCIOS.find(c => c.id === selectedComercio) || (() => { try { const regs = JSON.parse(localStorage.getItem('registros_comercios') || '[]'); const r = regs.find(r => r.id === selectedComercio); return r ? { id: r.id, nombre: r.nombreComercio, imagen: r.logo } : null; } catch { return null; } })()}
                platillos={menuItems}
                user={user}
                itemCount={itemCount}
                onOpenMenu={() => setMenuAbierto(true)}
                onOpenPerfil={() => setPerfilAbierto(true)}
                onBackToWelcome={handleBackToWelcome}
                setCurrentPage={setCurrentPage}
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

// Estilos del header
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
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  logoIcon: { fontSize: '1.3rem' },
  logoText: {
    fontSize: '1rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #FF4500, #FFD700)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  rightIcons: { display: 'flex', alignItems: 'center', gap: '8px' },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.3rem',
    cursor: 'pointer',
    position: 'relative',
    padding: '8px',
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
// CARRITO - ESTILO CRISTAL ESMERILADO
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
          <button onClick={onVolverAlMenu} style={{ ...cartStyles.backBtn, marginTop: '1rem' }}>🍽️ Volver al Menú</button>
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
            <CartItem key={item.id} item={item} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
          ))}
        </div>
        <CartSummary total={total} onCheckout={() => setPayOpen(true)} user={user} onVolver={onVolverAlMenu} />
      </div>
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} total={total} addLog={addLog} setPendingOrders={setPendingOrders} />
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
          <button onClick={() => onUpdateQuantity(item.id, cantidad - 1)} disabled={cantidad <= 1} style={cantidad <= 1 ? cartStyles.qtyBtnDisabled : cartStyles.qtyBtn}>−</button>
          <span style={cartStyles.qtyValue}>{cantidad}</span>
          <button onClick={() => onUpdateQuantity(item.id, cantidad + 1)} style={cartStyles.qtyBtn}>+</button>
        </div>
        <div style={cartStyles.itemTotal}>${(item.precio * cantidad).toFixed(2)}</div>
        <button onClick={() => onRemove(item.id)} style={cartStyles.removeBtn}>🗑️</button>
      </div>
    </div>
  );
}

function CartSummary({ total, onCheckout, user, onVolver }) {
  return (
    <div style={cartStyles.summaryCard}>
      <h3 style={cartStyles.summaryTitle}>Resumen</h3>
      <div style={cartStyles.summaryRow}><span>Subtotal</span><span>${total}</span></div>
      <div style={cartStyles.summaryRow}><span>Envío</span><span style={{ color: '#34c759' }}>Gratis</span></div>
      {!user && (
        <div style={cartStyles.promoBox}>
          <p style={cartStyles.promoText}>✨ ¿Eres cliente frecuente?</p>
          <button style={cartStyles.promoBtn}>Regístrate y obtén 10% OFF</button>
        </div>
      )}
      {user && <div style={cartStyles.memberBadge}>🎉 10% de descuento para miembros</div>}
      <div style={cartStyles.totalRow}><span>Total</span><span style={cartStyles.totalAmount}>${total}</span></div>
      <button onClick={onCheckout} style={cartStyles.checkoutBtn}>Proceder al Pago</button>
      <button onClick={onVolver} style={cartStyles.backBtn}>🍽️ Seguir Comprando</button>
    </div>
  );
}

const cartStyles = {
  container: { maxWidth: 600, margin: '0 auto', padding: '1rem', width: '100%' },
  pageTitle: { fontSize: '1.6rem', fontWeight: '600', color: '#039921', marginBottom: '1.5rem', textAlign: 'center' },
  cartCard: { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: 32, padding: '1.2rem', border: '1px solid rgba(255,255,255,0.5)' },
  itemsList: { marginBottom: '1.5rem' },
  cartItem: { padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  itemInfo: { marginBottom: '0.5rem' },
  itemName: { margin: 0, fontSize: '1rem', fontWeight: '600', color: '#01400e' },
  itemPrice: { margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#666' },
  itemActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', padding: '0.2rem 0.2rem', borderRadius: 30 },
  qtyBtn: { background: 'transparent', border: 'none', width: 32, height: 32, borderRadius: 16, cursor: 'pointer', fontSize: '1.2rem', color: '#FF8C42' },
  qtyBtnDisabled: { background: 'transparent', border: 'none', width: 32, height: 32, borderRadius: 16, cursor: 'not-allowed', fontSize: '1.2rem', color: '#ccc' },
  qtyValue: { minWidth: 32, textAlign: 'center', fontWeight: '600', fontSize: '0.9rem' },
  itemTotal: { fontWeight: '700', color: '#FF8C42', fontSize: '0.9rem', minWidth: '70px' },
  removeBtn: { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', opacity: 0.5, padding: '4px' },
  summaryCard: { borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' },
  summaryTitle: { margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#01400e' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666' },
  promoBox: { background: 'rgba(255,215,0,0.08)', borderRadius: 20, padding: '0.8rem', margin: '1rem 0', textAlign: 'center' },
  promoText: { fontSize: '0.75rem', color: '#666', margin: '0 0 0.5rem 0' },
  promoBtn: { background: 'transparent', border: '1px solid #FF8C42', borderRadius: 30, padding: '0.3rem 0.8rem', fontSize: '0.7rem', color: '#FF8C42', fontWeight: '600', cursor: 'pointer' },
  memberBadge: { background: 'rgba(255,215,0,0.08)', borderRadius: 20, padding: '0.5rem', margin: '1rem 0', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#01400e' },
  totalRow: { display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontSize: '1.1rem', fontWeight: '700', color: '#01400e', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,179,71,0.2)' },
  totalAmount: { color: '#FF8C42', fontSize: '1.2rem' },
  checkoutBtn: { width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #01400e 0%, #2a6b2f 100%)', color: 'white', border: 'none', borderRadius: 40, fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '0.5rem' },
  backBtn: { width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,179,71,0.3)', borderRadius: 40, fontWeight: '500', fontSize: '0.9rem', color: '#666', cursor: 'pointer' },
  emptyCard: { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: 32, padding: '2rem', textAlign: 'center' },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.2rem', color: '#01400e', marginBottom: '0.5rem' },
  emptyText: { fontSize: '0.85rem', color: '#666' },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(1,64,14,0.3); }
  .promo-btn:hover { background: rgba(255,140,66,0.1); }
  .remove-btn:hover { opacity: 1 !important; color: #ff3b30; }
`;
if (typeof document !== 'undefined') document.head.appendChild(styleSheet);