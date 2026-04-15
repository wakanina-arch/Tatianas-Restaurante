import React, { useState, useEffect } from 'react';
import uploadImageService from './services/uploadImageService';

const CATEGORIAS_FIJAS = ['Picoteo', 'Entrantes', 'Gourmets', 'Escuderos', 'Zombies', 'FastFurious', 'Postres', 'Bebidas'];

export default function EditMenuDrawer({ open, onClose, comercioId, menuItems, onSave }) {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandidas, setExpandidas] = useState({});

  // 1. Sincronizar categorías y asegurar que cada comercio tenga su "hoja"
  useEffect(() => {
    if (!open || !menuItems) return;
    const synced = CATEGORIAS_FIJAS.map((catNombre) => {
      const catExistente = menuItems.find(m => m.nombre === catNombre);
      return catExistente || { nombre: catNombre, opciones: [] };
    });
    setItems(synced);
  }, [open, menuItems]);

  if (!open) return null;

  // 2. Subida Directa a Cloudinary (Sin IndexedDB)
  const handleUploadPlato = async (catIdx, optIdx, file) => {
    if (!file) return;
    
    try {
      setSaving(true);
      setToast('☁️ Subiendo imagen a la nube...');
      
      const resultado = await uploadImageService.subirImagen(file, comercioId);
      
      // Actualizamos el estado con la URL real de Cloudinary
      setItems(prev => {
        const newItems = [...prev];
        const opciones = [...newItems[catIdx].opciones];
        opciones[optIdx] = { ...opciones[optIdx], imagen: resultado.url };
        newItems[catIdx] = { ...newItems[catIdx], opciones };
        return newItems;
      });

      setToast('✅ Imagen guardada correctamente');
    } catch (err) {
      setToast('❌ Error al subir imagen');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleAddPlato = (catIdx) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[catIdx].opciones.push({ nombre: '', precio: 0, imagen: '', descripcion: '' });
      return newItems;
    });
    setExpandidas(prev => ({ ...prev, [catIdx]: true }));
  };

  const handleGuardarTodo = async () => {
    setSaving(true);
    try {
      await onSave(items);
      setToast('✅ Menú actualizado');
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast('❌ Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.drawer}>
      <div style={S.header}>
        <button onClick={onClose} style={S.closeBtn}>✕</button>
        <h2 style={S.title}>Rejilla de Trabajo</h2>
        <button onClick={handleGuardarTodo} disabled={saving} style={S.saveBtn}>
          {saving ? '...' : 'Guardar'}
        </button>
      </div>

      <div style={S.content}>
        {items.map((cat, catIdx) => (
          <div key={cat.nombre} style={S.categoryCard}>
            <div onClick={() => setExpandidas(p => ({...p, [catIdx]: !p[catIdx]}))} style={S.catHeader}>
              <span>{cat.nombre}</span>
              <span>{expandidas[catIdx] ? '▼' : '▶'}</span>
            </div>
            
            {expandidas[catIdx] && (
              <div style={S.platosList}>
                {cat.opciones.map((plato, optIdx) => (
                  <div key={optIdx} style={S.platoItem}>
                    <div style={S.imgContainer}>
                      {plato.imagen ? (
                        <img src={plato.imagen} style={S.platoImg} alt="plato" />
                      ) : (
                        <div style={S.placeholderImg}>🖼️</div>
                      )}
                      <input 
                        type="file" 
                        onChange={(e) => handleUploadPlato(catIdx, optIdx, e.target.files[0])}
                        style={S.fileInput}
                      />
                    </div>
                    <div style={S.inputs}>
                      <input 
                        placeholder="Nombre" 
                        value={plato.nombre} 
                        onChange={e => {
                          const newItems = [...items];
                          newItems[catIdx].opciones[optIdx].nombre = e.target.value;
                          setItems(newItems);
                        }}
                        style={S.inputNombre}
                      />
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={plato.precio} 
                        onChange={e => {
                          const newItems = [...items];
                          newItems[catIdx].opciones[optIdx].precio = parseFloat(e.target.value);
                          setItems(newItems);
                        }}
                        style={S.inputPrecio}
                      />
                    </div>
                  </div>
                ))}
                <button onClick={() => handleAddPlato(catIdx)} style={S.addBtn}>+ Añadir Plato</button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}

const S = {
  drawer: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '450px', background: '#f8f9fa', zIndex: 4000, boxShadow: '-5px 0 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' },
  header: { padding: '20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' },
  content: { flex: 1, overflowY: 'auto', padding: '15px' },
  categoryCard: { background: '#fff', borderRadius: '15px', marginBottom: '10px', overflow: 'hidden', border: '1px solid #eee' },
  catHeader: { padding: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', background: '#fafafa' },
  platosList: { padding: '10px' },
  platoItem: { display: 'flex', gap: '10px', marginBottom: '15px', background: '#fdfdfd', padding: '10px', borderRadius: '10px' },
  imgContainer: { position: 'relative', width: '70px', height: '70px' },
  platoImg: { width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' },
  placeholderImg: { width: '70px', height: '70px', borderRadius: '8px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' },
  inputs: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' },
  inputNombre: { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '0.9rem' },
  inputPrecio: { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', width: '80px' },
  addBtn: { width: '100%', padding: '10px', background: 'none', border: '1px dashed #ccc', borderRadius: '10px', cursor: 'pointer', color: '#666' },
  saveBtn: { background: '#FF4500', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  toast: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '10px 25px', borderRadius: '30px', fontSize: '0.9rem', zIndex: 5000 }
};
