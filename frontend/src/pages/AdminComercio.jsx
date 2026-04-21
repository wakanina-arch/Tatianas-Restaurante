import React, { useState, useEffect } from 'react';
import AdminPage from '../AdminPage';
import HomePage from './HomePage';
import EditMenuDrawer from '../EditMenuDrawer';
import AdminNavbar from '../components/AdminNavbar'; // Asegúrate de que la ruta sea correcta
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

  // --- LÓGICA DE EVENTOS PARA EL NAVBAR ---
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
      
      {/* NAVBAR UNIFICADO (ONE TO ONE) */}
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
    // 👇 AÑADE ESTAS LÍNEAS PARA EVITAR EL ERROR
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
    flexDirection: 'column'
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
