import React, { useState } from 'react';
import MediaCarousel from './MediaCarousel';

function MenuItem({ item, addToCart }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Opción seleccionada
  const selectedData = item.opciones?.find(o => o.nombre === selectedOption);
  const currentPrice = selectedData?.precio ?? 0;

  return (
    <div className="food-card">
      {/* CARRUSEL */}
      <div className="food-media" style={{ height: '280px' }}>
        {item.imagenes && item.imagenes.length > 0 ? (
          <MediaCarousel 
            items={item.imagenes.map(url => ({ url }))} 
          />
        ) : (
          <div style={styles.noImage}>🍽️ {item.nombre}</div>
        )}
      </div>

      {/* Información del plato */}
      <div className="food-info">
        <h2>{item.nombre}</h2>
        {/* Aquí va el resto del código que ya tenías: opciones, nutrición, etc */}
      </div>
    </div>
  );
}

const styles = {
  noImage: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ffb347, #ff6b35)',
    color: 'white',
    fontSize: '1.5rem'
  }
};

export default MenuItem;