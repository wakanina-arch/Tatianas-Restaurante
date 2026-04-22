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

  // 🚀 FUNCIÓN PARA CARGAR DEMO
  const handleCargarDemo = () => {
    const menuDemo = [
      { nombre: 'Picoteo', opciones: [
        { nombre: 'Alitas BBQ', precio: 8.50, imagen: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Nachos Supreme', precio: 9.90, imagen: 'https://images.pexels.com/photos/2608049/pexels-photo-2608049.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Patatas Bravas', precio: 6.50, imagen: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]},
      { nombre: 'Entrantes', opciones: [
        { nombre: 'Croquetas Caseras', precio: 7.50, imagen: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Calamares a la Romana', precio: 9.00, imagen: 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Gambas al Ajillo', precio: 11.50, imagen: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]},
      { nombre: 'Gourmets', opciones: [
        { nombre: 'Solomillo al Foie', precio: 24.00, imagen: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Risotto de Setas', precio: 16.50, imagen: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Lubina a la Sal', precio: 22.00, imagen: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]},
      { nombre: 'Escuderos', opciones: [
        { nombre: 'Ensalada César', precio: 11.50, imagen: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Ensalada Caprese', precio: 10.00, imagen: 'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Ensalada Waldorf', precio: 10.50, imagen: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]},
      { nombre: 'Zombies', opciones: [
        { nombre: 'Pizza Carbonara', precio: 13.50, imagen: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Hamburguesa Monstruosa', precio: 15.00, imagen: 'https://images.pexels.com/photos/2983098/pexels-photo-2983098.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Perrito Supreme', precio: 9.50, imagen: 'https://images.pexels.com/photos/1603898/pexels-photo-1603898.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]},
      { nombre: 'FastFurious', opciones: [
        { nombre: 'Wrap de Pollo', precio: 8.50, imagen: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Bocata de Calamares', precio: 9.00, imagen: 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Sandwich Club', precio: 10.50, imagen: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]},
      { nombre: 'Postres', opciones: [
        { nombre: 'Tarta de Queso', precio: 5.50, imagen: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Brownie con Helado', precio: 6.00, imagen: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Coulant de Chocolate', precio: 6.50, imagen: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]},
      { nombre: 'Bebidas', opciones: [
        { nombre: 'Cerveza Artesanal', precio: 4.50, imagen: 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Vino Tinto Reserva', precio: 18.00, imagen: 'https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { nombre: 'Refresco Artesano', precio: 3.50, imagen: 'https://images.pexels.com/photos/5946725/pexels-photo-5946725.jpeg?auto=compress&cs=tinysrgb&w=600' }
      ]}
    ];
    localStorage.setItem('menu_comercio_1', JSON.stringify(menuDemo));
    localStorage.setItem('borrador_comercio_1', JSON.stringify(menuDemo));
    setMenuBorrador(menuDemo);
    setHayCambios(true);
    alert('✅ Menú de demostración cargado. Ya puedes salir al comercio.');
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
      
      {/* NAVBAR UNIFICADO */}
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

      {/* 🚀 BOTÓN CARGAR DEMO (TEMPORAL) */}
      {hojaDeTrabajo === 'dashboard' && (
        <div style={{ padding: '8px 16px', textAlign: 'center' }}>
          <button 
            onClick={handleCargarDemo}
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
            🚀 Cargar Demo (24 platos)
          </button>
        </div>
      )}

      {/* BANNER DE PREVIEW */}
      {hojaDeTrabajo === 'preview' && (
        <div style={styles.previewBanner}>
          <span>🚀 Modo Visualización — Vuelva al Panel para Publicar</span>
        </div>
      )}

      {/* CONTENIDO DINÁMICO */}
      <div style={styles.contentWrapper}>
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
    paddingTop: '56px',  // ← AÑADIDO: Empuja el contenido debajo del Navbar
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