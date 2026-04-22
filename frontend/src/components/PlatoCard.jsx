import React, { useState } from 'react';

export default function PlatoCard({ plato, onUpdateCart }) {
  const [cantidad, setCantidad] = useState(0);
  
  const precio = plato.precio || 0;
  const imagen = plato.imagen || plato.imagenes?.[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ESin imagen%3C/text%3E%3C/svg%3E';

  const actualizarCantidad = (nueva) => {
    setCantidad(nueva);
    onUpdateCart?.({
      id: plato.id || plato.nombre,
      nombre: plato.nombre,
      precio: plato.precio,
      precioOriginal: plato.precioOriginal || plato.precio,
      enOferta: plato.enOferta || false,
      descuentoAplicado: plato.descuentoAplicado || 0,
      tagPromo: plato.tagPromo || '',
      cantidad: nueva,
      imagen: plato.imagen
    }, nueva);
  };

  return (
    <div style={styles.card}>
      <img src={imagen} alt={plato.nombre} style={styles.imagen} />
      <div style={styles.info}>
        <h3 style={styles.titulo}>{plato.nombre}</h3>
        <p style={styles.descripcion}>{plato.descripcion || 'Deliciosa opción para tu paladar'}</p>
        
        <div style={styles.fila}>
          <div style={styles.precioContainer}>
            <span style={styles.precio}>${precio.toFixed(2)}</span>
            
            {/* 🏷️ TAG DE PROMOCIÓN NANO PLUS */}
            {plato.enOferta && (
              <div style={styles.badgePromo}>
                <span style={styles.cifraMistica}>{plato.descuentoAplicado}%</span>
                <span style={styles.tagPromoTexto}>{plato.tagPromo}</span>
                <span style={styles.tridenteIcono}>🔱</span>
              </div>
            )}
          </div>
          
          {cantidad === 0 ? (
            <button onClick={() => actualizarCantidad(1)} style={styles.botonSimple}>
              <span style={styles.masIcono}>+</span>
            </button>
          ) : (
            <div style={styles.botonCantidad}>
              <button onClick={() => actualizarCantidad(0)} style={styles.botonAccion} title="Eliminar">🗑</button>
              {cantidad > 1 && (
                <button onClick={() => actualizarCantidad(cantidad - 1)} style={styles.botonAccion}>−</button>
              )}
              <span style={styles.cantidad}>{cantidad}</span>
              <button onClick={() => actualizarCantidad(cantidad + 1)} style={styles.botonSimple}>
                <span style={styles.masIcono}>+</span>
              </button>
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
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '18px',
    margin: '10px 14px',
    padding: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255, 215, 0, 0.12)',
  },
  imagen: {
    width: '70px',
    height: '70px',
    borderRadius: '12px',
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
    margin: '0 0 3px 0',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1a1a1a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  descripcion: {
    margin: '0 0 6px 0',
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
    alignItems: 'flex-end',
    gap: '6px',
  },
  precioContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
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
    padding: '2px 5px',
    background: 'rgba(153, 153, 161, 0.45)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    color: '#f6eeee',
    borderRadius: '3px 7px 3px 7px',
    fontSize: '0.5rem',
    fontWeight: '600',
    letterSpacing: '0.2px',
    textTransform: 'uppercase',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(138, 43, 226, 0.12)',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    maxWidth: '100%',
  },
  cifraMistica: {
    fontWeight: '700',
    fontSize: '0.6rem',
    color: '#01400e',
    textShadow: '0 0 3px rgba(162, 155, 254, 0.3)',
    letterSpacing: '-0.1px',
  },
  tagPromoTexto: {
    fontSize: '0.5rem',
    fontWeight: '500',
    textShadow: '0 0 4px rgba(138, 43, 226, 0.4)',
  },
  tridenteIcono: {
    color: '#8a2be2',
    fontSize: '0.6rem',
    fontWeight: 'bold',
  },
  botonSimple: {
    background: 'transparent',
    border: '1px solid rgba(1, 64, 14, 0.25)',
    borderRadius: '22px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  masIcono: {
    fontSize: '1rem',
    color: '#01400e',
    fontWeight: '600',
  },
  botonCantidad: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: 'rgba(1, 64, 14, 0.05)',
    borderRadius: '22px',
    padding: '1px 2px',
  },
  botonAccion: {
    background: 'transparent',
    border: 'none',
    fontSize: '0.85rem',
    cursor: 'pointer',
    color: '#01400e',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cantidad: {
    fontSize: '0.8rem',
    fontWeight: '600',
    minWidth: '18px',
    textAlign: 'center',
    color: '#01400e',
  },
};