import React from 'react';

export default function CategoriaTabs({ categorias, categoriaActiva, onSelectCategoria }) {
  return (
    <div style={styles.container}>
      {categorias.map((cat) => (
        <button
          key={cat.id}
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
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    overflowX: 'auto',
    gap: '4px',
    padding: '8px 12px',
    background: 'rgba(20, 10, 10, 0.75)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,215,0,0.1)',
    position: 'sticky',
    top: '200px',  // Ajusta según la altura de la imagen del comercio
    zIndex: 15,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '30px',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    fontSize: '0.8rem',
  },
  tabActivo: {
    background: 'rgba(255,215,0,0.15)',
    color: '#FFD700',
    borderBottom: '1px solid #FFD700',
  },
  icono: {
    fontSize: '1rem',
  },
  nombre: {
    fontSize: '0.7rem',
    fontWeight: '500',
  },
};
