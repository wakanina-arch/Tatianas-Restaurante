import React, { useState } from 'react';

export default function PlatoCard({ plato, onUpdateCart }) {
  const [added, setAdded] = useState(false);
  const precio = plato.precio || 0;
  const imagen = plato.imagen || plato.imagenes?.[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ESin imagen%3C/text%3E%3C/svg%3E';

  const handleAdd = () => {
    setAdded(true);
    onUpdateCart?.(plato, 1);
    setTimeout(() => setAdded(false), 600);
  };

  return (
    <div style={styles.card}>
      <img src={imagen} alt={plato.nombre} style={styles.imagen} />
      <div style={styles.info}>
        <h3 style={styles.titulo}>{plato.nombre}</h3>
        <p style={styles.descripcion}>{plato.descripcion || 'Deliciosa opción para tu paladar'}</p>
        <div style={styles.fila}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={styles.precio}>${precio.toFixed(2)}</span>
            {plato.enOferta && (
              <span style={styles.badgePromo}>
                -{plato.descuentoAplicado}% {plato.tagPromo}
              </span>
            )}
          </div>
          <button onClick={handleAdd} style={{
            ...styles.botonAdd,
            background: added ? '#00c805' : 'transparent',
            color: added ? 'white' : '#01400e',
            transform: added ? 'scale(1.1)' : 'scale(1)',
          }}>
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    padding: '2px 8px',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)',
    color: '#e0e0e0',
    borderRadius: '3px 10px 3px 10px',
    fontSize: '0.55rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    boxShadow: '0 0 12px rgba(138, 43, 226, 0.4), 0 0 0 1px rgba(138, 43, 226, 0.2) inset',
    border: '1px solid rgba(138, 43, 226, 0.3)',
    textShadow: '0 0 6px rgba(255, 255, 255, 0.3)',
    whiteSpace: 'nowrap',
    animation: 'fogPulse 3s ease-in-out infinite',
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