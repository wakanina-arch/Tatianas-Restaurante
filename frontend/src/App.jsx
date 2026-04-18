// ============================================
// HEADER SUPERIOR FLOTANTE CON TÍTULO CENTRAL
// ============================================

import { useState, useEffect, useMemo } from 'react';
import AdminPage from './AdminPage';
import { CartProvider, useCart } from './CartContext';
import PaymentModal from './PaymentModal';
import WelcomeInicio from './WelcomeInicio';
import RegisterModal from './components/RegisterModal';
import HomePage from './pages/HomePage';
import LoginComercio from './pages/LoginComercio';
import AdminComercio from './pages/AdminComercio';
import RegistroComercio from './pages/RegistroComercio';
import uploadImageService from "./services/uploadImageService";
import { getMenuPublicado } from './services/menuService';

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const DEFAULT_MENU_ITEMS = [
  { id: 1, nombre: 'Picoteo', opciones: [
    { nombre: 'Alitas BBQ', precio: 8.50, descripcion: 'Alitas glaseadas con salsa BBQ' },
    { nombre: 'Patatas Bravas', precio: 5.50, descripcion: 'Patatas con salsa brava' },
    { nombre: 'Nachos con queso', precio: 7.50, descripcion: 'Nachos con queso fundido' },
  ]},
  { id: 2, nombre: 'Entrantes', opciones: [
    { nombre: 'Croquetas de jamón', precio: 6.50, descripcion: 'Croquetas caseras de jamón' },
    { nombre: 'Calamares a la romana', precio: 8.00, descripcion: 'Calamares frescos rebozados' },
    { nombre: 'Gambas al ajillo', precio: 9.50, descripcion: 'Gambas salteadas con ajo' },
  ]},
  { id: 3, nombre: 'Gourmets', opciones: [
    { nombre: 'Solomillo al foie', precio: 24.00, descripcion: 'Solomillo con foie micuit' },
    { nombre: 'Carpaccio de res', precio: 16.00, descripcion: 'Carpaccio con parmesano' },
    { nombre: 'Vieiras gratinadas', precio: 18.00, descripcion: 'Vieiras con gratin de queso' },
  ]},
  { id: 4, nombre: 'Escuderos', opciones: [
    { nombre: 'Ensalada César', precio: 11.50, descripcion: 'Lechuga, pollo, crutones, parmesano' },
    { nombre: 'Ensalada Caprese', precio: 10.00, descripcion: 'Tomate, mozzarella, albahaca' },
    { nombre: 'Ensalada Waldorf', precio: 10.50, descripcion: 'Manzana, nueces, apio' },
  ]},
  { id: 5, nombre: 'Zombies', opciones: [
    { nombre: 'Pizza Carbonara', precio: 13.50, descripcion: 'Salsa carbonara, queso, bacon' },
    { nombre: 'Pizza Pepperoni', precio: 13.50, descripcion: 'Pepperoni, queso, salsa de tomate' },
    { nombre: 'Hamburguesa Monstruosa', precio: 15.00, descripcion: 'Doble carne, queso, bacon' },
  ]},
  { id: 6, nombre: 'FastFurious', opciones: [
    { nombre: 'Hamburguesa Clásica', precio: 10.00, descripcion: 'Carne, lechuga, tomate, cebolla' },
    { nombre: 'Perrito Caliente', precio: 6.00, descripcion: 'Salchicha, pan, salsas' },
    { nombre: 'Wrap de pollo', precio: 8.50, descripcion: 'Pollo, lechuga, salsa ranch' },
  ]},
  { id: 7, nombre: 'Postres', opciones: [
    { nombre: 'Tarta de queso', precio: 5.00, descripcion: 'Tarta de queso casera' },
    { nombre: 'Brownie con helado', precio: 5.50, descripcion: 'Brownie de chocolate con helado' },
    { nombre: 'Flan casero', precio: 4.00, descripcion: 'Flan tradicional con caramelo' },
  ]},
  { id: 8, nombre: 'Bebidas', opciones: [
    { nombre: 'Coca Cola', precio: 2.50, descripcion: 'Refresco de cola' },
    { nombre: 'Cerveza', precio: 3.50, descripcion: 'Cerveza rubia' },
    { nombre: 'Agua mineral', precio: 1.50, descripcion: 'Agua mineral' },
  ]},
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
  const [selectedComercioAdmin, setSelectedComercioAdmin] = useState(null);
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [COMERCIOS, setComerciosRegistrados] = useLocalStorage('registros_comercios', [
    { id: 1, nombre: "En su punto", imagen: "/casas/en_su_punto.JPG" },
    { id: 2, nombre: "Ceremoniales", imagen: "/casas/Ceremoniales.JPG" },
    { id: 3, nombre: "Como en casa", imagen: "/casas/Como_en_casa.JPG" },
    { id: 4, nombre: "Gusto", imagen: "/casas/IMG_4552.JPG" },
    { id: 5, nombre: "Candela Obscura", imagen: "/casas/IMG_4555.JPG" },
    { id: 6, nombre: "Kattapa", imagen: "/casas/Kattapa.JPG" },
    { id: 7, nombre: "Llap Grill", imagen: "/casas/Llap_Grill.JPG" },
    { id: 8, nombre: "Pollo a la leña", imagen: "/casas/Pollo_a_la_leña.JPG" },
    { id: 9, nombre: "Tradicional", imagen: "/casas/Tradicional.JPG" },
  ]);

  const comercioActivo = useMemo(() => {
    if (!selectedComercio) return null;
    
    // Buscar en COMERCIOS
    const fijo = COMERCIOS.find(c => c.id === Number(selectedComercio) || c.id === selectedComercio);
    if (fijo) return fijo;
    
    // Buscar en localStorage
    try {
      const registrados = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
      const registrado = registrados.find(c => c.id === Number(selectedComercio) || c.id === selectedComercio);
      if (registrado) {
        return {
          ...registrado,
          imagen: registrado.imagen || registrado.logo,
          logo: registrado.logo || registrado.imagen
        };
      }
    } catch (e) {
      console.error("Error leyendo localStorage:", e);
    }
    
    return null;
  }, [selectedComercio, COMERCIOS]);

  useEffect(() => {
  if (selectedComercio) {
    const menuPublicado = getMenuPublicado(selectedComercio);
    setMenuItems(menuPublicado);
  }
}, [selectedComercio]);

  const handleSaveMenu = (newMenu) => {
    setMenuItems(newMenu);
    if (selectedComercio) {
      localStorage.setItem(`menu_comercio_${selectedComercio}`, JSON.stringify(newMenu));
    }
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setCurrentPage('home');
  };

  const handleNuevoComercio = async (datosFormulario) => {
    try {
      let urlLogoFinal = "/img/default-restaurante.png";
      if (datosFormulario.logo) {
        const resultadoSubida = await uploadImageService.subirImagen(datosFormulario.logo, datosFormulario.comercioId || 'nuevo');
        urlLogoFinal = resultadoSubida.url;
      }
      const idUnico = Date.now();
      const nuevoRegistro = {
        id: idUnico,
        nombre: datosFormulario.nombreComercio,
        imagen: urlLogoFinal,
        comercioId: datosFormulario.comercioId || idUnico,
        ...datosFormulario
      };
      const listaActualizada = [...COMERCIOS, nuevoRegistro];
    setComerciosRegistrados(listaActualizada);
      setComerciosRegistrados([...COMERCIOS, nuevoRegistro]);
      localStorage.setItem(`menu_comercio_${idUnico}`, JSON.stringify(DEFAULT_MENU_ITEMS));
    
    setSelectedComercio(idUnico);
    setShowWelcome(false);
    setCurrentPage('home');

  } catch (error) {
    console.error(error);
  }
};
// En App.jsx, justo antes del return
console.log("📊 ESTADO ACTUAL:");
console.log("  - currentPage:", currentPage);
console.log("  - showWelcome:", showWelcome);
console.log("  - selectedComercio:", selectedComercio);
console.log("  - comercioActivo:", comercioActivo);
console.log("  - menuItems:", menuItems?.length, "categorías");
console.log("  - COMERCIOS:", COMERCIOS?.length, "comercios");
  // ============================================
  // RENDERIZADO PRINCIPAL
  // ============================================
  return (
  <div style={{ 
    height: '100vh', 
    overflow: currentPage === 'comercio-admin' || currentPage === 'admin' ? 'hidden' : 'auto',
    position: 'relative' 
  }}>
      {currentPage === 'comercio-login' && (
        <LoginComercio
          onLogin={(id) => {
            setSelectedComercioAdmin(id);
            setCurrentPage('comercio-admin');
          }}
          onBack={() => {
            setShowWelcome(true);
            setCurrentPage('home');
          }}
        />
      )}

      {currentPage === 'registro-comercio' && (
        <RegistroComercio
          onRegistro={handleNuevoComercio}
          onBack={() => {
            setShowWelcome(true);
            setCurrentPage('home');
          }}
        />
      )}

      {currentPage === 'comercio-admin' && selectedComercioAdmin && (
        <AdminComercio
          comercioId={selectedComercioAdmin}
          onBack={() => {
            setShowWelcome(true);
            setCurrentPage('home');
          }}
        />
      )}

      {showWelcome ? (
        <WelcomeInicio
          onSelectCategory={(cat, id) => {
  setSelectedComercio(id);
  const menuPublicado = getMenuPublicado(id);
  setMenuItems(menuPublicado);
  setShowWelcome(false);
  setCurrentPage('home');
}}
          onAccesoComercio={() => {
            setShowWelcome(false);
            setCurrentPage('comercio-login');
          }}
          onRegistroComercio={() => {
            setShowWelcome(false);
            setCurrentPage('registro-comercio');
          }}
        />
      ) : (
  <>
    {/* HEADER PÚBLICO - Solo visible en páginas de cliente (home, carrito) */}
    {!['comercio-admin', 'admin', 'comercio-login', 'registro-comercio'].includes(currentPage) && (
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
            <button onClick={() => setPerfilAbierto(true)} style={styles.iconBtn}>👤</button>
          </div>
        </div>
      </header>
    )}

    <RegisterModal
      open={perfilAbierto}
      onClose={() => setPerfilAbierto(false)}
      onRegister={(userData, modo) => {
        if (modo === 'logout') setUser(null);
        else setUser(userData);
        setPerfilAbierto(false);
      }}
      modo="editar"
      usuario={user}
    />

    {/* El main se ajusta dinámicamente: con padding solo si hay header público */}
    <main style={{ 
      paddingTop: !['comercio-admin', 'admin', 'comercio-login', 'registro-comercio'].includes(currentPage) ? '100px' : '0',
      minHeight: 'calc(100vh - 100px)' 
    }}>
      {currentPage === 'home' && (
        <HomePage
          comercio={comercioActivo}
          platillos={menuItems}
          user={user}
          itemCount={itemCount}
          onOpenPerfil={() => setPerfilAbierto(true)}
          onBackToWelcome={handleBackToWelcome}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'carrito' && (
        <CartPage
          addLog={() => {}}
          setPendingOrders={() => {}}
          user={user}
          onVolverAlMenu={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'admin' && (
        <AdminPage
          menuItems={menuItems}
          onSaveMenu={handleSaveMenu}
          log={[]}
          addLog={() => {}}
          pendingOrders={[]}
          setPendingOrders={() => {}}
          finishedOrders={[]}
          setFinishedOrders={() => {}}
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
// ESTILOS DEL HEADER
// ============================================
const styles = {
  header: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(20, 10, 10, 0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,215,0,0.15)', height: '60px', display: 'flex', alignItems: 'center' },
  headerContent: { width: '100%', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#FFD700', padding: '8px' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  logoIcon: { fontSize: '1.3rem' },
  logoText: { fontSize: '1rem', fontWeight: '700', background: 'linear-gradient(135deg, #FF4500, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  rightIcons: { display: 'flex', alignItems: 'center', gap: '8px' },
  iconBtn: { background: 'transparent', border: 'none', fontSize: '1.3rem', cursor: 'pointer', position: 'relative', padding: '8px' },
  badge: { position: 'absolute', top: -6, right: -6, background: '#FF4500', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

// ============================================
// CARRITO - COMPONENTES INTERNOS
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
          <p style={cartStyles.emptyText}>Tu carrito está vacío.</p>
          <button onClick={onVolverAlMenu} style={cartStyles.backBtn}>🍽️ Volver al Menú</button>
        </div>
      </section>
    );
  }

  return (
    <section style={cartStyles.container}>
      <h2 style={cartStyles.pageTitle}>Revisa tu Compra 🔱</h2>
      <div style={cartStyles.cartCard}>
        <div style={cartStyles.itemsList}>
          {cartItems.map(item => (
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
      <div style={cartStyles.totalRow}><span>Total</span><span style={cartStyles.totalAmount}>${total}</span></div>
      <button onClick={onCheckout} style={cartStyles.checkoutBtn}>Proceder al Pago</button>
      <button onClick={onVolver} style={cartStyles.backBtn}>🔱 Seguir Comprando</button>
    </div>
  );
}

const cartStyles = {
  container: { maxWidth: 600, margin: '0 auto', padding: '1rem' },
  pageTitle: { fontSize: '1.6rem', fontWeight: '600', color: '#039921', textAlign: 'center' },
  cartCard: { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: 32, padding: '1.2rem' },
  itemsList: { marginBottom: '1.5rem' },
  cartItem: { padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  itemInfo: { marginBottom: '0.5rem' },
  itemName: { margin: 0, fontSize: '1rem', fontWeight: '600', color: '#01400e' },
  itemPrice: { margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#666' },
  itemActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', padding: '0.2rem', borderRadius: 30 },
  qtyBtn: { background: 'transparent', border: 'none', width: 32, height: 32, borderRadius: 16, cursor: 'pointer', fontSize: '1.2rem', color: '#FF8C42' },
  qtyBtnDisabled: { background: 'transparent', border: 'none', width: 32, height: 32, borderRadius: 16, fontSize: '1.2rem', color: '#ccc' },
  qtyValue: { minWidth: 32, textAlign: 'center', fontWeight: '600' },
  itemTotal: { fontWeight: '700', color: '#FF8C42' },
  removeBtn: { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', opacity: 0.5 },
  summaryCard: { borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' },
  summaryTitle: { fontSize: '1rem', fontWeight: '600', color: '#01400e' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' },
  totalRow: { display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontSize: '1.1rem', fontWeight: '700' },
  totalAmount: { color: '#FF8C42', fontSize: '1.2rem' },
  checkoutBtn: { width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #01400e 0%, #2a6b2f 100%)', color: 'white', border: 'none', borderRadius: 40, fontWeight: '600', cursor: 'pointer', marginBottom: '0.5rem' },
  backBtn: { width: '100%', padding: '0.8rem', background: 'transparent', border: '1px solid rgba(255,179,71,0.3)', borderRadius: 40, color: '#666', cursor: 'pointer' },
  emptyCard: { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: 32, padding: '2rem', textAlign: 'center' },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.2rem', color: '#01400e' },
  emptyText: { fontSize: '0.85rem', color: '#666' },
};