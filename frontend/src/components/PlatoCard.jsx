import React, { useState } from 'react';

export default function PlatoCard({ plato, onUpdateCart }) {
  const [added, setAdded] = useState(false); // Efecto visual al añadir
  
  const precio = plato.precio || 0;
  const imagen = plato.imagen || plato.imagenes?.[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ESin imagen%3C/text%3E%3C/svg%3E';

  const handleAdd = () => {
    setAdded(true);
    onUpdateCart?.(plato, 1);
    setTimeout(() => setAdded(false), 600); // Efecto de "añadido"
  };

  return (
    <div style={styles.card}>
      <img src={imagen} alt={plato.nombre} style={styles.imagen} />
      <div style={styles.info}>
        <h3 style={styles.titulo}>{plato.nombre}</h3>
        <p style={styles.descripcion}>{plato.descripcion || 'Deliciosa opción para tu paladar'}</p>
        
        {/* 🎯 LÍNEA ÚNICA: Precio + Badge Promo + Botón Añadir */}
        <div style={styles.fila}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={styles.precio}>${precio.toFixed(2)}</span>
            
            {/* Badge de promo en la misma línea */}
            {plato.enOferta && (
              <span style={styles.badgePromo}>
                -{plato.descuentoAplicado}% {plato.tagPromo}
              </span>
            )}
          </div>
          
          {/* Botón Añadir con efecto */}
          <button 
            onClick={handleAdd} 
            style={{
              ...styles.botonAdd,
              background: added ? '#00c805' : 'transparent',
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
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '18px',
    margin: '6px 8px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255, 215, 0, 0.12)',
  },
  imagen: {
    width: '70px',
    height: '70px',
    borderRadius: '7px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  titulo: {
    margin: '0 0 2px 0',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1a1a1a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  descripcion: {
    margin: '0 0 4px 0',
    fontSize: '0.7rem',
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
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#FF8C42',
    lineHeight: 1.2,
  },
  badgePromo: {
    fontSize: '0.6rem',
    fontWeight: '700',
    color: '#8a2be2',
    background: 'rgba(138, 43, 226, 0.08)',
    padding: '1px 5px',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
  },
  botonAdd: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1.5px solid #01400e',
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