import React, { useState } from 'react';

export default function PlatoCard({ plato, onUpdateCart }) {
  const [cantidad, setCantidad] = useState(0);
  
  const precio = plato.precio || 0;
  const imagen = plato.imagen || plato.imagenes?.[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ESin imagen%3C/text%3E%3C/svg%3E';
  const s = document.createElement('style');
s.id = 'fog-pulse-style';
s.textContent = `
  @keyframes fogPulse {
    0% { 
      /* Sombra negra traslúcida, derrame corto */
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); 
      border-color: rgba(255, 255, 255, 0.05);
    }
    50% { 
      /* Derrame más largo y suave, como humo gris */
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4); 
      border-color: rgba(255, 255, 255, 0.15);
    }
    100% { 
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); 
      border-color: rgba(255, 255, 255, 0.05);
    }
  }
`;
if (!document.getElementById('fog-pulse-style')) {
  document.head.appendChild(s);
}


  const actualizarCantidad = (nueva) => {
  setCantidad(nueva);
  onUpdateCart?.({
    id: plato.id || plato.nombre,  // ← ID FIJO (sin Date.now)
    nombre: plato.nombre,
    precio: plato.precio,
    precioOriginal: plato.precioOriginal || plato.precio,  // ← AÑADIR
    enOferta: plato.enOferta || false,                      // ← AÑADIR
    descuentoAplicado: plato.descuentoAplicado || 0,        // ← AÑADIR
    tagPromo: plato.tagPromo || '',                         // ← AÑADIR
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={styles.precio}>${precio.toFixed(2)}</span>
            
            {/* 🏷️ TAG DE PROMOCIÓN INFORMATIVO */}
            {plato.enOferta && (
  <div style={styles.badgePromo}>
    <span style={{ filter: 'grayscale(1) brightness(0.8)', fontSize: '0.9rem' }}>†</span>
    
    {/* EL DATO CLAVE: El porcentaje con un brillo sutil */}
    <span style={styles.cifraMistica}>{plato.descuentoAplicado}%</span>
    
    <span style={{ textShadow: '0 0 8px rgba(138, 43, 226, 0.6)', flex: 1 }}>
      {plato.tagPromo}
    </span>
    
    <span style={{ color: '#8a2be2', fontSize: '0.7rem', fontWeight: 'bold' }}>🔱</span>
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
                <button onClick={() => actualizarCantidad(cantidad - 1)} style={styles.botonAccion}>-</button>
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
  /* ESTILO DEL CARMELITO INFORMATIVO */
badgePromo: {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px',
  background: 'rgba(153, 153, 161, 0.6)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  color: '#f6eeee',
  borderRadius: '4px 14px 4px 14px',
  fontSize: '0.65rem',
  fontWeight: '700',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  whiteSpace: 'nowrap',
},
cifraMistica: {
  fontWeight: '700',
  fontSize: '0.8rem',
  color: '#01400e',
  textShadow: '0 0 8px rgba(162, 155, 254, 0.5)',
  letterSpacing: '-0.2px',
  marginRight: '2px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cantidad: {
    fontSize: '0.9rem',
    fontWeight: '600',
    minWidth: '24px',
    textAlign: 'center',
    color: '#01400e',
  },
};
