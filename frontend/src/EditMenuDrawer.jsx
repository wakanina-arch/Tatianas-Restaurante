import React, { useState, useEffect } from 'react';
import AdminNavbar from './components/AdminNavbar'; // ← IMPORTAR EL NUEVO NAVBAR
import uploadImageService from './services/uploadImageService';
import { saveMenuBorrador } from './services/menuService';

const CATEGORIAS_FIJAS = ['Picoteo', 'Entrantes', 'Gourmets', 'Escuderos', 'Zombies', 'FastFurious', 'Postres', 'Bebidas'];
const EVENTOS_PROMO = ['Día de Reyes', 'Día del Amor', 'Día del Maestro', 'Día del Obrero', 'Día de la Madre', 'Día del Padre', 'Vacaciones', 'Invierno', 'Navidad', '2x1'];

const InputPrecioDinamico = ({ valorInicial, onChangeFinal, disabled, style }) => {
  const [localValue, setLocalValue] = useState('');
  useEffect(() => {
    setLocalValue(valorInicial !== undefined && valorInicial !== null ? valorInicial.toString() : '');
  }, [valorInicial]);

  const handleChange = (e) => {
    let val = e.target.value.replace(',', '.');
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setLocalValue(val);
      onChangeFinal(val === '' || val === '.' ? 0 : parseFloat(val));
    }
  };
  return <input type="text" inputMode="decimal" value={localValue} onChange={handleChange} disabled={disabled} placeholder="0.00" style={style} />;
};

