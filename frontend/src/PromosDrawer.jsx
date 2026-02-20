import React, { useState, useEffect } from 'react';

export default function PromosDrawer({ open, onClose, menuItems, onSaveMenu }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [promoData, setPromoData] = useState({
  descuento: 0,
  tag: 'DESPIERTA' // ← Valor inicial por defecto
});

// Resetear selección al cerrar - AHORA MANTIENE EL TAG
useEffect(() => {
  if (!open) {
    setSelectedItemId('');
    // 👇 SOLO RESETEAMOS EL DESCUENTO, EL TAG SE MANTIENE
    setPromoData(prev => ({ ...prev, descuento: 0 }));
  }
}, [open]);

  if (!open) return null;

  // --- 1. FUNCIÓN PARA APLICAR PROMOCIÓN (CORREGIDA) ---
  const handleGuardarPromo = () => {
    if (!selectedItemId) {
      alert("Selecciona un plato primero");
      return;
    }

    // Validar que el descuento sea un número válido
    const descuento = parseInt(promoData.descuento);
    if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
      alert("Ingresa un descuento válido entre 1 y 100");
      return;
    }

    const nuevoMenu = menuItems.map(item => {
      if (item.id === parseInt(selectedItemId)) {
        return {
          ...item,
          enOferta: true,
          descuentoAplicado: descuento,
          tagPromo: promoData.tag.toUpperCase(), // La "Palabra" (OFERTA, 2x1, etc)
          // Guardamos el precio original si no existe
          precioOriginal: item.precioOriginal || item.precio,
          // Calculamos el precio con descuento
          precio: item.precio * (1 - descuento / 100)
        };
      }
      return item;
    });

    console.log('🎯 Promoción aplicada:', nuevoMenu.find(i => i.id === parseInt(selectedItemId)));
    onSaveMenu(nuevoMenu);
    alert("¡Promoción activada en el Menú! 🚀");
    
    // Limpiar selección después de guardar
    setSelectedItemId('');
    setPromoData(prev => ({ ...prev, descuento: 0 }));
  };

  // --- 2. FUNCIÓN PARA ELIMINAR PROMO (MEJORADA) ---
  const handleEliminarPromo = (id) => {
    const nuevoMenu = menuItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          enOferta: false,
          descuentoAplicado: 0,
          tagPromo: '',
          // Restauramos el precio original
          precio: item.precioOriginal || item.precio,
          precioOriginal: undefined
        };
      }
      return item;
    });
    
    onSaveMenu(nuevoMenu);
    alert(`✅ Promoción eliminada de ${menuItems.find(i => i.id === id)?.nombre}`);
  };

  return (
    <div className="drawer-backdrop" style={drawerBackdropStyle}>
      <div className="drawer" style={drawerStyle}>
        
        {/* Botón cerrar */}
        <button className="close-btn" onClick={onClose} style={closeBtnStyle}>×</button>

        <h2 style={{ color: 'var(--selva-deep)', marginBottom: '1.5rem', fontFamily: 'Fraunces' }}>
          Configurador de Ofertas
        </h2>

        {/* FORMULARIO DE PROMOCIÓN */}
        <div style={formGroup}>
          <label>Seleccionar Plato:</label>
          <select 
            style={inputStyle} 
            value={selectedItemId} 
            onChange={(e) => setSelectedItemId(e.target.value)}
          >
            <option value="">-- Elige un plato --</option>
            {menuItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.nombre} {item.enOferta ? '🔥' : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroup}>
          <label>Descuento (%):</label>
          <input 
            type="number" 
            min="1"
            max="100"
            style={inputStyle} 
            value={promoData.descuento}
            onChange={(e) => setPromoData({...promoData, descuento: e.target.value})}
          />
        </div>

        <div style={formGroup}>
          <label>Etiqueta de Oferta (Ej: OFERTA, 2x1, ESPECIAL):</label>
          <input 
            type="text" 
            style={inputStyle} 
            placeholder="Promos..."
            value={promoData.tag}
            onChange={(e) => setPromoData({...promoData, tag: e.target.value})}
          />
        </div>

        <button 
          onClick={handleGuardarPromo}
          style={btnActivarStyle}
          onMouseEnter={(e) => e.target.style.background = '#e67e22'}
          onMouseLeave={(e) => e.target.style.background = '#cd7006'}
        >
          🚀 Activar Promoción
        </button>

        <hr style={{margin: '2rem 0', opacity: 0.2}} />

        {/* LISTA DE PROMOCIONES ACTIVAS */}
        <h4 style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
          Promociones en Curso:
        </h4>
        
        <div style={{flex: 1, overflowY: 'auto', maxHeight: '300px'}}>
          {menuItems.filter(i => i.enOferta).length > 0 ? (
            menuItems.filter(i => i.enOferta).map(item => (
              <div key={item.id} style={promoCardStyle}>
                <div style={{flex: 1}}>
                  <span style={{fontWeight: 'bold'}}>{item.nombre}</span>
                  <div style={{fontSize: '0.8rem', color: '#666', marginTop: '4px'}}>
                    <span style={tagBadgeStyle}>🏷️ {item.tagPromo}</span>
                    <span style={discountBadgeStyle}>-{item.descuentoAplicado}%</span>
                  </div>
                </div>
                <button
                  onClick={() => handleEliminarPromo(item.id)}
                  style={btnEliminarStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ff6b81';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ff4757';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Eliminar promoción"
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p style={{textAlign: 'center', color: '#999', padding: '1rem'}}>
              No hay promociones activas
            </p>
          )}
        </div>

        {/* NOTA INFORMATIVA */}
        <p style={footerNoteStyle}>
          <span style={{fontSize: '1rem', marginRight: '5px'}}>🔥</span>
          Las promociones aparecerán junto al nombre del plato
        </p>
      </div>
    </div>
  );
}

// --- 🎨 ESTILOS ---
const drawerBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'flex-end',
  backdropFilter: 'blur(4px)'
};

const drawerStyle = {
  width: '400px',
  background: 'white',
  height: '100%',
  padding: '2rem',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-5px 0 20px rgba(0,0,0,0.1)',
  overflowY: 'auto'
};

const closeBtnStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '2rem',
  cursor: 'pointer',
  color: '#999',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'all 0.3s'
};

const formGroup = {
  marginBottom: '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontFamily: 'Montserrat',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border 0.3s'
};

const btnActivarStyle = {
  background: '#cd7006',
  color: 'white',
  border: 'none',
  padding: '14px',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.3s',
  marginTop: '10px'
};

const promoCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  background: '#f9f9f9',
  borderRadius: '8px',
  marginBottom: '8px',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s'
};

const btnEliminarStyle = {
  background: '#ff4757',
  border: '2px solid white',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(255,71,87,0.3)',
  transition: 'all 0.2s',
  border: 'none'
};

const tagBadgeStyle = {
  background: '#f0f0f0',
  padding: '4px 8px',
  borderRadius: '4px',
  marginRight: '8px',
  color: '#cd7006',
  fontWeight: '600'
};

const discountBadgeStyle = {
  background: '#ff4757',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: '600'
};

const footerNoteStyle = {
  marginTop: '1.5rem',
  fontSize: '0.8rem',
  color: '#999',
  textAlign: 'center',
  borderTop: '1px dashed #ddd',
  paddingTop: '1rem'
};