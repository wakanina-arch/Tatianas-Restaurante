import React from 'react';

export default function ComercioHeader({ comercio }) {
  return (
    <div style={styles.container}>
      <img 
        src={comercio?.imagen} 
        alt={comercio?.nombre}
        style={styles.imagen}
      />
      <div style={styles.overlay} />
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '240px',
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
  },
};
