// ============================================
// HEADER SUPERIOR FLOTANTE CON TÍTULO CENTRAL
// ============================================

import React, { useState, useEffect } from 'react';
import AdminPage from './AdminPage';
import { CartProvider, useCart } from './CartContext';
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
  <>
    {console.log('🔴 selectedCategory:', selectedCategory)}
    {console.log('🔴 itemsToShow:', itemsToShow.map(i => i.nombre))}
    <HomePage 
      platillos={itemsToShow.filter(item => {
        if (!selectedCategory) return true;

        const nombrePlato = (item.nombre || "").toLowerCase().trim();
        const nombreBoton = selectedCategory.toLowerCase().trim();

        const mapeo = {
          'primeros': 'primero',
          'segundos': 'segundo',
          'bebidas': 'bebidas',
          'pizzas': 'pizzas',
          'otras': 'pizzas'
        };

        const singularBoton = mapeo[nombreBoton] || nombreBoton;
        const coincide = nombrePlato === singularBoton || nombrePlato === nombreBoton;
        
        console.log(`🔍 Comparando: "${nombrePlato}" vs "${nombreBoton}" (singular: "${singularBoton}") = ${coincide}`);
        return coincide;
      })}
    />
  </>
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
    <header style={{
      position: 'fixed',
      top: 0, // 👈 Pegado arriba para ganar limpieza
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.8)', // Un poco más opaco para legibilidad
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      display: 'flex',
      justifyContent: 'center',
      height: '60px' // Altura fija para control total
    }}>
      
      {/* Contenedor interno */}
      <div style={{
        width: '100%',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        
        {/* ===== IZQUIERDA - MENÚ HAMBURGUESA ===== */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={onOpenMenu} 
            style={{  
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: '10px'
            }}  
          >
            <div style={{ width: 22, height: 2, background: 'var(--verde-selva)', borderRadius: 2 }} />
            <div style={{ width: 16, height: 2, background: 'var(--maracuya)', borderRadius: 2 }} />
            <div style={{ width: 22, height: 2, background: 'var(--morado-primario)', borderRadius: 2 }} />
          </button>
        </div>

        {/* ===== CENTRO - LOGO ONE TO ONE ===== */}
        <div style={{
          flex: 2, // 👈 Le damos el doble de espacio que a los lados
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          whiteSpace: 'nowrap', // 👈 PROHIBIDO el salto de línea
          cursor: 'pointer'
        }}
        onClick={onBackToWelcome}
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
              //background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
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
          flex: 1, 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px' // Espacio controlado entre iconos
        }}>
          
          {/* Carrito */}
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

          {/* Perfil de Usuario */}
          <button
            onClick={onOpenPerfil}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: 40,
              padding: '0.4rem 0.5rem',
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
                background: '#34c759',
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
              padding: '0.3rem 0.6rem',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              color: '#8e8e93',
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
  
  // Usar imagen de la opción seleccionada o la del item
  const imageSrc = selectedData?.imagen || item.imagenes?.[0];
  
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
        {imageSrc ? (
          <img 
            src={imageSrc} 
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

      {/* Galleta informativa - 320px alineada */}
      <div style={{
  width: '95%',
  maxWidth: 480,
  margin: '10px auto 0',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: 32,
  boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
  border: '1px solid rgba(255, 255, 255, 0.6)',
  position: 'relative',
  zIndex: 10,
  maxHeight: '480px',         // 👈 ALTURA MÁXIMA CONTROLADA
  overflowY: 'auto'           // 👈 SCROLL CUANDO SEA NECESARIO
}}>
        
        <div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: 'var(--verde-selva)',
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {item.nombre}
            <OfertaBadge />
          </h2>
        </div>
        
       {/* DESCRIPCIÓN TIPO "GALLETA" */}
  <p style={{
    fontSize: '0.9rem',
    color: 'var(--gris-texto)',
    lineHeight: 1.6,
    margin: 0,
    fontStyle: 'italic',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    maxHeight: '80px',          // 👈 LÍMITE PARA DESCRIPCIÓN
    overflowY: 'auto',           // 👈 SCROLL SI ES MUY LARGA
    paddingRight: '5px'
  }}>
    {description}
  </p>

        <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    margin: '0.5rem 0',
    maxHeight: '200px',          // 👈 LÍMITE PARA OPCIONES
    overflowY: 'auto',            // 👈 SCROLL SI HAY MUCHAS
    paddingRight: '5px'
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
        padding: '0.5rem 1rem',
        background: selectedOption === opt.nombre ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 16,
        border: selectedOption === opt.nombre 
          ? '1px solid var(--maracuya)' 
          : '1px solid rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (selectedOption !== opt.nombre) {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedOption !== opt.nombre) {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <input 
          type="checkbox"
          checked={selectedOption === opt.nombre}
          onChange={() => setSelectedOption(selectedOption === opt.nombre ? null : opt.nombre)}
          style={{
            width: 18,
            height: 18,
            marginTop: '3px',
            cursor: 'pointer',
            accentColor: 'var(--maracuya)'
          }}
        />
        <span style={{
          fontSize: '0.95rem',
          fontWeight: '500',
          color: 'var(--gris-texto)',
          lineHeight: '1.4',
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }}>
          {opt.nombre}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {tieneOferta && (
          <span style={{
            fontSize: '0.8rem',
            color: '#999',
            textDecoration: 'line-through'
          }}>
            ${precioOriginal.toFixed(2)}
          </span>
        )}
        <span style={{
          fontSize: '1rem',
          fontWeight: '700',
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
          background: 'rgba(255, 215, 0, 0.05)',
          padding: '0.5rem',
          borderRadius: 20,
          border: '1px solid rgba(255, 215, 0, 0.1)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
            <span style={{ fontSize: '1rem' }}>🥗</span>
            <span style={{ fontWeight: '600', color: 'var(--verde-selva)' }}>{nutrition.calorias}</span> kcal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
            <span style={{ fontSize: '1rem' }}>🥩</span>
            <span style={{ fontWeight: '600', color: 'var(--verde-selva)' }}>{nutrition.proteina}</span>g
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
            <span style={{ fontSize: '1rem' }}>🍚</span>
            <span style={{ fontWeight: '600', color: 'var(--verde-selva)' }}>{nutrition.carbohidratos}</span>g
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.8rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedOption && selectedData && item.enOferta && selectedData.precioOriginal && (
              <span style={{
                fontSize: '0.9rem',
                color: '#999',
                textDecoration: 'line-through'
              }}>
                ${selectedData.precioOriginal.toFixed(2)}
              </span>
            )}
            <span style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'var(--maracuya)',
              lineHeight: 1
            }}>
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          <button 
            style={{
              background: !selectedOption 
                ? 'rgba(0, 0, 0, 0.1)' 
                : 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
              color: !selectedOption ? '#999' : 'var(--verde-selva)',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: 30,
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: !selectedOption ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: !selectedOption ? 'none' : '0 4px 12px rgba(255, 215, 0, 0.3)'
            }}
            onClick={handleAddToCart}
            disabled={!selectedOption}
            onMouseEnter={(e) => {
              if (selectedOption) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedOption) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)';
              }
            }}
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
// ============================================
// CARRITO - ESTILO CRISTAL ESMERILADO (ORIGINAL MEJORADO)
// ============================================
function CartPage({ addLog, setPendingOrders, user, onVolverAlMenu }) {
  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const [payOpen, setPayOpen] = useState(false);
  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.emptyCard}>
          <span style={styles.emptyIcon}>🛒</span>
          <h2 style={styles.emptyTitle}>Tu Carrito</h2>
          <p style={styles.emptyText}>Tu carrito está vacío. ¡Agrega platos deliciosos!</p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.container}>
      <h2 style={styles.pageTitle}>Revisa tu Carrito 🔱</h2>
      
      <div style={styles.cartCard}>
        {/* Lista de items */}
        <div style={styles.itemsList}>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
        
        {/* Resumen */}
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
    <div style={styles.cartItem}>
      <div style={styles.itemInfo}>
        <h4 style={styles.itemName}>{item.nombre}</h4>
        <p style={styles.itemPrice}>${item.precio.toFixed(2)} c/u</p>
      </div>
      
      <div style={styles.itemActions}>
        <div style={styles.quantityControl}>
          <button 
            onClick={() => onUpdateQuantity(item.id, cantidad - 1)}
            disabled={cantidad <= 1}
            style={cantidad <= 1 ? styles.qtyBtnDisabled : styles.qtyBtn}
          >
            −
          </button>
          <span style={styles.qtyValue}>{cantidad}</span>
          <button 
            onClick={() => onUpdateQuantity(item.id, cantidad + 1)}
            style={styles.qtyBtn}
          >
            +
          </button>
        </div>

        <div style={styles.itemTotal}>${(item.precio * cantidad).toFixed(2)}</div>

        <button 
          onClick={() => onRemove(item.id)}
          style={styles.removeBtn}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function CartSummary({ total, onCheckout, user, onVolver }) {
  return (
    <div style={styles.summaryCard}>
      <h3 style={styles.summaryTitle}>Resumen</h3>
      
      <div style={styles.summaryRow}>
        <span>Subtotal</span>
        <span>${total}</span>
      </div>
      <div style={styles.summaryRow}>
        <span>Envío</span>
        <span style={{ color: '#34c759' }}>Gratis</span>
      </div>
      
      {!user && (
        <div style={styles.promoBox}>
          <p style={styles.promoText}>✨ ¿Eres cliente frecuente?</p>
          <button style={styles.promoBtn}>
            Regístrate y obtén 10% OFF
          </button>
        </div>
      )}
      
      {user && (
        <div style={styles.memberBadge}>
          🎉 10% de descuento para miembros
        </div>
      )}
      
      <div style={styles.totalRow}>
        <span>Total</span>
        <span style={styles.totalAmount}>${total}</span>
      </div>
      
      <button onClick={onCheckout} style={styles.checkoutBtn}>
        Proceder al Pago
      </button>
      
      <button
        onClick={onVolver}
        style={styles.backBtn}
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
// Apilado vertical, colores alegres
// ============================================
const styles = {
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
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}