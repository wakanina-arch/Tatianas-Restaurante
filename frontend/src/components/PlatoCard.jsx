import React, { useState } from 'react';

export default function PlatoCard({ plato, onUpdateCart }) {
  const [added, setAdded] = useState(false);
  
  // Limpieza de datos y color naranja corporativo
  const precio = Number(plato.precio) || 0;
  const COLOR_NARANJA = '#FF8C42'; 
  
  // Fallback para Cloudinary y locales
  const imagen = plato.imagen || (plato.opciones && plato.opciones?.imagen) || 'https://placeholder.com';

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    onUpdateCart?.(plato, 1);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <div style={styles.card}>
      {/* Imagen alineada a la izquierda según tu preferencia */}
      <div style={styles.containerImagen}>
        <img 
          src={imagen} 
          alt={plato.nombre} 
          style={styles.imagen}
          loading="lazy" 
          onError={(e) => { e.target.src = 'https://placeholder.com'; }}
        />
      </div>

      <div style={styles.info}>
        <h3 style={styles.titulo}>{plato.nombre}</h3>
        <p style={styles.descripcion}>
          {plato.descripcion || 'Deliciosa opción para tu paladar'}
        </p>
        
        <div style={styles.fila}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Precio en Naranja para coincidir con el resumen de compra */}
            <span style={{ ...styles.precio, color: COLOR_NARANJA }}>
              ${precio.toFixed(2)}
            </span>
            {plato.enOferta && (
              <span style={styles.badgePromo}>
                -{plato.descuentoAplicado}% {plato.tagPromo}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAdd} 
            style={{
              ...styles.botonAdd,
              background: added ? '#00c805' : 'transparent',
              borderColor: added ? '#00c805' : '#01400e',
              color: added ? 'white' : '#01400e',
              transform: added ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    gap: '14px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '18px',
    margin: '8px 10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255, 215, 0, 0.12)',
    alignItems: 'center',
  },
  containerImagen: {
    width: '75px',
    height: '75px',
    flexShrink: 0,
  },
  imagen: {
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    objectFit: 'cover',
    backgroundColor: '#f5f5f5'
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  titulo: {
    margin: '0 0 2px 0',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  descripcion: {
    margin: '0 0 6px 0',
    fontSize: '0.72rem',
    color: '#666',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  fila: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    fontSize: '1rem',
    fontWeight: '800',
  },
  badgePromo: {
    padding: '2px 6px',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '0.55rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  botonAdd: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
};
