import React, { useState, useEffect } from 'react';

export default function MediaCarousel({ items = [] }) {
  const [index, setIndex] = useState(0);

  // Si cambian los items (al marcar un checkbox), volvemos al primer plato
  useEffect(() => {
    setIndex(0);
  }, [items]);

  if (!items || items.length === 0) return (
    <div style={styles.carouselContainer}>
      <div style={styles.placeholder}>🍽️ Selecciona tu menú</div>
    </div>
  );

  return (
    <div style={styles.carouselContainer}>
      {/* IMAGEN ACTUAL */}
      <img 
        src={items[index].imagen || items[index].url} 
        style={styles.image}
        alt="Plato seleccionado"
        onError={(e) => e.target.src = 'https://via.placeholder.com'}
      />

      {/* CONTROLES FLOTANTES (Solo si hay más de 1 imagen) */}
      {items.length > 1 && (
        <>
          <button onClick={() => setIndex(i => (i - 1 + items.length) % items.length)} style={styles.navBtnLeft}>‹</button>
          <button onClick={() => setIndex(i => (i + 1) % items.length)} style={styles.navBtnRight}>›</button>
          
          {/* Indicador de posición */}
          <div style={styles.indicator}>
            {index + 1} / {items.length}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  carouselContainer: {
    position: 'relative',
    width: '100%',
    height: '380px', // Altura fija para que sea el protagonista
    borderRadius: '30px', // Bordes bien redondeados
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    background: '#1a1a1a',
    marginBottom: '30px', // 👈 ESPACIO DE CARPINTERÍA: Separa el carrusel de lo que venga debajo
    zIndex: 1
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  navBtnLeft: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 },
  navBtnRight: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 },
  indicator: { position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem' },
  placeholder: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'var(--verde-selva)' }
};
