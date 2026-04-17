import React, { useState, useEffect } from 'react';
import AdminPage from '../AdminPage';
import HomePage from './HomePage';
import { 
  getMenuBorrador, 
  saveMenuBorrador,
  publicarMenu, 
  tieneCambiosSinPublicar,
  descartarBorrador 
} from '../services/menuService';

export default function AdminComercio({ comercioId, onBack }) {
  const [vista, setVista] = useState('dashboard'); // 'dashboard' o 'preview'
  const [menuBorrador, setMenuBorrador] = useState([]);
  const [comercioInfo, setComercioInfo] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [finishedOrders, setFinishedOrders] = useState([]);
  const [log, setLog] = useState([]);
  const [hayCambios, setHayCambios] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    // Cargar borrador
    const borrador = getMenuBorrador(comercioId);
    setMenuBorrador(borrador);
    setHayCambios(tieneCambiosSinPublicar(comercioId));

    // Cargar info del comercio desde localStorage
    try {
      const registrados = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
      const encontrado = registrados.find(c => c.id === Number(comercioId) || c.id === comercioId);
      
      if (encontrado) {
        setComercioInfo({
          ...encontrado,
          imagen: encontrado.imagen || encontrado.logo,
          logo: encontrado.logo || encontrado.imagen
        });
      } else {
        // Fallback por si no está en registros
        setComercioInfo({
          id: comercioId,
          nombre: `Comercio #${comercioId}`,
          imagen: '/casas/default.JPG'
        });
      }
    } catch (e) {
      console.error('Error cargando info del comercio:', e);
    }
  }, [comercioId]);

  // Guardar cambios en el borrador
  const handleSaveMenu = (updatedMenu) => {
    setMenuBorrador(updatedMenu);
    saveMenuBorrador(comercioId, updatedMenu);
    setHayCambios(true);
  };

  // Publicar borrador
  const handlePublicar = () => {
    if (!window.confirm('🚀 ¿Publicar cambios? Los clientes verán el nuevo menú inmediatamente.')) {
      return;
    }
    
    const resultado = publicarMenu(comercioId);
    if (resultado.success) {
      setHayCambios(false);
      alert('✅ Menú publicado correctamente');
    } else {
      alert('❌ Error al publicar: ' + resultado.error);
    }
  };

  // Descartar cambios
  const handleDescartar = () => {
    if (!window.confirm('⚠️ ¿Descartar todos los cambios sin publicar? Esta acción no se puede deshacer.')) {
      return;
    }
    
    const menuPublicado = descartarBorrador(comercioId);
    setMenuBorrador(menuPublicado);
    setHayCambios(false);
  };

  // Navegación interna
  const handleVolver = () => {
    if (vista === 'preview') {
      setVista('dashboard');
    } else {
      // En dashboard, "Volver" podría ir a selección de comercio (onBack)
      // Pero por ahora no hace nada para evitar cierres accidentales
    }
  };

  const handleVerPreview = () => {
    setVista('preview');
  };

  // Cerrar sesión
  const handleLogout = () => {
    if (hayCambios) {
      const opcion = window.confirm(
        '⚠️ Tienes cambios sin publicar.\n\n' +
        '• Aceptar = Publicar y salir\n' +
        '• Cancelar = Salir sin publicar'
      );
      
      if (opcion) {
        publicarMenu(comercioId);
      }
    }
    onBack(); // Vuelve a WelcomeInicio
  };

  const addLog = (entry) => {
    setLog(prev => [...prev, { ...entry, timestamp: new Date().toISOString() }]);
  };

  return (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)',
    overflow: 'hidden'  // ← Esto elimina cualquier scroll
  }}>
    {/* HEADER PRINCIPAL - FIJO ARRIBA */}
    <div style={styles.header}>
      <button onClick={handleVolver} style={styles.backButton}>← Panel</button>
      <div style={styles.spacer}></div>
      <div style={styles.headerRight}>
        <div style={styles.comercioBadge}>ID: {comercioId}</div>
        
        {/* Botón Vista Previa */}
        <button onClick={handleVerPreview} style={styles.previewButton}>
          👁️ Vista Previa
        </button>
        
        {/* Botones de Publicar/Descartar */}
        {vista === 'dashboard' && (
          <>
            {hayCambios ? (
              <>
                <button onClick={handleDescartar} style={styles.discardButton}>
                  🗑️ Descartar
                </button>
                <button onClick={handlePublicar} style={styles.publishButton}>
                  🚀 Publicar
                </button>
              </>
            ) : (
              <span style={styles.syncedBadge}>✅ Publicado</span>
            )}
          </>
        )}
        
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>

    {/* BANNER DE PREVIEW */}
    {/* BANNER DE PREVIEW - VERSIÓN MEJORADA */}
{/* BANNER DE PREVIEW - VERSIÓN MEJORADA */}
{/* BANNER DE PREVIEW - VERSIÓN MEJORADA */}

