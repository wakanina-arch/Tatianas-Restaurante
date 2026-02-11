import React, { useState } from 'react';

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  const [items, setItems] = useState(menuItems);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleOptionChange = (itemIdx, optIdx, field, value) => {
    const updated = [...items];
    updated[itemIdx].opciones[optIdx] = {
      ...updated[itemIdx].opciones[optIdx],
      [field]: value
    };
    setItems(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Aquí deberías hacer la petición real al backend
      // Por ejemplo, suponiendo que tienes el id del menú diario:
      // await fetch(`/api/menus/${menuId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platos: items }) });
      onSave(items); // Actualiza el estado en el padre
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="drawer-backdrop">
      <div className="drawer">
        <h2>Editar Menú Diario</h2>
        <button className="close-btn" onClick={onClose}>Cerrar</button>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          {items.map((item, idx) => (
            <div key={item.id} className="edit-item-block">
              <label>Nombre:
                <input value={item.nombre} onChange={e => handleChange(idx, 'nombre', e.target.value)} />
              </label>
              <label>Precio:
                <input type="number" value={item.precio} onChange={e => handleChange(idx, 'precio', parseFloat(e.target.value))} />
              </label>
              <div className="edit-options">
                <span>Opciones:</span>
                {item.opciones && item.opciones.map((opt, oidx) => (
                  <div key={oidx} className="edit-option-block">
                    <input value={opt.nombre} onChange={e => handleOptionChange(idx, oidx, 'nombre', e.target.value)} />
                    <input type="number" value={opt.calorias} onChange={e => handleOptionChange(idx, oidx, 'calorias', parseInt(e.target.value))} placeholder="Calorías" />
                    <input type="number" value={opt.proteina} onChange={e => handleOptionChange(idx, oidx, 'proteina', parseInt(e.target.value))} placeholder="Proteína" />
                    <input type="number" value={opt.carbohidratos} onChange={e => handleOptionChange(idx, oidx, 'carbohidratos', parseInt(e.target.value))} placeholder="Carbohidratos" />
                    <input value={opt.descripcion} onChange={e => handleOptionChange(idx, oidx, 'descripcion', e.target.value)} placeholder="Descripción" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="save-btn" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</button>
          {success && <div style={{color: 'green', marginTop: 10}}>¡Cambios guardados!</div>}
          {error && <div style={{color: 'red', marginTop: 10}}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
