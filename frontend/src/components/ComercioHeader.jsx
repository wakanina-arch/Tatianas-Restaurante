import React from 'react';

export default function ComercioHeader({ comercio }) {
  console.log("🖼️ Imagen en Header:", comercio?.imagen);
  
  return (
    <div style={styles.container}>
      <img 
        src={comercio?.imagen} 
        alt={comercio?.nombre}
        style={styles.imagen}
        // Sin onError que cambie la imagen
      />
      <div style={styles.overlay} />
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    backgroundColor: '#2a1414', // color de respaldo
  },
  imagen: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
  },
};