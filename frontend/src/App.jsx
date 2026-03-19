// ============================================
// HEADER SUPERIOR FLOTANTE CON TÍTULO CENTRAL
// ============================================

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
    nombre: 'Pizzas',
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

  const handleSelectCategory = (categoryLabel, volverAWelcome = false) => {
    console.log('🎭 Orden recibida para:', categoryLabel);
    
    if (volverAWelcome) {
      setShowWelcome(true);
      setSelectedCategory(null);
      setCurrentPage('home');
      return;
    }
    
    // Si no es para volver, abrimos el salón con la categoría elegida
    setSelectedCategory(categoryLabel); 
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
            }}
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
                platillos={itemsToShow.filter(item => {
                  // Si no hay nada seleccionado, muestra todos
                  if (!selectedCategory) return true;

                  // LIMPIEZA DE CABLEADO:
                  const nombrePlato = (item.nombre || "").toLowerCase().trim().replace(/s$/, '');
                  const nombreBoton = selectedCategory.toLowerCase().trim().replace(/s$/, '');

                  return nombrePlato === nombreBoton;
                })}
              />
            )}

            {currentPage === 'carrito' && (
              <CartPage 
                addLog={addLog} 
                setPendingOrders={setPendingOrders}
                user={user}
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
// HEADER SUPERIOR FLOTANTE - FRANJA COMPLETA
// ============================================
function NavBar({ currentPage, setCurrentPage, itemCount, onOpenMenu, onOpenPerfil, user }) {
  console.log('🔵 NavBar - onOpenPerfil es una función:', typeof onOpenPerfil === 'function');
  console.log('🔵 NavBar - user existe:', !!user);
  
  return (
    <header style={{
      position: 'fixed',
      top: 20,
      left: 0,
      right: 0,
      width: 'auto',
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: 1200,
        padding: '0.1rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 auto'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '80px', flexShrink: 0 }}>
          <button
            onClick={onOpenMenu} 
            style={{  
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}  
          >
            <div style={{ width: 20, height: 2, background: 'var(--verde-selva)', borderRadius: 2 }} />
            <div style={{ width: 16, height: 2, background: 'var(--maracuya)', borderRadius: 2 }} />
            <div style={{ width: 20, height: 2, background: 'var(--morado-primario)', borderRadius: 2 }} />
          </button>
        </div>
{/* =====ACCIONES PARA EL LOGO ===== */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: window.innerWidth < 480 ? '6px' : '13px',  // 👈 MENOS GAP EN MÓVIL
  cursor: 'pointer',
  padding: window.innerWidth < 480 ? '0.1rem 0.5rem' : '0.2rem 1.5rem',  // 👈 MENOS PADDING
  borderRadius: 40,
  transition: 'background 0.2s ease',
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
  whiteSpace: 'nowrap',
  flex: '0 1 auto',
  maxWidth: window.innerWidth < 480 ? '50%' : '60%',  // 👈 MÁS ESTRECHO EN MÓVIL
  overflow: 'hidden',  // 👈 EVITA DESBORDES
  textOverflow: 'ellipsis'
}}
        onClick={() => setCurrentPage('home')}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{
            fontSize: '1.4rem',
            filter: 'drop-shadow(0 2px 4px rgba(1, 64, 14, 0.2))',
            animation: 'brilloMistico 3s infinite alternate',
            position: 'relative',
            zIndex: 2
          }}>
            🔱
            <span style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '30px',
              height: '30px',
              background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: -1,
              animation: 'pulso 2s infinite'
            }} />
          </span>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
            position: 'relative'
          }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #0a1f0a 0%, #1a3b1a 50%, #2d4f2a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
              textShadow: '0 0 2px rgba(2, 30, 1, 0.8), 0 0 15px rgba(255, 215, 0, 0.3)',
              animation: 'brilloTexto 2.5s infinite alternate',
            }}>
              ONE TO ONE
            </span> 
          </div>
        </div>
{/* ===== DERECHA - ACCIONES ===== */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'right',
          gap: 2,
          width: '800px',
          flexShrink: 0,
          paddingRight: '1px',  // 👈 PADDING PARA RESPIRAR
          minWidth: '80px' 
        }}>
          <NavButton 
            page="carrito" 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
          >
            <span style={{ fontSize: '1.1rem', opacity: 1 }}>🛒</span>
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -3,
                right: -3,
                background: '#ff3b30',
                color: 'white',
                width: 16,
                height: 16,
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
          >
            👤
            {user && (
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                background: '#34c759',
                borderRadius: '50%',
                border: '2px solid white'
              }} />
            )}
          </button>

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
              color: '#8e8e93',
              transition: 'all 0.2s ease'
            }}
          >
            DSH
          </button>
        </div>
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
// COMPONENTES DE PÁGINA
// ============================================
function HomePage({ platillos }) {
  const { addToCart } = useCart();
  
  return (
    <section className="home-page" style={{
      padding: '1rem',
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        justifyContent: 'center'
      }}>
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
      <span style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        color: '#1a1a1a',
        padding: '0.2rem 0.8rem',
        borderRadius: 30,
        fontSize: '0.8rem',
        fontWeight: '700',
        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
        display: 'inline-block',
        marginLeft: '0.5rem'
      }}>
        🏷️ {item.tagPromo || 'Oferta'} -{item.descuentoAplicado || 0}%
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'transparent',
      marginBottom: '1rem'
    }}>
      {/* Carrusel cuadrado - 320px */}
      <div style={{
        width: '100%',
        maxWidth: 320,
        aspectRatio: '1/1',
        margin: '0 auto 20px auto',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        borderRadius: 24,
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
      }}>
        {item.imagenes && item.imagenes[0] ? (
          <img 
            src={item.imagenes[0]} 
            alt={item.nombre}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: 'white',
            fontSize: '2rem'
          }}>
            🔱 {item.nombre}
          </div>
        )}
      </div>

      {/* Galleta informativa - Versión Minimalista */}
      <div style={{
        width: '92%',
        maxWidth: 400,
        margin: '8px auto 0',
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 24,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        position: 'relative',
        zIndex: 10,
        maxHeight: '400px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--verde-selva) rgba(0, 0, 0, 0.02)'
      }}>
        
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--verde-selva)',
            margin: '0 0 0.3rem 0',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.3rem'
          }}>
            {item.nombre}
            <OfertaBadge />
          </h2>
        </div>
        
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--gris-texto)',
          lineHeight: 1.5,
          margin: 0,
          fontStyle: 'italic',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          maxHeight: '60px',
          overflowY: 'auto',
          paddingRight: '4px',
          opacity: 0.9
        }}>
          {description}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          margin: '0.3rem 0',
          maxHeight: '180px',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {item.opciones?.map((opt, idx) => {
            const tieneOferta = item.enOferta && opt.precioOriginal;
            const precioOriginal = tieneOferta ? opt.precioOriginal : null;
            const precioActual = opt.precio || 0;
            
            return (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '0.4rem 0.8rem',
                  background: selectedOption === opt.nombre ? 'rgba(255, 215, 0, 0.08)' : 'rgba(0, 0, 0, 0.01)',
                  borderRadius: 14,
                  border: selectedOption === opt.nombre 
                    ? '1px solid var(--maracuya)' 
                    : '1px solid rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <input 
                    type="checkbox"
                    checked={selectedOption === opt.nombre}
                    onChange={() => setSelectedOption(selectedOption === opt.nombre ? null : opt.nombre)}
                    style={{
                      width: 16,
                      height: 16,
                      marginTop: '2px',
                      cursor: 'pointer',
                      accentColor: 'var(--maracuya)'
                    }}
                  />
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: 'var(--gris-texto)',
                    lineHeight: '1.4',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    {opt.nombre}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {tieneOferta && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#999',
                      textDecoration: 'line-through'
                    }}>
                      ${precioOriginal.toFixed(2)}
                    </span>
                  )}
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: 'var(--maracuya)',
                    whiteSpace: 'nowrap'
                  }}>
                    ${precioActual.toFixed(2)}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          background: 'rgba(255, 215, 0, 0.03)',
          padding: '0.4rem',
          borderRadius: 16,
          border: '1px solid rgba(255, 215, 0, 0.05)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>🥗</span>
            <span style={{ fontWeight: '500', color: 'var(--verde-selva)' }}>{nutrition.calorias}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>🥩</span>
            <span style={{ fontWeight: '500', color: 'var(--verde-selva)' }}>{nutrition.proteina}</span>g
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>🍚</span>
            <span style={{ fontWeight: '500', color: 'var(--verde-selva)' }}>{nutrition.carbohidratos}</span>g
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.6rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {selectedOption && selectedData && item.enOferta && selectedData.precioOriginal && (
              <span style={{
                fontSize: '0.8rem',
                color: '#999',
                textDecoration: 'line-through'
              }}>
                ${selectedData.precioOriginal.toFixed(2)}
              </span>
            )}
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--maracuya)',
              lineHeight: 1
            }}>
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          <button 
            style={{
              background: !selectedOption 
                ? 'rgba(0, 0, 0, 0.05)' 
                : 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
              color: !selectedOption ? '#999' : 'var(--verde-selva)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 25,
              fontWeight: '500',
              fontSize: '0.85rem',
              cursor: !selectedOption ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: !selectedOption ? 'none' : '0 4px 10px rgba(255, 215, 0, 0.2)'
            }}
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

