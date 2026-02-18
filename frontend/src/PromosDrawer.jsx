import React, { useState } from 'react';

export default function PromosDrawer({ open, onClose, menuItems, onSaveMenu }) {
  const [promoItem, setPromoItem] = useState({ 
    id_plato: '', 
    descuento: 0, 
    tipo_promo: 'Flash', // El "Estado" Kanban: Flash, Estudiantil, Pack
    mensaje: '' 
  });

  if (!open) return null;

  const aplicarOferta = (e) => {
    e.preventDefault();
    
    // Buscamos el plato y le aplicamos la "cirugía" del precio
    const menuActualizado = menuItems.map(item => {
      if (item.id === parseInt(promoItem.id_plato)) {
        const nuevoPrecio = item.precio * (1 - promoItem.descuento / 100);
        return { 
          ...item, 
          precioOferta: nuevoPrecio, 
          enOferta: true,
          tagPromo: promoItem.tipo_promo,
          descuentoAplicado: promoItem.descuento 
        };
      }
      return item;
    });

    onSaveMenu(menuActualizado);
    alert(`🔥 ¡Oferta ${promoItem.tipo_promo} aplicada con éxito!`);
    onClose();
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer promo-style">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 style={{color: 'var(--selva-deep)'}}>📢 Panel de Promociones One To One</h2>
        
        <form onSubmit={aplicarOferta} className="edit-item-block">
          <label>Seleccionar Plato:</label>
          <select 
            value={promoItem.id_plato} 
            onChange={e => setPromoItem({...promoItem, id_plato: e.target.value})}
            required
          >
            <option value="">-- Elige un plato para la promo --</option>
            {menuItems.map(item => (
              <option key={item.id} value={item.id}>{item.nombre} (${item.precio})</option>
            ))}
          </select>

          <label>Descuento Estudiantil (%):</label>
          <input 
            type="number" 
            placeholder="Ej: 20" 
            value={promoItem.descuento} 
            onChange={e => setPromoItem({...promoItem, descuento: e.target.value})} 
            required 
          />

          <label>Estado de Promoción (Kanban):</label>
          <select 
            value={promoItem.tipo_promo} 
            onChange={e => setPromoItem({...promoItem, tipo_promo: e.target.value})}
          >
            <option value="Flash">⚡ Oferta Flash (Solo ahora)</option>
            <option value="Estudiantil">🎓 Especial Universitario</option>
            <option value="Pack">📦 Combo Ahorro</option>
          </select>

          <button type="submit" className="save-btn" style={{background: 'var(--papaya-primary)'}}>
            Activar Promoción
          </button>
        </form>

        <div className="items-list" style={{marginTop: '20px'}}>
          <h3 style={{color: 'var(--selva-deep)'}}>Lista de Precios Actualizada</h3>
          {menuItems.map(item => (
            <div key={item.id} className="promo-item-row">
              <span>{item.nombre}</span>
              <div style={{display: 'flex', gap: '10px'}}>
                {item.enOferta && <span className="tag-promo">{item.tagPromo}</span>}
                <b style={{color: item.enOferta ? 'var(--papaya-primary)' : 'inherit'}}>
                  ${item.precioOferta ? item.precioOferta.toFixed(2) : item.precio.toFixed(2)}
                </b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
