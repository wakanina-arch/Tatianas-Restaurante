import { useState, useEffect } from 'react'; // React eliminado para limpiar ESLint
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

  useEffect(() => {
    if (!open || !menuItems) return;
    const synced = CATEGORIAS_FIJAS.map(catNombre => 
      menuItems.find(m => m.nombre === catNombre) || { nombre: catNombre, opciones: [] }
    );
    setItems(synced);
  }, [open, menuItems]);

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

  // RESTAURADAS: Las funciones que daban error no-undef
  const handleAddPlato = (catIdx) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[catIdx].opciones.push({ nombre: '', precio: 0, imagen: '', descripcion: '' });
      return newItems;
    });
    setExpandidas(prev => ({ ...prev, [catIdx]: true }));
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
      showToast('✅ Cambios publicados');
      setTimeout(onClose, 1000);
    } catch (err) { showToast('❌ Error al guardar', true); }
    finally { setSaving(false); }
  };

  if (!open) return null;

  return (
    <>
      <div style={S.drawer}>
        <div style={S.header}>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
          <h2 style={S.title}>Rejilla de Trabajo</h2>
          <button onClick={handleGuardarTodo} disabled={saving} style={S.saveBtn}>
            {saving ? '...' : 'Publicar'}
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
                    <div key={optIdx} style={{ ...S.platoItem, opacity: plato._deleted ? 0.5 : 1 }}>
                      <label style={S.imgContainer}>
                        {plato.imagen ? <img src={plato.imagen} style={S.platoImg} alt="" /> : <div style={S.placeholderImg}>🖼️</div>}
                        <input type="file" style={{display:'none'}} onChange={(e) => handleUploadPlato(catIdx, optIdx, e.target.files[0])} disabled={plato._deleted} />
                      </label>
                      
                      <div style={S.inputs}>
                        <input style={S.inputNombre} value={plato.nombre} placeholder="Nombre del plato" onChange={e => {
                          const n = [...items]; n[catIdx].opciones[optIdx].nombre = e.target.value; setItems(n);
                        }} />
                        <input style={S.inputDescripcion} value={plato.descripcion || ''} placeholder='"Descripción"' onChange={e => {
                          const n = [...items]; n[catIdx].opciones[optIdx].descripcion = e.target.value; setItems(n);
                        }} />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{fontWeight:'700'}}>$</span>
                            <InputPrecioDinamico valorInicial={plato.precio} style={S.inputPrecio} onChangeFinal={v => {
                                const n = [...items]; n[catIdx].opciones[optIdx].precio = v; setItems(n);
                            }} />

                            {plato.enOferta && (
                              <div style={S.badgeInformativo} onClick={() => eliminarOferta(catIdx, optIdx)}>
                                {plato.descuentoAplicado}%🎟 {plato.tagPromo}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => abrirModalOferta(catIdx, optIdx)} style={S.miniBtn}>🏷️</button>
                            <button onClick={() => handleToggleDeletePlato(catIdx, optIdx)} style={S.miniBtn}>
                              {plato._deleted ? '↩️' : '🗑️'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddPlato(catIdx)} style={S.addBtn}>+ Añadir Plato</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showOfertaModal && (
        <div style={S.modalOverlay} onClick={() => setShowOfertaModal(false)}>
          <div style={S.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{margin:'0 0 15px'}}>Lanzar Oferta</h3>
            <label style={S.label}>Evento:</label>
            <select style={S.select} value={ofertaData.tag} onChange={e => setOfertaData({...ofertaData, tag: e.target.value})}>
              {EVENTOS_PROMO.map(ev => <option key={ev} value={ev}>{ev}</option>)}
            </select>
            <label style={S.label}>Descuento (%):</label>
            <input type="number" style={S.modalInput} value={ofertaData.descuento} onChange={e => setOfertaData({...ofertaData, descuento: e.target.value})} placeholder="Ej: 10" />
            <div style={S.modalActions}>
              <button onClick={() => setShowOfertaModal(false)} style={S.cancelBtn}>Cerrar</button>
              <button onClick={aplicarOferta} style={S.applyBtn}>Activar</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div style={S.toast}>{toast.msg}</div>}
    </>
  );
}

const S = {
  drawer: { position: 'fixed', inset: 0, left: 'auto', width: '100%', maxWidth: '450px', background: '#fff', zIndex: 4000, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' },
  header: { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' },
  title: { margin: 0, fontSize: '1.1rem', fontWeight: '800' },
  saveBtn: { background: '#00c805', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '15px', fontWeight: '700', cursor: 'pointer' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },
  content: { flex: 1, overflowY: 'auto', padding: '15px', background: '#fcfcfc' },
  categoryCard: { background: '#fff', border: '1px solid #eee', borderRadius: '18px', marginBottom: '10px', overflow: 'hidden' },
  catHeader: { padding: '15px', background: '#f9f9f9', display: 'flex', justifyContent: 'space-between', fontWeight: '700', cursor: 'pointer' },
  platosList: { padding: '10px' },
  platoItem: { display: 'flex', gap: '12px', padding: '15px', borderBottom: '1px solid #f5f5f5' },
  imgContainer: { width: '65px', height: '65px', flexShrink: 0, cursor: 'pointer' },
  platoImg: { width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' },
  placeholderImg: { width: '100%', height: '100%', background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  inputs: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  inputNombre: { border: 'none', fontWeight: '700', fontSize: '1rem', outline: 'none', width: '100%' },
  inputDescripcion: { border: 'none', fontSize: '0.8rem', color: '#666', fontStyle: 'italic', outline: 'none', width: '100%' },
  inputPrecio: { border: 'none', width: '55px', fontWeight: '700', background: '#f0f0f0', borderRadius: '6px', padding: '2px 5px' },
  badgeInformativo: { background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid rgba(255, 59, 48, 0.2)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' },
  miniBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  addBtn: { width: '100%', padding: '10px', background: 'none', border: '1px dashed #ccc', borderRadius: '10px', color: '#999', marginTop: '10px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { background: 'white', padding: '25px', borderRadius: '25px', width: '85%', maxWidth: '350px' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#666', marginBottom: '5px' },
  select: { width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '15px' },
  modalInput: { width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '20px' },
  applyBtn: { flex: 1, padding: '12px', background: '#ff3b30', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '700' },
  cancelBtn: { flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '15px' },
  toast: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '20px', fontSize: '0.8rem' }
};
