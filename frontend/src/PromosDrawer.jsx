import React, { useState } from 'react';

export default function PromosDrawer({ open, onClose, menuItems, onSaveMenu }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [promoData, setPromoData] = useState({
    descuento: 0,
    tag: 'OFERTA' // Este es el que se une a tu App.jsx
  });

  if (!open) return null;

  // --- 1. FUNCIÓN PARA APLICAR O EDITAR ---
  const handleGuardarPromo = () => {
    if (!selectedItemId) return alert("Selecciona un plato primero");

    const nuevoMenu = menuItems.map(item => {
      if (item.id === parseInt(selectedItemId)) {
        return {
          ...item,
          enOferta: true,
          descuentoAplicado: parseInt(promoData.descuento),
          tagPromo: promoData.tag.toUpperCase() // Aquí vive la "Palabra" (OFER 10%, 2x1, etc)
        };
      }
      return item;
    });

    onSaveMenu(nuevoMenu);
    alert("¡Promoción activada en el Menú! 🚀");
  };

  // --- 2. FUNCIÓN PARA ELIMINAR PROMO (LIMPIEZA) ---
  const handleEliminarPromo = (id) => {
    const nuevoMenu = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, enOferta: false, descuentoAplicado: 0, tagPromo: '' };
      }
      return item;
    });
    onSaveMenu(nuevoMenu);
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer" style={drawerStyle}>
        
        {/* 1. BOTÓN (X) PARA QUITAR PESTAÑA */}
       <button className="close-btn" onClick={onClose}>×</button>

        <h2 style={{ color: 'var(--selva-deep)', marginBottom: '1.5rem', fontFamily: 'Fraunces' }}>
          Configurador de Ofertas
        </h2>

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
            style={inputStyle} 
            value={promoData.descuento}
            onChange={(e) => setPromoData({...promoData, descuento: e.target.value})}
          />
        </div>

        {/* 3. ESTADO EDITABLE (Etiqueta personalizada) */}
        <div style={formGroup}>
          <label>Tipos de Oferta (Ej: 2x1, OFER 10%):</label>
          <input 
            type="text" 
            style={inputStyle} 
            placeholder="OFERTA, 2X1, ESPECIAL..."
            value={promoData.tag}
            onChange={(e) => setPromoData({...promoData, tag: e.target.value})}
          />
        </div>

        <button type="submit" className="save-btn" style={{background: 'var(--papaya-primary)'}}>
            Activar Promoción
          </button>

        <hr style={{margin: '2rem 0', opacity: 0.2}} />

        {/* 2. LISTA PARA ELIMINAR PROMOCIONES ACTUALES */}
        <h4 style={{fontSize: '0.9rem', color: '#666'}}>Promociones en Curso:</h4>
        <div style={{flex: 1, overflowY: 'auto'}}>
          {menuItems.filter(i => i.enOferta).map(item => (
            <div key={item.id} style={{
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: '10px', 
  background: '#f9f9f9', 
  borderRadius: '8px', 
  marginBottom: '8px', 
  fontSize: '0.85rem'
            }}>
              
              <span>{item.nombre} (<b>{item.tagPromo}</b>)</span>
              {item.enOferta && (
                <button
                  onClick={() => handleEliminarPromo(item.id)}
                  style={{
                    background: '#f1f2f6',
                    color: '#ff4757',
                    border: '2px solid #ff4757',
                    padding: '10px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '5px'
                  }}
                >
                  🗑️ Quitar Promoción Actual
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---
const drawerStyle = { width: '400px', background: 'white', height: '100%', padding: '3rem 2rem', position: 'relative', display: 'flex', flexDirection: 'column' };
const closeXStyle = { position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#ccc' };
const formGroup = { marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '5px' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'Montserrat' };
const btnAplicarStyle = { background: 'var(--papaya-primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnEliminarStyle = { background: '#ff4757', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem' };
const activePromoCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '8px', fontSize: '0.85rem' };

