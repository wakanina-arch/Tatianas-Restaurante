import React, { useState } from 'react';

// ============================================
// EDIT MENU DRAWER - EDICIÓN SIMPLE DE PLATOS
// Solo nombres y precios por opción
// ============================================

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  const [items, setItems] = useState(menuItems || []);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  // ============================================
  // FUNCIONES DE MANEJO
  // ============================================

  const handleCategoryChange = (idx, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], nombre: value };
    setItems(updated);
  };

  const handleOptionChange = (itemIdx, optIdx, field, value) => {
    const updated = [...items];
    if (!updated[itemIdx].opciones) updated[itemIdx].opciones = [];
    if (!updated[itemIdx].opciones[optIdx]) updated[itemIdx].opciones[optIdx] = {};
    
    updated[itemIdx].opciones[optIdx] = {
      ...updated[itemIdx].opciones[optIdx],
      [field]: value
    };
    setItems(updated);
  };

  const handleAddOption = (itemIdx) => {
    const updated = [...items];
    if (!updated[itemIdx].opciones) updated[itemIdx].opciones = [];
    updated[itemIdx].opciones.push({
      nombre: '',
      precio: 0,
      imagen: ''
    });
    setItems(updated);
  };

  const handleRemoveOption = (itemIdx, optIdx) => {
    const updated = [...items];
    updated[itemIdx].opciones = updated[itemIdx].opciones.filter((_, i) => i !== optIdx);
    setItems(updated);
  };

  const handleAddCategory = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        nombre: 'Nueva Categoría',
        opciones: [
          {
            nombre: 'Opción 1',
            precio: 0,
            imagen: ''
          }
        ]
      }
    ]);
  };

  const handleRemoveCategory = (idx) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  // ============================================
  // RENDERIZADO DE PREVISUALIZACIÓN
  // ============================================

  const renderPreview = (url) => {
    if (!url) return (
      <div style={styles.previewPlaceholder}>
        <span style={styles.previewPlaceholderIcon}>🖼️</span>
        <span>Sin imagen</span>
      </div>
    );
    
    return (
      <div style={styles.previewContainer}>
        <img 
          src={url} 
          alt="Preview" 
          style={styles.previewMedia} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="padding:0.5rem; text-align:center; color:#999; font-size:0.8rem">❌ Error al cargar</div>';
          }} 
        />
      </div>
    );
  };

  // ============================================
  // RENDERIZADO PRINCIPAL
  // ============================================

  return (
    <div className="drawer-backdrop" onClick={onClose} style={styles.backdrop}>
      <div className="drawer" onClick={e => e.stopPropagation()} style={styles.drawer}>
        
        {/* Header */}
        <div className="drawer-header" style={styles.header}>
          <h2 style={styles.headerTitle}>
            <span style={styles.headerIcon}>⚙️</span>
            Editar Menú
          </h2>
          <button className="close-btn" onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        {/* Contenido del formulario */}
        <div style={styles.content}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            await onSave(items);
            setSaving(false);
            onClose();
          }}>
            
            {/* Botón para añadir categoría */}
            <button 
              type="button"
              onClick={handleAddCategory}
              style={styles.addCategoryBtn}
            >
              <span style={styles.addCategoryIcon}>➕</span>
              Añadir Categoría
            </button>

            {/* Lista de categorías */}
            {items.map((item, idx) => (
              <div key={item.id || idx} style={styles.categoryCard}>
                
                {/* Header de categoría */}
                <div style={styles.categoryHeader}>
                  <div style={styles.categoryTitleRow}>
                    <span style={styles.categoryBadge}>Categoría</span>
                    <input 
                      style={styles.categoryInput}
                      value={item.nombre || ''} 
                      onChange={e => handleCategoryChange(idx, e.target.value)} 
                      placeholder="Ej: Primero, Segundo, Postre..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(idx)}
                    style={styles.removeCategoryBtn}
                    title="Eliminar categoría"
                  >
                    🗑️
                  </button>
                </div>

                {/* Opciones de la categoría */}
                <div style={styles.optionsSection}>
                  <div style={styles.optionsHeader}>
                    <span style={styles.optionsTitle}>Platos</span>
                    <button
                      type="button"
                      onClick={() => handleAddOption(idx)}
                      style={styles.addOptionBtn}
                    >
                      + Añadir plato
                    </button>
                  </div>

                  {(!item.opciones || item.opciones.length === 0) ? (
                    <div style={styles.noOptions}>
                      <p>No hay platos. Haz clic en "Añadir plato" para crear uno.</p>
                    </div>
                  ) : (
                    item.opciones.map((opt, oidx) => (
                      <div key={oidx} style={styles.optionCard}>
                        
                        {/* Header de opción */}
                        <div style={styles.optionHeader}>
                          <span style={styles.optionBadge}>Plato {oidx + 1}</span>
                          {item.opciones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx, oidx)}
                              style={styles.removeOptionBtn}
                              title="Eliminar plato"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Campos de opción */}
                        <div style={styles.optionFields}>
                          
                          {/* Nombre del plato */}
                          <div style={styles.fieldGroup}>
                            <label style={styles.label}>Nombre del plato:</label>
                            <input 
                              style={styles.input}
                              value={opt.nombre || ''} 
                              onChange={e => handleOptionChange(idx, oidx, 'nombre', e.target.value)} 
                              placeholder="Ej: Menestra, Pollo, Pescado..."
                            />
                          </div>

                          {/* Precio */}
                          <div style={styles.fieldGroup}>
                            <label style={styles.label}>Precio ($):</label>
                            <input 
                              type="number" 
                              step="0.01"
                              min="0"
                              style={styles.input}
                              value={opt.precio !== undefined ? opt.precio : ''} 
                              onChange={e => {
                                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                handleOptionChange(idx, oidx, 'precio', val);
                              }} 
                              placeholder="0.00"
                            />
                          </div>

                          {/* URL de imagen/video */}
                          <div style={styles.fieldGroup}>
                            <label style={styles.label}>URL de imagen/video:</label>
                            <input 
                              style={styles.input}
                              value={opt.imagen || ''} 
                              onChange={e => handleOptionChange(idx, oidx, 'imagen', e.target.value)} 
                              placeholder="https://ejemplo.com/imagen.jpg"
                            />
                          </div>

                          {renderPreview(opt.imagen)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Botón de guardado */}
            <button 
              type="submit" 
              disabled={saving}
              style={{
                ...styles.saveBtn,
                ...(saving ? styles.saveBtnDisabled : {})
              }}
            >
              {saving ? (
                <span style={styles.savingText}>
                  <span style={styles.spinner}></span>
                  Guardando...
                </span>
              ) : (
                <span style={styles.saveText}>
                  💾 Guardar Cambios
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ESTILOS INTEGRADOS
// ============================================
const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 3000,
    display: 'flex',
    justifyContent: 'flex-end',
    backdropFilter: 'blur(4px)'
  },
  drawer: {
    width: '450px',
    background: 'white',
    height: '100%',
    overflowY: 'auto',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, var(--morado-primario) 0%, var(--morado-secundario) 100%)',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  headerIcon: {
    fontSize: '1.5rem'
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem'
  },
  content: {
    padding: '1.5rem',
    flex: 1,
    overflowY: 'auto'
  },
  addCategoryBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease'
  },
  addCategoryIcon: {
    fontSize: '1.2rem'
  },
  categoryCard: {
    marginBottom: '2rem',
    padding: '1.2rem',
    border: '2px solid var(--borde-tropical)',
    borderRadius: '16px',
    background: 'white'
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.2rem',
    gap: '1rem'
  },
  categoryTitleRow: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  categoryBadge: {
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  categoryInput: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '8px',
    border: '2px solid var(--borde-tropical)',
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  removeCategoryBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: '#999',
    padding: '0.3rem',
    borderRadius: '50%'
  },
  optionsSection: {
    borderTop: '2px dashed var(--borde-tropical)',
    paddingTop: '1.2rem'
  },
  optionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  optionsTitle: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: 'var(--verde-selva)'
  },
  addOptionBtn: {
    background: 'var(--crema-tropical)',
    border: '2px solid var(--mango)',
    color: 'var(--verde-selva)',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  optionCard: {
    marginBottom: '1.2rem',
    padding: '1rem',
    background: 'var(--crema-tropical)',
    borderRadius: '12px',
    border: '2px solid var(--borde-tropical)'
  },
  optionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.8rem'
  },
  optionBadge: {
    background: 'var(--maracuya)',
    color: 'white',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.65rem',
    fontWeight: 'bold'
  },
  removeOptionBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: '0.9rem',
    cursor: 'pointer',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  fieldGroup: {
    marginBottom: '0.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'var(--gris-texto)',
    marginBottom: '0.2rem',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '0.7rem',
    borderRadius: '8px',
    border: '2px solid var(--borde-tropical)',
    fontSize: '0.9rem',
    background: 'white'
  },
  noOptions: {
    textAlign: 'center',
    padding: '1rem',
    background: 'rgba(0,0,0,0.02)',
    borderRadius: '8px',
    color: 'var(--gris-secundario)',
    fontSize: '0.85rem',
    fontStyle: 'italic'
  },
  previewContainer: {
    margin: '0.5rem 0'
  },
  previewMedia: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid var(--maracuya)'
  },
  previewPlaceholder: {
    height: '60px',
    background: '#f0f0f0',
    borderRadius: '8px',
    border: '2px dashed var(--borde-tropical)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--gris-secundario)',
    margin: '0.5rem 0'
  },
  previewPlaceholderIcon: {
    fontSize: '1rem'
  },
  saveBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #296b35 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(1, 64, 14, 0.3)',
    marginTop: '1.5rem'
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  saveText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  savingText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s linear infinite'
  }
};

// Estilo para animación
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .add-category-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  }
  
  input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;
document.head.appendChild(styleSheet);