export default function EditMenuDrawer({ open, onClose, comercioId, menuItems, onSave }) {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandidas, setExpandidas] = useState({});
  const [showOfertaModal, setShowOfertaModal] = useState(false);
  const [ofertaData, setOfertaData] = useState({ descuento: '', tag: 'Día de la Madre' });
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [hayCambios, setHayCambios] = useState(true);

  useEffect(() => {
    if (!open || !menuItems) return;
    const synced = CATEGORIAS_FIJAS.map(catNombre => 
      menuItems.find(m => m.nombre === catNombre) || { nombre: catNombre, opciones: [] }
    );
    setItems(synced);
  }, [open, menuItems]);

  if (!open) return null;

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUploadPlato = async (catIdx, optIdx, file) => {
    if (!file) return;
    try {
      setSaving(true);
      showToast('☁️ Subiendo imagen...');
      const resultado = await uploadImageService.subirImagen(file, comercioId);
      setItems(prev => {
        const newItems = [...prev];
        newItems[catIdx].opciones[optIdx].imagen = resultado.url;
        return newItems;
      });
      showToast('✅ Imagen guardada');
    } catch (err) { showToast('❌ Error al subir', true); }
    finally { setSaving(false); }
  };

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
  
  // Expandir la categoría (con micro-retraso)
  setTimeout(() => {
    setExpandidas(prev => ({ ...prev, [catIdx]: true }));
  }, 10);
};

  const handleToggleDeletePlato = (catIdx, optIdx) => {
    setItems(prev => {
      const newItems = [...prev];
      const plato = newItems[catIdx].opciones[optIdx];
      plato._deleted = !plato._deleted;
      return newItems;
    });
  };

  const abrirModalOferta = (catIdx, optIdx) => {
    const plato = items[catIdx].opciones[optIdx];
    setPlatoSeleccionado({ catIdx, optIdx });
    setOfertaData({ 
        descuento: plato.descuentoAplicado || '', 
        tag: plato.tagPromo || 'Día de la Madre' 
    });
    setShowOfertaModal(true);
  };

  const aplicarOferta = () => {
    const { catIdx, optIdx } = platoSeleccionado;
    const desc = parseFloat(ofertaData.descuento);
    if (isNaN(desc) || desc <= 0) return showToast('❌ Indica un descuento', true);

    setItems(prev => {
      const newItems = [...prev];
      newItems[catIdx].opciones[optIdx] = {
        ...newItems[catIdx].opciones[optIdx],
        enOferta: true,
        descuentoAplicado: desc,
        tagPromo: ofertaData.tag.toUpperCase()
      };
      return newItems;
    });
    setShowOfertaModal(false);
  };

  const eliminarOferta = (catIdx, optIdx) => {
    setItems(prev => {
      const newItems = [...prev];
      const plato = newItems[catIdx].opciones[optIdx];
      const { enOferta, descuentoAplicado, tagPromo, ...resto } = plato;
      newItems[catIdx].opciones[optIdx] = resto;
      return newItems;
    });
  };

  const handleGuardarTodo = async () => {
    setSaving(true);
    try {
      await saveMenuBorrador(comercioId, items);
      if (onSave) await onSave(items);
      showToast('✅ Cambios guardados');
      setHayCambios(false);
    } catch (err) { showToast('❌ Error al guardar', true); }
    finally { setSaving(false); }
  };

  const handleDescartar = () => {
    const synced = CATEGORIAS_FIJAS.map(catNombre => 
      menuItems.find(m => m.nombre === catNombre) || { nombre: catNombre, opciones: [] }
    );
    setItems(synced);
    showToast('🔄 Cambios descartados');
  };

  const handlePublicar = () => {
    if (!window.confirm('🚀 ¿Publicar cambios? Los clientes verán el nuevo menú inmediatamente.')) return;
    handleGuardarTodo();
    showToast('✅ Menú publicado correctamente');
  };

  return (
    <div style={S.pantallaCompleta}>
      {/* 🔱 NUEVO ADMIN NAVBAR (SUSTITUYE A LA BARRA ANTIGUA) */}
      <AdminNavbar 
        onBack={onClose}
        onHome={onClose}
        onLogout={onClose}
        onDelete={handleDescartar}
        onView={() => {}}
        onAction={handlePublicar}
        nombreComercio="Editor de Menú"
        hayCambios={hayCambios}
        hojaDeTrabajo="editor"
      />

      {/* CONTENIDO CON SCROLL (DEBAJO DEL NAVBAR) */}
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
                  <div key={optIdx} style={{ ...S.platoItem, opacity: plato._deleted ? 0.5 : 1 }}>
                    <label style={S.imgContainer}>
                      {plato.imagen ? <img src={plato.imagen} style={S.platoImg} alt="" /> : <div style={S.placeholderImg}>🖼️</div>}
                      <input type="file" style={{display:'none'}} onChange={(e) => handleUploadPlato(catIdx, optIdx, e.target.files[0])} disabled={plato._deleted} />
                    </label>
                    
                    <div style={S.inputs}>
                      <input style={S.inputNombre} value={plato.nombre} placeholder="Nombre del plato" onChange={e => {
                        const n = [...items]; n[catIdx].opciones[optIdx].nombre = e.target.value; setItems(n);
                      }} disabled={plato._deleted} />
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span>$</span>
                        <InputPrecioDinamico valorInicial={plato.precio} style={S.inputPrecio} onChangeFinal={v => {
                            const n = [...items]; n[catIdx].opciones[optIdx].precio = v; setItems(n);
                        }} disabled={plato._deleted} />

                        <button onClick={() => abrirModalOferta(catIdx, optIdx)} style={S.iconBtn} disabled={plato._deleted}>🏷️</button>
                        <button onClick={() => handleToggleDeletePlato(catIdx, optIdx)} style={S.iconBtn} disabled={plato._deleted}>
                          {plato._deleted ? '↩️' : '🗑️'}
                        </button>
                      </div>

                      {plato.enOferta && (
                        <div style={S.ofertaBadge}>
                          -{plato.descuentoAplicado}% {plato.tagPromo}
                          <span onClick={() => eliminarOferta(catIdx, optIdx)} style={S.quitarOferta}>✕</span>
                        </div>
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

      {/* MODAL OFERTA */}
      {showOfertaModal && (
        <div style={S.modalOverlay} onClick={() => setShowOfertaModal(false)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={S.modalTitle}>🏷️ Configurar Oferta</h3>
            <label style={S.label}>Evento:</label>
            <select style={S.select} value={ofertaData.tag} onChange={e => setOfertaData({...ofertaData, tag: e.target.value})}>
              {EVENTOS_PROMO.map(ev => <option key={ev} value={ev}>{ev}</option>)}
            </select>
            <label style={S.label}>Descuento (%):</label>
            <input type="number" style={S.modalInput} value={ofertaData.descuento} onChange={e => setOfertaData({...ofertaData, descuento: e.target.value})} placeholder="Ej: 20" />
            <div style={S.modalActions}>
              <button onClick={() => setShowOfertaModal(false)} style={S.cancelBtn}>Cancelar</button>
              <button onClick={aplicarOferta} style={S.applyBtn}>Aplicar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={S.toast}>{toast.msg}</div>}
    </div>
  );
}

const S = {
  pantallaCompleta: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: '#f8f9fa',
    zIndex: 4000,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '68px 12px 20px', // ← Ajustado para el nuevo navbar de 56px
  },
  categoryCard: { background: '#fff', borderRadius: '16px', marginBottom: '12px', overflow: 'hidden', border: '1px solid #eee' },
  catHeader: { padding: '14px 16px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: '600' },
  platosList: { padding: '8px' },
  platoItem: { display: 'flex', gap: '12px', padding: '12px', background: '#fff', borderRadius: '12px', marginBottom: '8px' },
  imgContainer: { width: '60px', height: '60px', flexShrink: 0, cursor: 'pointer', position: 'relative' },
  platoImg: { width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' },
  placeholderImg: { width: '100%', height: '100%', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  inputs: { flex: 1 },
  inputNombre: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '4px' },
  inputPrecio: { padding: '6px 8px', border: '1px solid #ddd', borderRadius: '8px', width: '90px', fontSize: '0.9rem' },
  iconBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' },
  ofertaBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff3cd', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', marginTop: '6px' },
  quitarOferta: { cursor: 'pointer', fontWeight: 'bold', marginLeft: '4px' },
  addBtn: { width: '100%', padding: '12px', background: 'none', border: '1px dashed #ccc', borderRadius: '12px', cursor: 'pointer', color: '#666', marginTop: '8px' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: 'white', padding: '24px', borderRadius: '24px', width: '85%', maxWidth: '350px' },
  modalTitle: { margin: '0 0 16px', textAlign: 'center' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' },
  select: { width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '16px' },
  modalInput: { width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' },
  modalActions: { display: 'flex', gap: '12px', marginTop: '20px' },
  applyBtn: { flex: 1, padding: '12px', background: '#ff3b30', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  toast: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: 'white', padding: '10px 20px', borderRadius: '20px', fontSize: '0.8rem', zIndex: 6000 },
};