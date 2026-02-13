import React, { useState } from 'react';

export default function ManageItemsDrawer({ open, onClose, menuItems, onSaveMenu }) {
  const [newItem, setNewItem] = useState({ nombre: '', precio: '', region: '', historia: '' });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemFinal = { 
      ...newItem, 
      id: Date.now(), 
      precio: parseFloat(newItem.precio),
      opciones: [] 
    };
    onSaveMenu([...menuItems, itemFinal]);
    setNewItem({ nombre: '', precio: '', region: '', historia: '' });
    alert("✅ Plato añadido al menú");
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer">
        <button className="close-btn" onClick={onClose}>Cerrar</button>
        <h2>📦 Gestión de Inventario</h2>
        <form onSubmit={handleSubmit} className="edit-item-block">
          <input placeholder="Nombre del plato" value={newItem.nombre} onChange={e => setNewItem({...newItem, nombre: e.target.value})} required />
          <input type="number" step="0.01" placeholder="Precio ($)" value={newItem.precio} onChange={e => setNewItem({...newItem, precio: e.target.value})} required />
          <input placeholder="Región" value={newItem.region} onChange={e => setNewItem({...newItem, region: e.target.value})} />
          <button type="submit" className="save-btn">Añadir al Menú</button>
        </form>
        <div className="items-list" style={{marginTop: '20px'}}>
          <h3>Platos en carta ({menuItems.length})</h3>
          {menuItems.map(item => (
            <div key={item.id} style={{padding: '8px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
              <span>{item.nombre}</span>
              <b>${item.precio.toFixed(2)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