{vista === 'preview' && (
  <div style={styles.previewBanner}>
    <div style={styles.previewBannerContent}>
      <span style={styles.previewIcon}>🚀</span>
      <div style={styles.previewTextWrapper}>
       <span style={styles.previewText}>
  <strong> Modo de visualización previa — Vuelva al Panel Administrativo — 
  Presione <span style={styles.publishHighlight}>Publicar</span> para hacer visible su contenido al público.</strong>
</span>
      </div>
    </div>
  </div>
)}

    {/* CONTENIDO PRINCIPAL - FIJO, SIN SCROLL */}
    <div style={{
      flex: 1,
      overflow: 'hidden',  // ← Sin scroll
      display: 'flex',
      flexDirection: 'column'
    }}>
      {vista === 'dashboard' && (
        <AdminPage
          comercioId={comercioId}
          menuItems={menuBorrador}
          onSaveMenu={handleSaveMenu}
          log={log}
          addLog={addLog}
          pendingOrders={pendingOrders}
          setPendingOrders={setPendingOrders}
          finishedOrders={finishedOrders}
          setFinishedOrders={setFinishedOrders}
          onBack={onBack}
          isDraftMode={true}
          fixedMode={true}  // ← Nueva prop para indicar modo fijo
        />
      )}

      {vista === 'preview' && comercioInfo && (
        <HomePage
          comercio={comercioInfo}
          platillos={menuBorrador}
          user={null}
          itemCount={0}
          onOpenPerfil={() => {}}
          onBackToWelcome={() => setVista('dashboard')}
          setCurrentPage={() => {}}
          isPreviewMode={true}
        />
      )}
    </div>

    {/* PIE DE PÁGINA - FIJO ABAJO */}
    {vista === 'dashboard' && hayCambios && (
      <div style={{
        padding: '0.5rem 2rem',
        background: 'rgba(20, 10, 5, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 193, 7, 0.3)',
        color: '#ffc107',
        fontSize: '0.8rem',
        textAlign: 'center',
        flexShrink: 0  // ← No se encoge
      }}>
        ⚠️ Estás editando el BORRADOR. Los cambios NO son visibles para los clientes hasta que publiques.
      </div>
    )}
  </div>
);
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)',
  },
  header: {
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(20,10,10,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,215,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  backButton: {
    background: 'transparent',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: '30px',
    padding: '0.5rem 1.5rem',
    color: '#FFD700',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  title: {
    color: '#FFD700',
    fontSize: '1.3rem',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  comercioBadge: {
    background: 'rgba(0,0,0,0.5)',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    color: '#aaa',
    fontSize: '0.8rem',
  },
  previewButton: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    borderRadius: '30px',
    padding: '0.5rem 1.2rem',
    color: '#60a5fa',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  publishButton: {
    background: 'linear-gradient(135deg, #00a86b, #2ecc71)',
    border: 'none',
    borderRadius: '30px',
    padding: '0.5rem 1.5rem',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  discardButton: {
    background: 'rgba(230, 57, 70, 0.2)',
    border: '1px solid rgba(230, 57, 70, 0.5)',
    borderRadius: '30px',
    padding: '0.5rem 1.2rem',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  syncedBadge: {
    color: '#2ecc71',
    fontSize: '0.8rem',
    padding: '0.5rem 1rem',
  },
  logoutButton: {
    background: 'rgba(230, 57, 70, 0.2)',
    border: '1px solid rgba(230, 57, 70, 0.5)',
    borderRadius: '30px',
    padding: '0.5rem 1.2rem',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  
  },
  previewBanner: {
    padding: '0.5rem 2rem',
    background: 'rgba(59, 130, 246, 0.15)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#60a5fa',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backToDashboardBtn: {
    background: 'transparent',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    borderRadius: '20px',
    padding: '0.3rem 1rem',
    color: '#60a5fa',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
  },
  spacer: {
  flex: 1, // Ocupa el espacio sobrante
  },
  previewBannerContent: {
  display: 'flex',
  alignItems: 'center',  // ← Alineación centrada (misma línea)
  gap: '12px',           // ← Separación normal entre cohete y texto
  maxWidth: '900px',
},
previewIcon: {
  fontSize: '1.3rem',
  lineHeight: 1,
  flexShrink: 0,         // ← El cohete no se encoge
},
previewTextWrapper: {
  display: 'flex',
  alignItems: 'center',
},
previewText: {
  lineHeight: 1.5,
  letterSpacing: '0.3px',
},
publishHighlight: {
  color: '#2ecc71',
  fontWeight: '700',
  marginLeft: '4px',
  marginRight: '4px',
},
  
};

// Estilos hover
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}