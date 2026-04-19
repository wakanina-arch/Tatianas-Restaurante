import React, { useEffect, useRef } from 'react';

export default function CategoriaTabs({ categorias, categoriaActiva, onSelectCategoria, setCurrentPage, user }) {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    // Sincronización del scroll lateral cuando cambia la categoría activa
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;

      const containerWidth = container.clientWidth;
      const activeTabLeft = activeTab.offsetLeft;
      const activeTabWidth = activeTab.offsetWidth;
      
      // Calculamos la posición para que el tab quede centrado
      const scrollTarget = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);
      
      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth'
      });
    }
  }, [categoriaActiva]);

  return (
    <>
      <div style={styles.container} ref={containerRef}>
        {categorias.map((cat) => {
          const isActive = categoriaActiva === cat.id;
          
          return (
            <button
              key={cat.id}
              // RE-ACTIVADO: Sin esta ref, el scroll automático no funciona
              ref={isActive ? activeTabRef : null}
              onClick={() => onSelectCategoria(cat.id)}
              style={{
                ...styles.tab,
                ...(isActive ? styles.tabActivo : {}),
              }}
            >
              <span style={styles.icono}>{cat.icono}</span>
              <span style={styles.nombre}>{cat.nombre}</span>
            </button>
          );
        })}
        
        {user?.rol === 'admin_restaurante' && setCurrentPage && (
          <button
            onClick={() => setCurrentPage('admin')}
            style={{...styles.tab, ...styles.dshTab}}
            title="Dashboard Admin"
          >
            <span style={styles.dshIcono}>⚙️</span>
            <span style={styles.nombre}>DSH</span>
          </button>
        )}
      </div>
      {/* Estilo para ocultar scrollbar manteniendo funcionalidad */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
        div {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    overflowX: 'auto',
    gap: '8px',
    padding: '10px 12px',
    background: 'rgba(20, 10, 10, 0.85)', // Un poco más opaco para legibilidad
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,215,0,0.15)',
    position: 'sticky',
    top: 0, // Ajustado para que pegue al tope si el padre lo permite
    zIndex: 100,
    scrollBehavior: 'smooth',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    fontSize: '0.85rem',
    fontWeight: '500',
    flexShrink: 0,
    outline: 'none',
  },
  tabActivo: {
    background: 'rgba(255, 215, 0, 0.15)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.5)',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.05)',
  },
  icono: {
    fontSize: '1rem',
  },
  nombre: {
    fontSize: '0.75rem',
  },
  dshTab: {
    background: 'rgba(0, 168, 107, 0.1)',
    color: '#00ffd9',
    border: '1px solid rgba(0, 255, 217, 0.3)',
    marginLeft: '12px',
  },
  dshIcono: {
    fontSize: '0.9rem',
  },
};
