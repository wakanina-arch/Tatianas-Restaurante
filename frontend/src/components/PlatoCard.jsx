import React, { useState } from 'react';

export default function PlatoCard({ plato, onUpdateCart }) {
  const [cantidad, setCantidad] = useState(0);
  const precio = plato.opciones?.[0]?.precio || plato.precio || 0;
  const imagen = plato.imagenes?.[0] || plato.imagen || '/img/placeholder.jpg';

  const incrementar = () => {
    const nueva = cantidad + 1;
    setCantidad(nueva);
    onUpdateCart?.(plato, nueva);
  };

  const decrementar = () => {
    if (cantidad > 0) {
      const nueva = cantidad - 1;
      setCantidad(nueva);
      onUpdateCart?.(plato, nueva);
    }
  };

  const eliminar = () => {
    setCantidad(0);
    onUpdateCart?.(plato, 0);
  };

  return (
    <div style={styles.card}>
      <img src={imagen} alt={plato.nombre} style={styles.imagen} />
      <div style={styles.info}>
        <h3 style={styles.titulo}>{plato.nombre}</h3>
        <p style={styles.descripcion}>{plato.descripcion || plato.historia}</p>
        <div style={styles.fila}>
          <span style={styles.precio}>${precio.toFixed(2)}</span>
          
          {cantidad === 0 ? (
            <button onClick={incrementar} style={styles.botonSimple}>
              <span style={styles.masIcono}>+</span>
            </button>
          ) : (
            <div style={styles.botonCantidad}>
              <button onClick={eliminar} style={styles.botonAccion} title="Eliminar">🗑</button>
              {cantidad > 1 && (
                <button onClick={decrementar} style={styles.botonAccion}>-</button>
              )}
              <span style={styles.cantidad}>{cantidad}</span>
              <button onClick={incrementar} style={styles.botonAccion}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    gap: '12px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    margin: '8px 16px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,215,0,0.2)',
  },
  imagen: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titulo: {
    margin: '0 0 4px 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  descripcion: {
    margin: '0 0 8px 0',
    fontSize: '0.75rem',
    color: '#666',
    lineHeight: '1.3',
  },
  fila: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#FF8C42',
  },
  botonSimple: {
    background: 'transparent',
    border: '1px solid rgba(1, 64, 14, 0.3)',
    borderRadius: '30px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  masIcono: {
    fontSize: '1.2rem',
    color: '#01400e',
    fontWeight: '600',
  },
  botonCantidad: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(1, 64, 14, 0.08)',
    borderRadius: '30px',
    padding: '2px 4px',
  },
  botonAccion: {
    background: 'transparent',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#01400e',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  cantidad: {
    fontSize: '0.9rem',
    fontWeight: '600',
    minWidth: '24px',
    textAlign: 'center',
    color: '#01400e',
  },
};
