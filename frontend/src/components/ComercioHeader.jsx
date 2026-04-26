import React from 'react';

export default function ComercioHeader({ comercio }) {
  return (
    <div style={styles.container}>
      <img 
        src={comercio?.imagen} 
        alt={comercio?.nombre}
        style={styles.imagen}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x200/2a1414/FFD700?text=' + encodeURIComponent(comercio?.nombre || 'Comercio');
        }}
      />
      <div style={styles.overlay} />
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '180px',          // ← Altura reducida
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',        // ← Ajusta al contenedor
    objectPosition: 'center',  // ← Centrada
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
  },
};