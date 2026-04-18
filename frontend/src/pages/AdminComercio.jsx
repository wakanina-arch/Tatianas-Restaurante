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
  const [vista, setVista] = useState('dashboard');
  const [menuBorrador, setMenuBorrador] = useState([]);
  const [comercioInfo, setComercioInfo] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [finishedOrders, setFinishedOrders] = useState([]);
  const [log, setLog] = useState([]);
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
          imagen: encontrado.imagen || encontrado.logo,
          logo: encontrado.logo || encontrado.imagen
        });
      } else {
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

  const handleSaveMenu = (updatedMenu) => {
    setMenuBorrador(updatedMenu);
    saveMenuBorrador(comercioId, updatedMenu);
    setHayCambios(true);
  };

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

  const handleDescartar = () => {
    if (!window.confirm('⚠️ ¿Descartar todos los cambios sin publicar? Esta acción no se puede deshacer.')) {
      return;
    }
    
    const menuPublicado = descartarBorrador(comercioId);
    setMenuBorrador(menuPublicado);
    setHayCambios(false);
  };

  const handleVolver = () => {
    if (vista === 'preview') {
      setVista('dashboard');
    }
  };

  const handleVerPreview = () => {
    setVista('preview');
  };

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
    onBack();
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
      overflow: 'hidden'
    }}>
      {/* HEADER PRINCIPAL - RESPONSIVE */}
      <div style={styles.header}>
        <button onClick={handleVolver} style={styles.backButton}>
          ← <span className="hide-on-mobile">Panel</span>
        </button>
        <div style={styles.spacer}></div>
        <div style={styles.headerRight}>
          <div style={styles.comercioBadge}>
            <span className="hide-on-mobile">ID: </span>{comercioId}
          </div>
          
          <button onClick={handleVerPreview} style={styles.previewButton} title="Vista Previa">
            👁️ <span className="hide-on-mobile">Vista Previa</span>
          </button>
          
          {vista === 'dashboard' && (
            <>
              {hayCambios ? (
                <>
                  <button onClick={handleDescartar} style={styles.discardButton} title="Descartar">
                    🗑️ <span className="hide-on-mobile">Descartar</span>
                  </button>
                  <button onClick={handlePublicar} style={styles.publishButton} title="Publicar">
                    🚀 <span className="hide-on-mobile">Publicar</span>
                  </button>
                </>
              ) : (
                <span style={styles.syncedBadge}>
                  ✅ <span className="hide-on-mobile">Publicado</span>
                </span>
              )}
            </>
          )}
          
          <button onClick={handleLogout} style={styles.logoutButton} title="Cerrar Sesión">
            🚪 <span className="hide-on-mobile">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* BANNER DE PREVIEW */}
      {vista === 'preview' && (
        <div style={styles.previewBanner}>
          <div style={styles.previewBannerContent}>
            <span style={styles.previewIcon}>🚀</span>
            <div style={styles.previewTextWrapper}>
              <span style={styles.previewText}>
                <strong>Modo de visualización previa — Vuelva al Panel Administrativo — 
                Presione <span style={styles.publishHighlight}>Publicar</span> para hacer visible su contenido al público.</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
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
            fixedMode={true}
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

      {/* PIE DE PÁGINA */}
      {vista === 'dashboard' && hayCambios && (
        <div style={styles.draftFooter}>
          ⚠️ <span className="hide-on-mobile">Estás editando el </span>BORRADOR<span className="hide-on-mobile">. Los cambios NO son visibles para los clientes hasta que publiques.</span>
        </div>
      )}
      
      {/* ESTILOS RESPONSIVE */}
      <style>{`
        @media (max-width: 480px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  header: {
    padding: '0.5rem 0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(20,10,10,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,215,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '0.25rem',
  },
  backButton: {
    background: 'transparent',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: '30px',
    padding: '0.4rem 0.8rem',
    color: '#FFD700',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  spacer: {
    flex: 1,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  comercioBadge: {
    background: 'rgba(0,0,0,0.5)',
    padding: '0.2rem 0.5rem',
    borderRadius: '20px',
    color: '#aaa',
    fontSize: '0.65rem',
    whiteSpace: 'nowrap',
  },
  previewButton: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    borderRadius: '30px',
    padding: '0.4rem',
    minWidth: '36px',
    color: '#60a5fa',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  publishButton: {
    background: 'linear-gradient(135deg, #00a86b, #2ecc71)',
    border: 'none',
    borderRadius: '30px',
    padding: '0.4rem',
    minWidth: '36px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  discardButton: {
    background: 'rgba(230, 57, 70, 0.2)',
    border: '1px solid rgba(230, 57, 70, 0.5)',
    borderRadius: '30px',
    padding: '0.4rem',
    minWidth: '36px',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  syncedBadge: {
    color: '#2ecc71',
    fontSize: '0.8rem',
    padding: '0.4rem',
    whiteSpace: 'nowrap',
  },
  logoutButton: {
    background: 'rgba(230, 57, 70, 0.2)',
    border: '1px solid rgba(230, 57, 70, 0.5)',
    borderRadius: '30px',
    padding: '0.4rem',
    minWidth: '36px',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  previewBanner: {
    padding: '0.4rem 1rem',
    background: 'rgba(59, 130, 246, 0.15)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#60a5fa',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previewBannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    maxWidth: '900px',
  },
  previewIcon: {
    fontSize: '1.1rem',
    lineHeight: 1,
    flexShrink: 0,
  },
  previewTextWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  previewText: {
    lineHeight: 1.4,
    letterSpacing: '0.3px',
  },
  publishHighlight: {
    color: '#2ecc71',
    fontWeight: '700',
    marginLeft: '3px',
    marginRight: '3px',
  },
  draftFooter: {
    padding: '0.4rem 1rem',
    background: 'rgba(20, 10, 5, 0.95)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255, 193, 7, 0.3)',
    color: '#ffc107',
    fontSize: '0.7rem',
    textAlign: 'center',
    flexShrink: 0,
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }
  @media (max-width: 480px) {
    button {
      padding: 0.3rem !important;
      min-width: 32px !important;
      font-size: 0.9rem !important;
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}