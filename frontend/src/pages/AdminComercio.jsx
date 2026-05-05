import React, { useState, useEffect } from 'react';
import AdminPage from '../AdminPage';
import HomePage from './HomePage';
import EditMenuDrawer from '../EditMenuDrawer';
import AdminNavbar from '../components/AdminNavbar';
import { 
  getMenuBorrador, 
  saveMenuBorrador,
  publicarMenu, 
  tieneCambiosSinPublicar,
  descartarBorrador 
} from '../services/menuService';

export default function AdminComercio({ comercioId, onBack }) {
  const [hojaDeTrabajo, setHojaDeTrabajo] = useState('dashboard'); 
  const [menuBorrador, setMenuBorrador] = useState([]);
  const [comercioInfo, setComercioInfo] = useState(null);
  const [hayCambios, setHayCambios] = useState(false);

  useEffect(() => {
    const borrador = getMenuBorrador(comercioId);
    setMenuBorrador(borrador);
    setHayCambios(tieneCambiosSinPublicar(comercioId));

    try {
      const registrados = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
      const encontrado = registrados.find(c => c.id === Number(comercioId) || c.id === comercioId);
      
      if (encontrado) {
        setComercioInfo({
          ...encontrado,
          nombre: encontrado.nombre,
          imagen: encontrado.imagen || encontrado.logo
        });
      }
    } catch (e) {
      console.error('Error cargando info del comercio:', e);
    }
  }, [comercioId]);

  // DEMO 1: ONE TO ONE
  const handleCargarDemo1 = () => {
    const menuDemo = [
      { nombre: 'Picoteo', opciones: [
        { nombre: 'Alitas BBQ', precio: 8.50, imagen: '/img/Picoteo/Alitas2.png' },
        { nombre: 'Nachos Supreme', precio: 9.90, imagen: '/img/Picoteo/Nachos%20con%20queso.png' },
        { nombre: 'Patatas Bravas', precio: 6.50, imagen: '/img/Picoteo/Bowl%20Patatas%20fritas.png' }
      ]},
      { nombre: 'Entrantes', opciones: [
        { nombre: 'Croquetas Caseras', precio: 7.50, imagen: '/img/Entrantes/Bolon%20de%20Verde.JPG' },
        { nombre: 'Calamares a la Romana', precio: 9.00, imagen: '/img/Entrantes/Mote%20Pillo.JPG' },
        { nombre: 'Gambas al Ajillo', precio: 11.50, imagen: '/img/Entrantes/Tigrillo.JPG' }
      ]},
      { nombre: 'Gourmets', opciones: [
        { nombre: 'Solomillo al Foie', precio: 24.00, imagen: '/img/Gourmets/Cuy%20Asado.JPG' },
        { nombre: 'Risotto de Setas', precio: 16.50, imagen: '/img/Gourmets/Encebollado.JPG' },
        { nombre: 'Lubina a la Sal', precio: 22.00, imagen: '/img/Gourmets/Encocado%20de%20Pescado.JPG' }
      ]}
    ];
    localStorage.setItem('menu_comercio_1', JSON.stringify(menuDemo));
    localStorage.setItem('borrador_comercio_1', JSON.stringify(menuDemo));
    setMenuBorrador(menuDemo);
    setHayCambios(true);
    alert('✅ Demo ONE TO ONE cargada');
  };

  // DEMO 2: SABORES DEL ORIGEN
  const handleCargarDemo2 = () => {
    const menuDemo = [
      { nombre: 'Ceviches', opciones: [
        { nombre: 'Ceviche de Camarón', precio: 6.50, imagen: '/img/Entrantes/Ceviche%20de%20Camaron.JPG' },
        { nombre: 'Ceviche de Pescado', precio: 5.50, imagen: '/img/Gourmets/Encocado%20de%20Pescado.JPG' }
      ]},
      { nombre: 'Sopas', opciones: [
        { nombre: 'Encebollado', precio: 4.50, imagen: '/img/Gourmets/Encebollado.JPG' },
        { nombre: 'Locro de Papa', precio: 4.00, imagen: '/img/Entrantes/Locro%20de%20Papa.JPG' }
      ]},
      { nombre: 'Platos Fuertes', opciones: [
        { nombre: 'Seco de Pollo', precio: 7.50, imagen: '/img/Gourmets/Estofado%20de%20Pollo.JPG' },
        { nombre: 'Encocado de Pescado', precio: 8.50, imagen: '/img/Gourmets/Encocado%20de%20Pescado.JPG' },
        { nombre: 'Cuy Asado', precio: 15.00, imagen: '/img/Gourmets/Cuy%20Asado.JPG' }
      ]}
    ];
    localStorage.setItem('menu_comercio_2', JSON.stringify(menuDemo));
    localStorage.setItem('borrador_comercio_2', JSON.stringify(menuDemo));
    setMenuBorrador(menuDemo);
    setHayCambios(true);
    alert('✅ Demo Sabores del Origen cargada');
  };

  // DEMO 3: SIERRA Y FUEGO
  const handleCargarDemo3 = () => {
    const menuDemo = [
      { nombre: 'Picoteo', opciones: [
        { nombre: 'Bolon de Verde', precio: 3.50, imagen: '/img/Entrantes/Bolon%20de%20Verde.JPG' },
        { nombre: 'Tigrillo', precio: 4.00, imagen: '/img/Entrantes/Tigrillo.JPG' },
        { nombre: 'Mote Pillo', precio: 3.00, imagen: '/img/Entrantes/Mote%20Pillo.JPG' }
      ]},
      { nombre: 'Sopas', opciones: [
        { nombre: 'Locro Quiteño', precio: 4.50, imagen: '/img/Entrantes/Locro%20de%20Papa.JPG' }
      ]},
      { nombre: 'Platos', opciones: [
        { nombre: 'Cuy Asado', precio: 16.00, imagen: '/img/Gourmets/Cuy%20Asado.JPG' },
        { nombre: 'Hornado', precio: 8.00, imagen: '/img/Gourmets/Estofado%20de%20Pollo.JPG' },
        { nombre: 'Llapingachos', precio: 6.00, imagen: '/img/Entrantes/Tigrillo.JPG' }
      ]}
    ];
    localStorage.setItem('menu_comercio_3', JSON.stringify(menuDemo));
    localStorage.setItem('borrador_comercio_3', JSON.stringify(menuDemo));
    setMenuBorrador(menuDemo);
    setHayCambios(true);
    alert('✅ Demo Sierra y Fuego cargada');
  };

  const handleActionPrincipal = () => {
    if (hojaDeTrabajo === 'editor') {
      saveMenuBorrador(comercioId, menuBorrador);
      setHayCambios(true);
      alert('✅ Cambios guardados en borrador');
    } else {
      if (!window.confirm('🚀 ¿Publicar cambios ahora?')) return;
      const resultado = publicarMenu(comercioId);
      if (resultado.success) {
        setHayCambios(false);
        alert('✅ Menú publicado');
      }
    }
  };

  const handleDescartar = () => {
    if (!window.confirm('⚠️ ¿Descartar cambios sin publicar?')) return;
    setMenuBorrador(descartarBorrador(comercioId));
    setHayCambios(false);
  };

  const handleLogout = () => {
    if (hayCambios && window.confirm('⚠️ Tienes cambios pendientes. ¿Publicar antes de salir?')) {
      publicarMenu(comercioId);
    }
    onBack();
  };

  const handleVolver = () => {
    if (hojaDeTrabajo !== 'dashboard') setHojaDeTrabajo('dashboard');
    else onBack();
  };

  return (
    <div style={styles.mainContainer}>
      <AdminNavbar 
        onBack={handleVolver}
        onHome={() => setHojaDeTrabajo('dashboard')}
        onLogout={handleLogout}
        onDelete={handleDescartar}
        onView={() => setHojaDeTrabajo('preview')}
        onAction={handleActionPrincipal}
        nombreComercio={comercioInfo?.nombre}
        hayCambios={hayCambios}
        hojaDeTrabajo={hojaDeTrabajo}
      />

      {hojaDeTrabajo === 'preview' && (
        <div style={styles.previewBanner}>
          <span>🚀 Modo Visualización — Vuelva al Panel para Publicar</span>
        </div>
      )}

      <div style={styles.contentWrapper}>
        {hojaDeTrabajo === 'dashboard' && (
          <div style={{ padding: '6px 16px', textAlign: 'center', flexShrink: 0 }}>
            <button 
  onClick={() => {
    if (comercioId === 1 || comercioId === '1') handleCargarDemo1();
    else if (comercioId === 2 || comercioId === '2') handleCargarDemo2();
    else if (comercioId === 3 || comercioId === '3') handleCargarDemo3();
  }}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#1a0a0a',
                border: 'none',
                borderRadius: '24px',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
              }}
            >
              🚀 Cargar Demo
            </button>
          </div>
        )}

        {hojaDeTrabajo === 'dashboard' && (
          <AdminPage
            comercioId={comercioId}
            menuItems={menuBorrador}
            onOpenEditor={() => setHojaDeTrabajo('editor')}
            isDraftMode={true}
            finishedOrders={[]} 
            pendingOrders={[]}
            log={[]}
            addLog={() => {}}
            setFinishedOrders={() => {}}
          />
        )}
        
        {hojaDeTrabajo === 'editor' && (
          <EditMenuDrawer
            open={true}
            onClose={() => setHojaDeTrabajo('dashboard')}
            comercioId={comercioId}
            menuItems={menuBorrador}
            onSave={(updated) => {
              setMenuBorrador(updated);
              setHayCambios(true);
            }}
          />
        )}
        
        {hojaDeTrabajo === 'preview' && (
          <HomePage
            comercio={comercioInfo}
            platillos={menuBorrador}
            onBackToWelcome={() => setHojaDeTrabajo('dashboard')}
            isPreviewMode={true}
          />
        )}
      </div>

      <style>{`
        @media (max-width: 480px) { .hide-on-mobile { display: none !important; } }
      `}</style>
    </div>
  );
}

const styles = {
  mainContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)',
    overflow: 'hidden'
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '56px',
  },
  previewBanner: {
    padding: '8px',
    background: '#FFD700',
    color: '#000',
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
};