function CartPage({ addLog, setPendingOrders, user }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart();
  const [payOpen, setPayOpen] = useState(false);
  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <section className="cart-page" style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--verde-selva)', marginBottom: '1rem' }}>
          Tu Carrito
        </h2>
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 48,
          padding: '3rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--gris-texto)' }}>
            Tu carrito está vacío. ¡Agrega platos deliciosos! 🛒
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page" style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: '1rem'
    }}>
      <h2 style={{ fontSize: '1.8rem', color: 'var(--verde-selva)', marginBottom: '1.5rem' }}>
        Tu Carrito 🛒
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '1.5rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 32,
          padding: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
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
          user={user}
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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ flex: 2 }}>
        <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', color: 'var(--verde-selva)' }}>
          {item.nombre}
        </h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gris-texto)' }}>
          ${item.precio.toFixed(2)} c/u
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        background: 'rgba(0, 0, 0, 0.02)',
        padding: '0.3rem',
        borderRadius: 30
      }}>
        <button 
          onClick={() => onUpdateQuantity(item.id, cantidad - 1)}
          disabled={cantidad <= 1}
          style={{
            background: 'transparent',
            border: 'none',
            width: 30,
            height: 30,
            borderRadius: 15,
            cursor: cantidad <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '1.2rem',
            color: cantidad <= 1 ? '#ccc' : 'var(--maracuya)'
          }}
        >
          −
        </button>
        <span style={{ minWidth: 30, textAlign: 'center', fontWeight: '600' }}>
          {cantidad}
        </span>
        <button 
          onClick={() => onUpdateQuantity(item.id, cantidad + 1)}
          style={{
            background: 'transparent',
            border: 'none',
            width: 30,
            height: 30,
            borderRadius: 15,
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: 'var(--maracuya)'
          }}
        >
          +
        </button>
      </div>

      <div style={{ fontWeight: '700', color: 'var(--maracuya)' }}>
        ${(item.precio * cantidad).toFixed(2)}
      </div>

      <button 
        onClick={() => onRemove(item.id)}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          opacity: 0.6,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
      >
        🗑️
      </button>
    </div>
  );
}

