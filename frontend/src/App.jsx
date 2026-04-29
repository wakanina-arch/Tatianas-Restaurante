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

// ========== CONTROL DE VERSIÓN ==========
const DATA_VERSION = "2.0.4";

// ========== DEFINICIÓN DE LAS 4 DEMOS ==========
const DEMO_COMERCIOS = [
  { 
    id: 1, 
    nombre: "ONE TO ONE", 
    direccion: "Calle Principal 123", 
    telefono: "600 000 000", 
    descripcion: "Cocina internacional con sabores únicos.", 
    imagen: '/casas/en_su_punto.JPG'   // ← Misma que Welcome
  },
  { 
    id: 2, 
    nombre: "Sabores del Origen", 
    direccion: "Malecón de Ayangue, Santa Elena", 
    telefono: "+593 988 555 111", 
    descripcion: "Rescatamos las recetas ancestrales de Manabí.", 
    imagen: '/casas/Ceremoniales.JPG'  // ← Misma que Welcome
  },
  { 
    id: 3, 
    nombre: "Sierra y Fuego", 
    direccion: "Calle de los Volcanes, Patate, Tungurahua", 
    telefono: "+593 988 555 222", 
    descripcion: "Cocina de altura con productos de los Andes.", 
    imagen: '/casas/Como_en_casa.JPG'  // ← Misma que Welcome
  },
  { 
    id: 4, 
    nombre: "Manglar y Mar", 
    direccion: "Comuna de Chanduy, Santa Elena", 
    telefono: "+593 988 555 333", 
    descripcion: "Del manglar a tu mesa.", 
    imagen: '/casas/Casa_Caramba.JPG'  // ← Misma que Welcome
  }
];

const DEFAULT_MENU_ITEMS = [
  { id: 1, nombre: 'Picoteo', opciones: [
    { nombre: 'Alitas BBQ', precio: 8.50 }, { nombre: 'Patatas Bravas', precio: 5.50 }, { nombre: 'Nachos con queso', precio: 7.50 }
  ]},
  { id: 2, nombre: 'Entrantes', opciones: [
    { nombre: 'Croquetas de jamón', precio: 6.50 }, { nombre: 'Calamares a la romana', precio: 8.00 }, { nombre: 'Gambas al ajillo', precio: 9.50 }
  ]},
  { id: 3, nombre: 'Gourmets', opciones: [
    { nombre: 'Solomillo al foie', precio: 24.00 }, { nombre: 'Carpaccio de res', precio: 16.00 }, { nombre: 'Vieiras gratinadas', precio: 18.00 }
  ]},
  { id: 4, nombre: 'Escuderos', opciones: [
    { nombre: 'Ensalada César', precio: 11.50 }, { nombre: 'Ensalada Caprese', precio: 10.00 }, { nombre: 'Ensalada Waldorf', precio: 10.50 }
  ]},
  { id: 5, nombre: 'Zombies', opciones: [
    { nombre: 'Pizza Carbonara', precio: 13.50 }, { nombre: 'Pizza Pepperoni', precio: 13.50 }, { nombre: 'Hamburguesa Monstruosa', precio: 15.00 }
  ]},
  { id: 6, nombre: 'FastFurious', opciones: [
    { nombre: 'Hamburguesa Clásica', precio: 10.00 }, { nombre: 'Perrito Caliente', precio: 6.00 }, { nombre: 'Wrap de pollo', precio: 8.50 }
  ]},
  { id: 7, nombre: 'Postres', opciones: [
    { nombre: 'Tarta de queso', precio: 5.00 }, { nombre: 'Brownie con helado', precio: 5.50 }, { nombre: 'Flan casero', precio: 4.00 }
  ]},
  { id: 8, nombre: 'Bebidas', opciones: [
    { nombre: 'Coca Cola', precio: 2.50 }, { nombre: 'Cerveza', precio: 3.50 }, { nombre: 'Agua mineral', precio: 1.50 }
  ]},
];

