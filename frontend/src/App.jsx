import { useState, useEffect, useMemo } from 'react';
import { CartProvider, useCart } from './CartContext';
import WelcomeInicio from './WelcomeInicio';
import RegisterModal from './components/RegisterModal';
import HomePage from './pages/HomePage';
import LoginComercio from './pages/LoginComercio';
import AdminComercio from './pages/AdminComercio';
import RegistroComercio from './pages/RegistroComercio';
import uploadImageService from "./services/uploadImageService";
import { getMenuPublicado } from './services/menuService';

const DEMO_COMERCIOS = [
  { id: 1, nombre: "ONO TO ONE", direccion: "Calle Principal 123", descripcion: "Sabores únicos que conectan contigo.", imagen: 'https://pexels.com' },
  { id: 2, nombre: "Sabores del Origen", direccion: "Malecón de Ayangue, Santa Elena", descripcion: "Rescatamos las recetas ancestrales de la Costa.", imagen: 'https://pexels.com' },
  { id: 3, nombre: "Sierra y Fuego", direccion: "Calle de los Volcanes, Patate", descripcion: "Cocina de altura con productos de los Andes.", imagen: 'https://pexels.com' }
];

const DEFAULT_MENU_ITEMS = [
  { id: 1, nombre: 'Picoteo', opciones: [{ nombre: 'Alitas BBQ', precio: 8.50 }, { nombre: 'Patatas Bravas', precio: 5.50 }] },
  { id: 2, nombre: 'Postres', opciones: [{ nombre: 'Tarta de queso', precio: 5.00 }, { nombre: 'Brownie', precio: 5.50 }] },
  { id: 3, nombre: 'Bebidas', opciones: [{ nombre: 'Agua', precio: 1.50 }, { nombre: 'Cerveza', precio: 3.50 }] }
];

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
  const { itemCount } = useCart();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedComercio, setSelectedComercio] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [user, setUser] = useState(null); // Recuperado
  const [menuItems, setMenuItems] = useState([]);
  const [COMERCIOS, setComercios] = useLocalStorage('registros_comercios', DEMO_COMERCIOS);

  const isAdminMode = ['comercio-admin', 'admin'].includes(currentPage);
  const isTransition = ['comercio-login', 'registro-comercio'].includes(currentPage);

  useEffect(() => {
    if (selectedComercio) {
      const menu = getMenuPublicado(selectedComercio);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      {showWelcome ? (
        <WelcomeInicio
          onSelectCategory={(_, id) => { setSelectedComercio(id); setShowWelcome(false); setCurrentPage('home'); }}
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
                    🛒{itemCount > 0 && <span style={S.badge}>{itemCount}</span>}
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
            paddingTop: (!isAdminMode && !isTransition) ? '80px' : '0',
            minHeight: '100vh',
            overflow: isAdminMode ? 'hidden' : 'auto'
          }}>
            {currentPage === 'home' && <HomePage comercio={comercioActivo} menuItems={menuItems} onBack={handleBackToWelcome} />}
            {currentPage === 'comercio-login' && <LoginComercio onLogin={(id) => { setSelectedComercio(id); setCurrentPage('comercio-admin'); }} onBack={handleBackToWelcome} />}
            {currentPage === 'registro-comercio' && <RegistroComercio onRegistro={handleNuevoComercio} onBack={handleBackToWelcome} />}
            {currentPage === 'comercio-admin' && <AdminComercio comercioId={selectedComercio} onBack={handleBackToWelcome} />}
          </main>
        </>
      )}
    </div>
  );
}

const S = {
  header: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(20, 10, 10, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,215,0,0.15)', height: '60px', display: 'flex', alignItems: 'center' },
  headerContent: { width: '100%', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { background: 'transparent', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.1rem', color: '#FFD700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  logoIcon: { fontSize: '1.3rem' },
  logoText: { fontSize: '1rem', fontWeight: '700', background: 'linear-gradient(135deg, #FF4500, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  rightIcons: { display: 'flex', gap: '8px' },
  iconBtn: { background: 'transparent', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.1rem', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700' },
  badge: { position: 'absolute', top: -6, right: -6, background: '#FF4500', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white' },
};
