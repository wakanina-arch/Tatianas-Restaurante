import React from 'react';

export default function BottomBar({ platoSeleccionado, onAddToCart, onCancel }) {
  const precio = platoSeleccionado?.opciones?.[0]?.precio || platoSeleccionado?.precio || 0;

  if (!platoSeleccionado) return null;

  return (
    <div style={styles.container}>
      <button onClick={onCancel} style={styles.botonVolver}>
        ← Volver
      </button>
      <button onClick={onAddToCart} style={styles.botonAñadir}>
        Añadir al Carrito • ${precio.toFixed(2)}
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(20, 10, 10, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,215,0,0.2)',
    zIndex: 100,
  },
  botonVolver: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: '30px',
    color: '#FFD700',
    fontWeight: '600',
    cursor: 'pointer',
  },
  botonAñadir: {
    flex: 2,
    padding: '12px',
    background: 'linear-gradient(135deg, #FFD700, #FF4500)',
    border: 'none',
    borderRadius: '30px',
    color: '#1a1a1a',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
