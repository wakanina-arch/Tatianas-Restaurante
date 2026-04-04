import React, { useEffect, useRef } from 'react';

export default function CategoriaTabs({ categorias, categoriaActiva, onSelectCategoria, setCurrentPage, user }) {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    // Auto-scroll del tab activo hacia el centro del contenedor
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;
      
      const containerLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const activeTabLeft = activeTab.offsetLeft;
      const activeTabWidth = activeTab.offsetWidth;
      
      // Calcular para centrar el tab activo
      const scrollTarget = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);
      
      container.scrollTo({
        left: scrollTarget,
        behavior: 'smooth'
      });
    }
  }, [categoriaActiva]);
  return (
    <div style={styles.container} ref={containerRef}>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          ref={categoriaActiva === cat.id ? activeTabRef : null}
          onClick={() => onSelectCategoria(cat.id)}
          style={{
            ...styles.tab,
            ...(categoriaActiva === cat.id ? styles.tabActivo : {}),
          }}
        >
          <span style={styles.icono}>{cat.icono}</span>
          <span style={styles.nombre}>{cat.nombre}</span>
        </button>
      ))}
      
      {/* DSH Button - Last position */}
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
  );
}

const styles = {
  container: {
    display: 'flex',
    overflowX: 'auto',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(20, 10, 10, 0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,215,0,0.15)',
    position: 'sticky',
    top: '60px',
    zIndex: 15,
    scrollBehavior: 'smooth',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    fontSize: '0.85rem',
    fontWeight: '500',
    position: 'relative',
  },
  tabActivo: {
    background: 'rgba(255, 215, 0, 0.15)',
    color: '#FFD700',
    border: '1px solid rgb(255,215,0,0.3)',
    fontWeight: '700',
    position: 'relative',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
  },
  icono: {
    fontSize: '1.1rem',
  },
  nombre: {
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  dshTab: {
    background: 'rgba(0, 168, 107, 0.1)',
    color: '#00ffd9',
    border: '1px solid rgba(0, 255, 217, 0.3)',
    fontWeight: '600',
    marginLeft: 'auto',
    boxShadow: 'none',
    transition: 'all 0.2s ease',
  },
  dshIcono: {
    fontSize: '1rem',
  },
};