// ========== SINCRONIZACIÓN DE VERSIÓN ==========
function syncDataWithVersion() {
  const storedVersion = localStorage.getItem("app_data_version");
  if (storedVersion !== DATA_VERSION) {
    localStorage.removeItem("comercios");
    localStorage.removeItem("registros_comercios");
    localStorage.removeItem("menus");
    localStorage.removeItem("cart");
    
    localStorage.setItem("comercios", JSON.stringify(DEMO_COMERCIOS));
    localStorage.setItem("registros_comercios", JSON.stringify(DEMO_COMERCIOS));
    localStorage.setItem("app_data_version", DATA_VERSION);
  }
}
syncDataWithVersion();

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      const parsed = JSON.parse(item);
      return (Array.isArray(parsed) && parsed.length === 0) ? initialValue : parsed;
    } catch { return initialValue; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(storedValue)); } catch (e) { console.error(e); }
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
}

export default function App() {
  return <CartProvider><MainApp /></CartProvider>;
}

function MainApp() {
  const { itemCount, switchComercio } = useCart();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [COMERCIOS, setComercios] = useLocalStorage('registros_comercios', DEMO_COMERCIOS);
  
  // ✅ FORZAR LAS 4 DEMOS AL INICIAR (AHORA DENTRO DE MainApp)
  // FORZAR MENÚS PARA CADA DEMO
useEffect(() => {
  const demosIds = [1, 2, 3, 4];
  demosIds.forEach(id => {
    const menuKey = `menu_comercio_${id}`;
    if (!localStorage.getItem(menuKey)) {
      const menuInicial = getMenuPublicado(id);
      localStorage.setItem(menuKey, JSON.stringify(menuInicial));
      console.log(`📋 Menú inicializado para demo ${id}`);
    }
  });
}, []);
  
  // Handler para seleccionar comercio
  const handleSelectComercio = (categoria, id, nombreComercio) => {
    console.log("🔄 Seleccionando comercio:", id, nombreComercio);
    switchComercio(id);
    setSelectedComercio(id);
    setMenuItems(getMenuPublicado(id));
    setShowWelcome(false);
    setCurrentPage('home');
  };

  const isAdminMode = ['comercio-admin', 'admin', 'comercio-login', 'registro-comercio'].includes(currentPage);
  const isTransition = ['comercio-login', 'registro-comercio'].includes(currentPage);

  useEffect(() => {
    if (selectedComercio) {
      const menu = getMenuPublicado(selectedComercio);
      console.log("📋 Menú cargado para comercio", selectedComercio, ":", menu?.length || 0, "categorías");
      setMenuItems(menu && menu.length > 0 ? menu : DEFAULT_MENU_ITEMS);
    }
  }, [selectedComercio]);

  const comercioActivo = useMemo(() => {
    return COMERCIOS.find(c => String(c.id) === String(selectedComercio)) || null;
  }, [selectedComercio, COMERCIOS]);

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setCurrentPage('home');
    setSelectedComercio(null);
  };

  const handleNuevoComercio = async (datos) => {
    try {
      let logo = "/img/default-restaurante.png";
      if (datos.logo) {
        const res = await uploadImageService.subirImagen(datos.logo, Date.now());
        logo = res.url;
      }
      const nuevo = { id: Date.now(), nombre: datos.nombreComercio, imagen: logo, ...datos };
      setComercios(prev => [...prev, nuevo]);
      setSelectedComercio(nuevo.id);
      setShowWelcome(false);
      setCurrentPage('home');
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {showWelcome ? (
        <WelcomeInicio
          onSelectCategory={handleSelectComercio}
          onAccesoComercio={() => { setShowWelcome(false); setCurrentPage('comercio-login'); }}
          onRegistroComercio={() => { setShowWelcome(false); setCurrentPage('registro-comercio'); }}
        />
      ) : (
        <>
          {!isAdminMode && !isTransition && (
            <header style={S.header}>
              <div style={S.headerContent}>
                <button onClick={handleBackToWelcome} style={S.backBtn}>←</button>
                <div style={S.logoContainer} onClick={handleBackToWelcome}>
                  <span style={S.logoIcon}>🔱</span>
                  <span style={S.logoText}>ONE TO ONE</span>
                </div>
                <div style={S.rightIcons}>
                  <button onClick={() => setCurrentPage('carrito')} style={S.iconBtn}>
                    🛒
                    {itemCount > 0 && <span style={S.badge}>{itemCount}</span>}
                  </button>
                  <button onClick={() => setPerfilAbierto(true)} style={S.iconBtn}>👤</button>
                </div>
              </div>
            </header>
          )}

          <RegisterModal 
            open={perfilAbierto} 
            onClose={() => setPerfilAbierto(false)} 
            onRegister={(d, m) => { setUser(m === 'logout' ? null : d); setPerfilAbierto(false); }} 
          />

          <main style={{ 
            paddingTop: (!isAdminMode && !isTransition) ? '100px' : '0',
            minHeight: 'calc(100vh - 100px)',
            overflow: isAdminMode ? 'hidden' : 'auto'
          }}>
            {currentPage === 'home' && <HomePage comercio={comercioActivo} platillos={menuItems} user={user} itemCount={itemCount} onOpenPerfil={() => setPerfilAbierto(true)} onBackToWelcome={handleBackToWelcome} setCurrentPage={setCurrentPage} />}
            {currentPage === 'carrito' && <CartPage onVolverAlMenu={() => setCurrentPage('home')} onBackToWelcome={handleBackToWelcome} />}
            {currentPage === 'comercio-login' && <LoginComercio onLogin={(id) => { setSelectedComercio(id); setCurrentPage('comercio-admin'); }} onBack={handleBackToWelcome} />}
            {currentPage === 'registro-comercio' && <RegistroComercio onRegistro={handleNuevoComercio} onBack={handleBackToWelcome} />}
            {currentPage === 'comercio-admin' && <AdminComercio comercioId={selectedComercio} onBack={handleBackToWelcome} />}
            {currentPage === 'admin' && <AdminPage menuItems={menuItems} onSaveMenu={() => {}} log={[]} addLog={() => {}} pendingOrders={[]} setPendingOrders={() => {}} finishedOrders={[]} setFinishedOrders={() => {}} onBack={() => setCurrentPage('home')} />}
          </main>
        </>
      )}
    </div>
  );
}

