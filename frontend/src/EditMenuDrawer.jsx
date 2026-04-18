import React, { useState, useEffect } from 'react';
import uploadImageService from './services/uploadImageService';
import { saveMenuBorrador } from './services/menuService';

const CATEGORIAS_FIJAS = ['Picoteo', 'Entrantes', 'Gourmets', 'Escuderos', 'Zombies', 'FastFurious', 'Postres', 'Bebidas'];

// --- 🪄 COMPONENTE MÁGICO PARA DECIMALES (ESTILO MINIMALISTA) ---
const InputPrecioDinamico = ({ valorInicial, onChangeFinal, disabled, style }) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    // Asegurar que se muestre el valor correcto incluso si es 0 o vacío
    if (valorInicial !== undefined && valorInicial !== null) {
      setLocalValue(valorInicial.toString());
    } else {
      setLocalValue('');
    }
  }, [valorInicial]);

  const handleChange = (e) => {
    let val = e.target.value;
    
    // 1. Reemplazar coma por punto
    val = val.replace(',', '.');
    
    // 2. Validar formato: números, un punto opcional, máximo 2 decimales
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setLocalValue(val);
      
      // 3. Convertir y notificar al padre
      if (val === '' || val === '.') {
        onChangeFinal(0); // Valor seguro
      } else {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          onChangeFinal(num);
        }
      }
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={localValue}
      onChange={handleChange}
      disabled={disabled}
      placeholder="0.00"
      style={style}
    />
  );
};

