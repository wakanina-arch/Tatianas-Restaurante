import React, { useEffect, useRef } from 'react';

export default function CategoriaTabs({ categorias, categoriaActiva, onSelectCategoria, setCurrentPage, user }) {
  const containerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    // 1. Mejora en el cálculo: Usamos scrollLeft con el offset del contenedor
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;
      
      // Calculamos la posición relativa del tab dentro del contenedor
      const activeTabLeft = activeTab.offsetLeft;
      const activeTabWidth = activeTab.offsetWidth;
      const containerWidth = container.clientWidth;
      
      // El objetivo es que el centro del tab coincida con el centro del contenedor
      const scrollTarget = activeTabLeft - (containerWidth / 2) + (activeTabWidth / 2);
      
      container.scrollTo({
        left: scrollTarget,
        behavior: 'smooth'
      });
    }
  }, [categoriaActiva]);

  return (
    <>
      <div style={styles.container} ref={containerRef}>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            // Importante: Solo el botón activo recibe la referencia
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
        
        {user?.rol === 'admin_restaurante' && setCurrentPage && (
          <button
            onClick={() => setCurrentPage('admin')}
            style={{...styles.tab, ...styles.dshTab}}
          >
            <span style={styles.dshIcono}>⚙️</span>
            <span style={styles.nombre}>DSH</span>
          </button>
        )}
      </div>
      {/* Ocultamos scrollbar manteniendo funcionalidad */}
      <style>{`
        #tabs-container::-webkit-scrollbar { display: none; }
        #tabs-container { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    overflowX: 'auto',
    gap: '10px', // Un poco más ajustado para minimalismo
    padding: '12px 16px',
    background: 'rgba(15, 15, 15, 0.8)', // Más oscuro para que resalte el dorado
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    position: 'sticky',
    top: '0', // Asegúrate de que coincida con tu header
    zIndex: 100,
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch', // Scroll suave en iOS
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    flexShrink: 0, // CRITICO: Evita que el texto se amontone en móvil
    outline: 'none',
  },
  tabActivo: {
    background: 'rgba(255, 215, 0, 0.12)',
    color: '#FFD700',
    borderColor: 'rgba(255, 215, 0, 0.4)',
    transform: 'scale(1.05)', // Pequeño efecto de realce
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  icono: { fontSize: '1rem' },
  nombre: { fontSize: '0.85rem', fontWeight: '600' },
  dshTab: {
    background: 'rgba(20, 20, 20, 0.5)',
    borderColor: '#00ffd933',
    color: '#00ffd9',
  },
  dshIcono: { fontSize: '0.9rem' }
};