function CartPage({ onVolverAlMenu, onBackToWelcome }) {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [payOpen, setPayOpen] = useState(false);

  const subtotal = cartItems.reduce((acc, i) => {
    const pBase = i.precioOriginal || i.precio;
    return acc + (pBase * (i.cantidad || 1));
  }, 0);

  const ahorro = cartItems.reduce((acc, i) => {
    if (i.enOferta) {
      const pBase = i.precioOriginal || i.precio;
      const descuentoPorUnidad = pBase * (i.descuentoAplicado / 100);
      return acc + (descuentoPorUnidad * (i.cantidad || 1));
    }
    return acc;
  }, 0);

  const totalFinal = (subtotal - ahorro).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div style={CS.emptyCard}>
        <div style={CS.emptyIcon}>🛒</div>
        <div style={CS.emptyTitle}>Carrito vacío</div>
        <div style={CS.emptyText}>Aún no has agregado nada</div>
        <button onClick={onVolverAlMenu} style={CS.backBtn}>🔱 Explorar menú</button>
      </div>
    );
  }

  return (
    <section style={CS.container}>
      <h2 style={CS.pageTitle}>Resumen de Compra</h2>
      <div style={CS.cartCard}>
        <div style={CS.itemsList}>
          {cartItems.map(item => {
            const pBase = item.precioOriginal || item.precio;
            const pFinal = item.precio;
            const tienePromo = item.enOferta && item.precioOriginal;

            return (
              <div key={item.id || item.nombre} style={CS.cartItem}>
                <div style={CS.itemInfo}>
                  <h4 style={CS.itemName}>{item.nombre}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {tienePromo ? (
                      <>
                        <span style={CS.itemPrice}>${pBase.toFixed(2)} c/u</span>
                        <span style={CS.promoBadge}>-{item.descuentoAplicado}% {item.tagPromo}</span>
                      </>
                    ) : (
                      <span style={CS.itemPrice}>${pFinal.toFixed(2)} c/u</span>
                    )}
                  </div>
                </div>
                <div style={CS.itemActions}>
                  <div style={CS.quantityControl}>
                    <button onClick={() => updateQuantity(item.id || item.nombre, (item.cantidad || 1) - 1)} disabled={(item.cantidad || 1) <= 1} style={CS.qtyBtn}>−</button>
                    <span style={CS.qtyValue}>{item.cantidad || 1}</span>
                    <button onClick={() => updateQuantity(item.id || item.nombre, (item.cantidad || 1) + 1)} style={CS.qtyBtn}>+</button>
                  </div>
                  <span style={CS.itemTotal}>${(pFinal * (item.cantidad || 1)).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id || item.nombre)} style={CS.removeBtn}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={CS.summaryCard}>
          <div style={CS.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div style={CS.ahorroRow}><span>Ahorro Total</span><span>-${ahorro.toFixed(2)}</span></div>
          <div style={CS.totalRow}><span>TOTAL</span><span style={CS.totalAmount}>${totalFinal}</span></div>
          <button onClick={() => setPayOpen(true)} style={CS.checkoutBtn}>PAGAR</button>
          <button onClick={onVolverAlMenu} style={CS.backBtn}>🔱 Seguir Comprando</button>
        </div>
      </div>
      <PaymentModal 
        open={payOpen} 
        onClose={() => setPayOpen(false)} 
        total={parseFloat(totalFinal)} 
        onBackToWelcome={onBackToWelcome}
        addLog={() => {}} 
        setPendingOrders={() => {}} 
      />
    </section>
  );
}

// ========== ESTILOS DEL HEADER ==========
const S = {
  header: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(20, 10, 10, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,215,0,0.15)', height: '60px', display: 'flex', alignItems: 'center' },
  headerContent: { width: '100%', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { background: 'transparent', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.1rem', color: '#FFD700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  logoIcon: { fontSize: '1.3rem' },
  logoText: { fontSize: '1rem', fontWeight: '700', background: 'linear-gradient(135deg, #FF4500, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  rightIcons: { display: 'flex', gap: '8px' },
  iconBtn: { background: 'transparent', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.3rem', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -6, right: -6, background: '#FF4500', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

// ========== ESTILOS DEL CARRITO ==========
const CS = {
  container: { maxWidth: 600, margin: '0 auto', padding: '1rem' },
  pageTitle: { fontSize: '1.6rem', fontWeight: '600', color: '#039921', textAlign: 'center', marginBottom: '1rem' },
  cartCard: { background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: 32, padding: '1.2rem' },
  itemsList: { marginBottom: '1rem' },
  emptyCard: { textAlign: 'center', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '24px', maxWidth: '280px', margin: '2rem auto', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' },
  emptyIcon: { fontSize: '2rem', display: 'block', marginBottom: '0.75rem', opacity: 0.7 },
  emptyTitle: { fontSize: '1rem', fontWeight: '600', color: '#01400e', marginBottom: '0.5rem' },
  emptyText: { fontSize: '0.8rem', color: '#666', marginBottom: '1.25rem' },
  cartItem: { padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  itemInfo: { marginBottom: '4px' },
  itemName: { fontSize: '0.9rem', fontWeight: '600', color: '#01400e' },
  itemPrice: { fontSize: '0.85rem', fontWeight: '600', color: '#333' },
  promoBadge: { fontSize: '0.65rem', color: '#8a2be2', fontWeight: '600', background: 'rgba(138, 43, 226, 0.05)', padding: '2px 6px', borderRadius: '4px' },
  itemActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' },
  quantityControl: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: 30, padding: '2px' },
  qtyBtn: { background: 'transparent', border: 'none', width: 28, height: 28, fontSize: '1.1rem', color: '#FF8C42', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyValue: { minWidth: 20, textAlign: 'center', fontWeight: '600', fontSize: '0.9rem' },
  itemTotal: { fontWeight: '700', fontSize: '0.95rem', color: '#01400e', minWidth: '60px', textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', opacity: 0.5, padding: '4px' },
  summaryCard: { marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid rgba(0,0,0,0.05)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666', fontSize: '0.95rem' },
  ahorroRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#00a86b', fontWeight: '600', fontSize: '0.95rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontSize: '1.2rem', fontWeight: '700', color: '#01400e' },
  totalAmount: { color: '#FF8C42', fontSize: '1.3rem' },
  checkoutBtn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #01400e, #2a6b2f)', color: 'white', border: 'none', borderRadius: 40, fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '1.5rem' },
  backBtn: { width: '100%', padding: '0.4rem', background: 'transparent', border: '4px solid rgba(239, 162, 54, 0.3)', borderRadius: 40, color: '#666', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.95rem' }
};