export default function EditMenuDrawer({ open, onClose, comercioId, menuItems, onSave }) {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandidas, setExpandidas] = useState({});

  // Estados para Ofertas
  const [showOfertaModal, setShowOfertaModal] = useState(false);
  const [ofertaData, setOfertaData] = useState({ descuento: '', tag: '' });
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);

  useEffect(() => {
    if (!open || !menuItems) return;
    const synced = CATEGORIAS_FIJAS.map((catNombre) => {
      const catExistente = menuItems.find(m => m.nombre === catNombre);
      return catExistente || { nombre: catNombre, opciones: [] };
    });
    setItems(synced);
  }, [open, menuItems]);

  if (!open) return null;

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  // 2. Subida a Cloudinary
  const handleUploadPlato = async (catIdx, optIdx, file) => {
    if (!file) return;
    try {
      setSaving(true);
      showToast('☁️ Subiendo imagen...');
      const resultado = await uploadImageService.subirImagen(file, comercioId);
      setItems(prev => {
        const newItems = [...prev];
        const opciones = [...newItems[catIdx].opciones];
        opciones[optIdx] = { ...opciones[optIdx], imagen: resultado.url };
        newItems[catIdx] = { ...newItems[catIdx], opciones };
        return newItems;
      });
      showToast('✅ Imagen guardada');
    } catch (err) {
      showToast('❌ Error al subir imagen', true);
    } finally {
      setSaving(false);
    }
  };

  // 3. Añadir Plato
  const handleAddPlato = (catIdx) => {
    setItems(prev => {
      const newItems = [...prev];
      const nuevasOpciones = [...newItems[catIdx].opciones, { 
        nombre: '', 
        precio: 0, 
        imagen: '', 
        descripcion: '' 
      }];
      newItems[catIdx] = { ...newItems[catIdx], opciones: nuevasOpciones };
      return newItems;
    });
    setTimeout(() => setExpandidas(prev => ({ ...prev, [catIdx]: true })), 0);
  };

  // 4. Papelera (Borrado Lógico)
  const handleToggleDeletePlato = (catIdx, optIdx) => {
    setItems(prev => {
      const newItems = [...prev];
      const categoria = { ...newItems[catIdx] };
      const opciones = [...categoria.opciones];
      const plato = opciones[optIdx];
      const isDeleted = !!plato._deleted;

      opciones[optIdx] = isDeleted 
        ? { ...plato, _deleted: false, nombre: plato._originalNombre || plato.nombre }
        : { ...plato, _deleted: true, _originalNombre: plato.nombre || '(Sin nombre)' };

      categoria.opciones = opciones;
      newItems[catIdx] = categoria;

      showToast(isDeleted ? '✅ Plato restaurado' : '🗑️ Plato marcado para eliminar');
      return newItems;
    });
  };

  // 5. Ofertas
  const abrirModalOferta = (catIdx, optIdx) => {
    const plato = items[catIdx].opciones[optIdx];
    setPlatoSeleccionado({ catIdx, optIdx });
    setOfertaData({
      descuento: plato.descuentoAplicado || '',
      tag: plato.tagPromo || ''
    });
    setShowOfertaModal(true);
  };

  const aplicarOferta = () => {
    if (!platoSeleccionado) return;
    const { catIdx, optIdx } = platoSeleccionado;
    const descuento = parseFloat(ofertaData.descuento);
    
    if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
      showToast('❌ Ingresa un descuento válido (1-100)', true);
      return;
    }

    setItems(prev => {
      const newItems = [...prev];
      const plato = newItems[catIdx].opciones[optIdx];
      const precioOriginal = plato.precioOriginal || plato.precio;
      const precioConDescuento = precioOriginal * (1 - descuento / 100);
      
      newItems[catIdx].opciones[optIdx] = {
        ...plato,
        precioOriginal,
        precio: precioConDescuento,
        enOferta: true,
        descuentoAplicado: descuento,
        tagPromo: ofertaData.tag.toUpperCase()
      };
      return newItems;
    });
    
    setShowOfertaModal(false);
    showToast('✅ Oferta aplicada');
  };

  const eliminarOferta = (catIdx, optIdx) => {
    setItems(prev => {
      const newItems = [...prev];
      const plato = newItems[catIdx].opciones[optIdx];
      const { precioOriginal, enOferta, descuentoAplicado, tagPromo, ...resto } = plato;
      newItems[catIdx].opciones[optIdx] = { ...resto, precio: precioOriginal || plato.precio };
      return newItems;
    });
    showToast('🏷️ Oferta eliminada');
  };

  // 6. Guardar
  const handleGuardarTodo = async () => {
    setSaving(true);
    try {
      saveMenuBorrador(comercioId, items);
      if (onSave) await onSave(items);
      showToast('✅ Cambios guardados en borrador');
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      showToast('❌ Error al guardar', true);
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // RENDER CON ESTILOS MINIMALISTAS
  // ============================================
  return (
    <>
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
                    <div key={optIdx} style={{ ...S.platoItem, opacity: plato._deleted ? 0.6 : 1 }}>
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
                          disabled={plato._deleted}
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
                          disabled={plato._deleted}
                        />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <InputPrecioDinamico 
                            valorInicial={plato.precio}
                            onChangeFinal={(nuevoPrecio) => {
                              const newItems = [...items];
                              newItems[catIdx].opciones[optIdx].precio = nuevoPrecio;
                              setItems(newItems);
                            }}
                            disabled={plato._deleted}
                            style={{ ...S.inputPrecio, flex: 1 }}
                          />
                          
                          <button
                            type="button"
                            onClick={() => abrirModalOferta(catIdx, optIdx)}
                            style={S.ofertaBtn}
                            disabled={plato._deleted}
                            title="Configurar oferta"
                          >
                            🏷️
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleToggleDeletePlato(catIdx, optIdx)}
                            style={S.deleteBtn}
                            title={plato._deleted ? 'Restaurar plato' : 'Eliminar plato'}
                          >
                            {plato._deleted ? '↩️' : '🗑️'}
                          </button>
                        </div>
                        
                        {plato.enOferta && !plato._deleted && (
                          <div style={S.ofertaBadge}>
                            🔥 -{plato.descuentoAplicado}% {plato.tagPromo}
                            <button onClick={() => eliminarOferta(catIdx, optIdx)} style={S.quitarOfertaBtn}>✕</button>
                          </div>
                        )}
                        
                        {plato._deleted && (
                          <div style={S.deletedBadge}>⚠️ Se eliminará al publicar</div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddPlato(catIdx)} style={S.addBtn}>+ Añadir Plato</button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {toast && (
          <div style={{ ...S.toast, background: toast.isError ? '#e63946' : '#333' }}>
            {toast.msg}
          </div>
        )}
      </div>

      {/* MODAL OFERTA */}
      {showOfertaModal && (
        <div style={S.modalOverlay} onClick={() => setShowOfertaModal(false)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={S.modalTitle}>🏷️ Configurar Oferta</h3>
            <div style={S.formGroup}>
              <label style={S.label}>Descuento (%):</label>
              <input type="number" min="1" max="100" style={S.modalInput} value={ofertaData.descuento} onChange={e => setOfertaData({...ofertaData, descuento: e.target.value})} placeholder="Ej: 20" autoFocus />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Etiqueta (opcional):</label>
              <input type="text" style={S.modalInput} value={ofertaData.tag} onChange={e => setOfertaData({...ofertaData, tag: e.target.value})} placeholder="Ej: BLACK FRIDAY" />
            </div>
            <div style={S.modalActions}>
              <button onClick={() => setShowOfertaModal(false)} style={S.cancelBtn}>Cancelar</button>
              <button onClick={aplicarOferta} style={S.applyBtn}>Aplicar Oferta</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// ESTILOS MINIMALISTAS (CONSERVADOS)
// ============================================
const S = {
  drawer: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '450px', background: '#f8f9fa', zIndex: 4000, boxShadow: '-5px 0 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' },
  header: { padding: '20px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' },
  title: { margin: 0, fontSize: '1.2rem' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  content: { flex: 1, overflowY: 'auto', padding: '15px' },
  categoryCard: { background: '#fff', borderRadius: '15px', marginBottom: '10px', overflow: 'hidden', border: '1px solid #eee' },
  catHeader: { padding: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', background: '#fafafa' },
  platosList: { padding: '10px' },
  platoItem: { display: 'flex', gap: '10px', marginBottom: '15px', background: '#fdfdfd', padding: '10px', borderRadius: '10px' },
  imgContainer: { position: 'relative', width: '70px', height: '70px', flexShrink: 0 },
  platoImg: { width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' },
  placeholderImg: { width: '70px', height: '70px', borderRadius: '8px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' },
  inputs: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' },
  inputNombre: { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '0.9rem' },
  inputPrecio: { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '0.9rem', width: '100%' },
  addBtn: { width: '100%', padding: '10px', background: 'none', border: '1px dashed #ccc', borderRadius: '10px', cursor: 'pointer', color: '#666', marginTop: '10px' },
  saveBtn: { background: '#FF4500', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' },
  toast: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: '#fff', padding: '10px 25px', borderRadius: '30px', fontSize: '0.9rem', zIndex: 5000 },
  ofertaBtn: { background: '#f59e0b', border: 'none', borderRadius: '5px', width: '32px', height: '32px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
  deleteBtn: { background: '#e63946', border: 'none', borderRadius: '5px', width: '32px', height: '32px', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
  ofertaBadge: { marginTop: '5px', padding: '4px 8px', background: '#fff3cd', borderRadius: '5px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  quitarOfertaBtn: { background: 'none', border: 'none', fontSize: '0.8rem', cursor: 'pointer', color: '#999' },
  deletedBadge: { marginTop: '5px', padding: '4px 8px', background: '#f8d7da', borderRadius: '5px', fontSize: '0.75rem', color: '#721c24' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: 'white', borderRadius: '20px', padding: '25px', width: '90%', maxWidth: '400px' },
  modalTitle: { margin: '0 0 20px 0', fontSize: '1.3rem' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' },
  modalInput: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' },
  modalActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  cancelBtn: { padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  applyBtn: { padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};