function CartSummary({ total, onCheckout, onClear, user }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: 32,
      padding: '1.5rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 100
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: 'var(--verde-selva)' }}>Resumen</h3>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.8rem',
        fontSize: '0.95rem',
        color: 'var(--gris-texto)'
      }}>
        <span>Subtotal:</span>
        <span>${total}</span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        fontSize: '0.95rem',
        color: 'var(--gris-texto)'
      }}>
        <span>Envío:</span>
        <span style={{ color: '#34c759' }}>Gratis</span>
      </div>
      
      {!user && (
        <div style={{
          background: 'rgba(255, 215, 0, 0.05)',
          borderRadius: 20,
          padding: '1rem',
          margin: '1rem 0',
          textAlign: 'center',
          border: '1px dashed rgba(255, 215, 0, 0.3)'
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--gris-texto)', margin: '0 0 0.5rem 0' }}>
            ✨ ¿Eres cliente frecuente?
          </p>
          <button
            onClick={() => {}}
            style={{
              background: 'transparent',
              border: '1px solid var(--maracuya)',
              borderRadius: 30,
              padding: '0.4rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--maracuya)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Regístrate y obtén 10% OFF
          </button>
        </div>
      )}
      
      {user && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)',
          borderRadius: 20,
          padding: '0.8rem',
          margin: '1rem 0',
          textAlign: 'center',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--verde-selva)', fontWeight: '600', margin: 0 }}>
            🎉 10% de descuento para miembros
          </p>
        </div>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '1rem 0',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: 'var(--verde-selva)'
      }}>
        <span>Total:</span>
        <span className="total-amount">${total}</span>
      </div>
      
      <button 
        onClick={onCheckout}
        style={{
          width: '100%',
          padding: '0.8rem',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, var(--verde-selva) 0%, #2a6b2f 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 40,
          fontWeight: '600',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(1, 64, 14, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(1, 64, 14, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(1, 64, 14, 0.2)';
        }}
      >
        Proceder al Pago
      </button>
      
      <button 
        onClick={onClear}
        style={{
          width: '100%',
          padding: '0.8rem',
          background: 'transparent',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 40,
          fontWeight: '600',
          fontSize: '1rem',
          color: 'var(--gris-texto)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 215, 0, 0.05)';
          e.currentTarget.style.borderColor = 'var(--maracuya)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        }}
      >
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
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: radial-gradient(circle at 30% 30%, #8B4513, #2C1810) fixed;
  }

  .app {
    min-height: 100vh;
  }

  .main-content {
    min-height: calc(100vh - 100px);
  }

  :root {
    --verde-selva: #01400e;
    --maracuya: #FFB347;
    --mango: #FF8C42;
    --morado-primario: #6366f1;
    --gris-texto: #4a5568;
    --borde-tropical: rgba(255, 179, 71, 0.2);
    --crema-tropical: #fff9f0;
  }

  @keyframes brilloMistico {
    0% { filter: drop-shadow(0 2px 4px rgba(1, 64, 14, 0.2)); }
    50% { filter: drop-shadow(0 2px 12px rgba(255, 215, 0, 0.5)); }
    100% { filter: drop-shadow(0 2px 4px rgba(1, 64, 14, 0.2)); }
  }

  @keyframes pulso {
    0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
    100% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.8); }
  }

  @keyframes brilloTexto {
    0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.2); }
    100% { text-shadow: 0 0 15px rgba(255, 215, 0, 0.6); }
  }

  @media (max-width: 768px) {
    header {
      padding: 0.5rem 1rem !important;
    }
    
    .cart-page > div {
      grid-template-columns: 1fr !important;
    }
  }
  
  @media (max-width: 480px) {
    .logo-text {
      font-size: 1rem !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}