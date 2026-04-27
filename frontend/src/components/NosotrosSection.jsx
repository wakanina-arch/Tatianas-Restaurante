import React, { useState } from 'react';
import ContratoModal from './ContratoModal'; // Si lo usas como referencia de estilos, puedes copiarlos

export default function NosotrosSection({ comercio, editMode = false, onSave, open, onClose }) {
  const [descripcion, setDescripcion] = useState(comercio?.descripcion || '');
  const [direccion, setDireccion] = useState(comercio?.direccion || '');
  const [telefono, setTelefono] = useState(comercio?.telefono || '');

  const handleSave = () => {
    const data = { descripcion, direccion, telefono };
    localStorage.setItem(`nosotros_${comercio?.id}`, JSON.stringify(data));
    if (onSave) onSave(data);
    alert('✅ Información guardada correctamente');
  };

  // Si se está usando como modal (open/onClose existen), renderizamos esa vista
  if (typeof open !== 'undefined' && !open) return null;

  // Vista pública (solo lectura)
 
if (!editMode) {
  return (
    <div style={S.publicContainer}>
      {/* Mapa simulado */}
      <div style={S.mapContainer}>
        <div style={S.mapPlaceholder}>
          <span style={S.mapIcon}>📍</span>
          <p style={S.mapText}>{direccion || "Calle Principal 123, Quito, Ecuador"}</p>
          <div style={S.fakeMap}>
            <div style={S.fakeMapGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={S.fakeMapLine} />
              ))}
            </div>
            {/* Mapa Simulado Ultra Realista */}
<div style={{
  width: '100%',
  height: '200px',
  background: '#e0e0e0',
  borderRadius: '16px',
  marginTop: '12px',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0,0,0,0.15)',
  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
}}>
  
  {/* Manzanas (bloques grises más oscuros) */}
  {[
    { top: '8%', left: '5%', w: '18%', h: '20%' },
    { top: '8%', left: '28%', w: '14%', h: '20%' },
    { top: '8%', left: '48%', w: '16%', h: '20%' },
    { top: '8%', left: '70%', w: '22%', h: '20%' },
    { top: '38%', left: '5%', w: '18%', h: '18%' },
    { top: '38%', left: '28%', w: '14%', h: '18%' },
    { top: '38%', left: '48%', w: '16%', h: '18%' },
    { top: '38%', left: '70%', w: '22%', h: '18%' },
    { top: '66%', left: '5%', w: '18%', h: '22%' },
    { top: '66%', left: '28%', w: '14%', h: '22%' },
    { top: '66%', left: '48%', w: '16%', h: '22%' },
    { top: '66%', left: '70%', w: '22%', h: '22%' },
  ].map((b, i) => (
    <div key={i} style={{
      position: 'absolute',
      top: b.top, left: b.left,
      width: b.w, height: b.h,
      background: '#d5d5d5',
      borderRadius: '2px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }} />
  ))}

  {/* Carretera principal horizontal (más ancha) */}
  <div style={{
    position: 'absolute',
    top: '33%', left: 0, right: 0,
    height: '8px',
    background: 'linear-gradient(to right, #f0f0f0 0%, #f5f5f5 50%, #f0f0f0 100%)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    zIndex: 2,
  }} />
  
  {/* Línea discontinua en la carretera principal */}
  <div style={{
    position: 'absolute',
    top: 'calc(33% + 3px)', left: '2%', right: '2%',
    height: '2px',
    background: 'repeating-linear-gradient(to right, #999 0px, #999 12px, transparent 12px, transparent 20px)',
    zIndex: 3,
  }} />

  {/* Carretera principal vertical (más ancha) */}
  <div style={{
    position: 'absolute',
    top: 0, bottom: 0,
    left: '25%',
    width: '8px',
    background: 'linear-gradient(to bottom, #f0f0f0 0%, #f5f5f5 50%, #f0f0f0 100%)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    zIndex: 2,
  }} />

  {/* Río o zona verde (parte inferior derecha) */}
  <div style={{
    position: 'absolute',
    bottom: 0, right: 0,
    width: '35%', height: '30%',
    background: 'linear-gradient(135deg, #c8d6e5 0%, #a4b0c0 100%)',
    borderRadius: '0 0 16px 0',
    zIndex: 1,
    opacity: 0.7,
  }} />

  {/* Pin de ubicación */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '2.2rem',
    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
    zIndex: 10,
  }}>
    📍
  </div>
</div>
          </div>
        </div>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion || "Quito, Ecuador")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={S.mapLink}
        >
          📍 Abrir en Google Maps
        </a>
      </div>

      {/* Descripción */}
      {descripcion && (
        <div style={S.descripcionContainer}>
          <h3 style={S.titulo}>Sobre Nosotros</h3>
          <p style={S.texto}>{descripcion}</p>
        </div>
      )}

      {/* Teléfono y WhatsApp */}
      {telefono && (
        <div style={S.contactoContainer}>
          <a href={`tel:${telefono}`} style={S.contactoLink}>📞 {telefono}</a>
          <a 
            href={`https://wa.me/${telefono?.replace(/\s+/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={S.contactoLink}
          >💬 WhatsApp</a>
        </div>
      )}
    </div>
  );
}

  // Vista de edición como MODAL CENTRADO
  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modalContent} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <h3 style={S.modalTitle}>✏️ Editar Información del Comercio</h3>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>

        <div style={S.modalBody}>
          <div style={S.field}>
  <label style={S.label}>Dirección (para Google Maps)</label>
  <input
    value={direccion}
    onChange={(e) => setDireccion(e.target.value)}
    placeholder="Ej: Calle Principal 123, Quito, Ecuador"
    style={S.input}
  />
  
  {/* Mapa Simulado (SIEMPRE VISIBLE) */}
  {direccion && (
    <div style={S.mapContainer}>
      <div style={S.mapPlaceholder}>
        <span style={S.mapIcon}>📍</span>
        <p style={S.mapText}>{direccion}</p>
        <div style={S.fakeMap}>
          <div style={S.fakeMapGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={S.fakeMapLine} />
            ))}
          </div>
          <div style={S.fakeMapPin}>📍</div>
        </div>
      </div>
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={S.mapLink}
      >
        📍 Abrir en Google Maps
      </a>
    </div>
  )}
</div>

          <div style={S.field}>
            <label style={S.label}>Teléfono de contacto</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: +593 999 999 999"
              style={S.input}
            />
          </div>
        </div>

        <div style={S.modalFooter}>
          <button onClick={onClose} style={S.cancelBtn}>Cancelar</button>
          <button onClick={handleSave} style={S.saveBtn}>💾 Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ESTILOS (Fondo pergamino, centrado, blur)
// ============================================
const S = {
  // Modal Overlay
  modalOverlay: {
  position: 'fixed',
  top: 0,              // ← CORREGIDO
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(8px)',
  zIndex: 5000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
},
  modalContent: {
  background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '32px',
  width: '100%',
  maxWidth: '500px',
  maxHeight: '85vh',
  overflowY: 'auto',
  margin: 'auto',           // ← AÑADE ESTO
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
},
  modalHeader: {
    padding: '1.2rem 1.5rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#999',
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
  },
  modalFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    color: '#666',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '4px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    background: 'rgba(255, 255, 255, 0.6)',
    color: '#1a1a1a',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    background: 'rgba(255, 255, 255, 0.6)',
    color: '#1a1a1a',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
  },
  mapPreview: {
    marginTop: '8px',
    padding: '8px 12px',
    background: 'rgba(0,200,5,0.1)',
    borderRadius: '8px',
    color: '#00c805',
    fontSize: '0.8rem',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '12px',
    color: '#666',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #00a86b, #2ecc71)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  mapContainer: {
  marginBottom: '20px',
  borderRadius: '16px',
  overflow: 'hidden',
  background: 'rgba(0, 0, 0, 0.1)',
},
mapImage: {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
},
mapPlaceholder: {
  background: 'rgba(0, 0, 0, 0.3)',
  padding: '30px 20px',
  textAlign: 'center',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
},
mapIcon: {
  fontSize: '2rem',
  display: 'block',
  marginBottom: '8px',
},
mapText: {
  color: '#eee',
  fontSize: '0.9rem',
  marginBottom: '12px',
},
mapLink: {
  color: '#FFD700',
  fontSize: '0.8rem',
  textDecoration: 'underline',
  display: 'block',
  textAlign: 'center',
  marginTop: '8px',
  },
fakeMap: {
  width: '100%',
  height: '180px',
  background: '#e8e8e8',                              // ← Gris claro de fondo
  borderRadius: '12px',
  marginTop: '12px',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(0,0,0,0.1)',
},
fakeMapGrid: {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  opacity: 0.4,                                        // ← Más visible
},
fakeMapLine: {
  width: '100%',
  height: '1px',
  background: '#bbb',                                  // ← Gris medio
},
fakeMapPin: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '2rem',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
publicContainer: {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '24px',
  margin: '10px 16px',
  padding: '20px',
  paddingBottom: '30px',
  border: '1px solid rgba(0, 200, 5, 0.3)',
},
descripcionContainer: {
  marginTop: '20px',
  marginBottom: '20px',
},
titulo: {
  color: '#00c805',
  fontSize: '1rem',
  fontWeight: '700',
  marginBottom: '8px',
},
texto: {
  color: '#eee',
  fontSize: '0.9rem',
  lineHeight: '1.6',
  fontStyle: 'italic',
},
contactoContainer: {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  marginTop: '20px',
},
contactoLink: {
  color: '#FFD700',
  fontSize: '0.9rem',
  textDecoration: 'none',
  fontWeight: '600',
  },

};