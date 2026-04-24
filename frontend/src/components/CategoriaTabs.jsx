import React, { useEffect, useRef } from 'react';

export default function CategoriaTabs({ categorias, categoriaActiva, onSelectCategoria, setCurrentPage, user }) {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const timer = setTimeout(() => {
        const container = containerRef.current;
        const activeTab = activeTabRef.current;
        
        if (!container || !activeTab) return;

        const containerWidth = container.clientWidth;
        const activeTabLeft = activeTab.offsetLeft;
        const activeTabWidth = activeTab.offsetWidth;
        
        const scrollTarget = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, scrollTarget),
          behavior: 'smooth'
        });
      }, 40);

      return () => clearTimeout(timer);
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
      <style>{`
        div::-webkit-scrollbar { display: none; }
        div { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

const styles = {
  container: {
  display: 'flex',
  overflowX: 'auto',
  gap: '6px',
  padding: '8px 10px',
  background: 'rgba(20, 10, 10, 0.55)',   // ← Más transparente (antes 0.85)
  backdropFilter: 'blur(20px)',             // ← Efecto esmerilado
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 215, 0, 0.12)', // ← Borde más sutil
  position: 'sticky',
  top: 0,
  zIndex: 100,
  scrollBehavior: 'smooth',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
},
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    fontSize: '0.8rem',
    fontWeight: '500',
    flexShrink: 0,
    outline: 'none',
  },
  tabActivo: {
    background: 'rgba(255, 215, 0, 0.15)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.5)',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.02)',
  },
  icono: {
    fontSize: '0.9rem',
  },
  nombre: {
    fontSize: '0.7rem',
  },
  dshTab: {
    background: 'rgba(0, 168, 107, 0.1)',
    color: '#00ffd9',
    border: '1px solid rgba(0, 255, 217, 0.3)',
    marginLeft: '8px',
  },
  dshIcono: {
    fontSize: '0.8rem',
  },
};