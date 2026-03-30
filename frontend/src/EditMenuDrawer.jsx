import React, { useState, useEffect } from 'react';

// ============================================
// EDIT MENU DRAWER - EDICIÓN SIMPLE DE PLATOS
// Solo nombres y precios por opción
// ============================================

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  const [items, setItems] = useState(menuItems || []);
  const [saving, setSaving] = useState(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});

  const [imagenesPorCategoria, setImagenesPorCategoria] = useState({
    Primero: [],
    Segundo: [],
    Postre: [],
    Otras: []
  });
  
  // ============================================
  // CATÁLOGO DE IMÁGENES POR CATEGORÍA - CORREGIDO
  // ============================================
 useEffect(() => {
  setImagenesPorCategoria({
    Primero: [
      '/img/Complementos/Alitas1.png',
      '/img/Complementos/Alitas2.png',
      '/img/Complementos/Bistec convinado.png',
      '/img/Complementos/Lomo salteado.jpg',
      '/img/Complementos/Pollo al horno.jpg'
    ],
    Segundo: [
      '/img/Ensaladas/Ensalada Alemana de Patata.jpg',
      '/img/Ensaladas/Ensalada Caprese.jpg',
      '/img/Ensaladas/Ensalada César.jpg',
      '/img/Ensaladas/Ensalada Coleslaw.jpg',
      '/img/Ensaladas/Ensalada Griega.jpg'
    ],
    Bebidas: [
      '/img/Bebidas/AguaMineral.jpg',
      '/img/Bebidas/CervezaClub.jpg',
      '/img/Bebidas/CervezaGuinness.jpg',
      '/img/Bebidas/CocaCola.jpg',
      '/img/Bebidas/ZumoDeFrutas.jpg',
      '/img/Bebidas/ZumosVerdes.jpg'

    ],
    Pizzas: [
      '/img/Pizzas/Carbonara.jpg',
      '/img/Pizzas/Champinones.jpg',
      '/img/Pizzas/Cuatro-Quesos.jpg',
      '/img/Pizzas/Hawaiana.jpg',
      '/img/Pizzas/Margherita.jpg',
      '/img/Pizzas/Rustica.jpg'
    ]
  });
}, []);

  // Inicializar expansión de categorías
  useEffect(() => {
    if (items.length > 0) {
      const expandidas = {};
      items.forEach((item, idx) => {
        expandidas[idx] = true;
      });
      setCategoriasExpandidas(expandidas);
    }
  }, [items]);

  if (!open) return null;

  // ============================================
  // FUNCIONES DE MANEJO
  // ============================================

  const toggleCategory = (idx) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCategoryChange = (idx, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], nombre: value };
    setItems(updated);
  };

  const handleOptionChange = (itemIdx, optIdx, field, value) => {
    const updated = [...items];
    if (!updated[itemIdx].opciones) updated[itemIdx].opciones = [];
    if (!updated[itemIdx].opciones[optIdx]) updated[itemIdx].opciones[optIdx] = {};
    
    // Normalizar URLs de imágenes para HTTPS
    if (field === 'imagen' && value) {
      if (value.startsWith('http://')) {
        value = value.replace('http://', 'https://');
      }
    }
    
    updated[itemIdx].opciones[optIdx] = {
      ...updated[itemIdx].opciones[optIdx],
      [field]: value
    };
    setItems(updated);
  };

  // Función para decodificar URL y obtener nombre legible
  const getNombreDesdeUrl = (url) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const nombreArchivo = decodedUrl.split('/').pop().split('.')[0];
      return nombreArchivo.replace(/[-_]/g, ' ');
    } catch (e) {
      return '';
    }
  };

  // Nueva función: seleccionar nombre desde catálogo de imágenes
  const handleSelectNombreDesdeImagen = (itemIdx, optIdx, imagenUrl, categoria) => {
    const nombreLimpio = getNombreDesdeUrl(imagenUrl);
    
    handleOptionChange(itemIdx, optIdx, 'nombre', nombreLimpio);
    handleOptionChange(itemIdx, optIdx, 'imagen', imagenUrl);
  };

  const handleAddOption = (itemIdx) => {
    const updated = [...items];
    if (!updated[itemIdx].opciones) updated[itemIdx].opciones = [];
    updated[itemIdx].opciones.push({
      nombre: '',
      precio: 0,
      imagen: '',
      descripción:''
    });
    setItems(updated);
    
    setCategoriasExpandidas(prev => ({
      ...prev,
      [itemIdx]: true
    }));
  };

  const handleRemoveOption = (itemIdx, optIdx) => {
    const updated = [...items];
    updated[itemIdx].opciones = updated[itemIdx].opciones.filter((_, i) => i !== optIdx);
    setItems(updated);
  };

  const handleAddCategory = () => {
    const newId = Date.now();
    setItems([
      ...items,
      {
        id: newId,
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
    
    setCategoriasExpandidas(prev => ({
      ...prev,
      [items.length]: true
    }));
  };

  const handleRemoveCategory = (idx) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      setItems(items.filter((_, i) => i !== idx));
      
      const newExpandidas = { ...categoriasExpandidas };
      delete newExpandidas[idx];
      setCategoriasExpandidas(newExpandidas);
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
            const parent = e.target.parentElement;
            parent.innerHTML = `
              <div style="
                padding: 1rem; 
                text-align: center; 
                color: #ff3b30; 
                font-size: 0.8rem;
                background: rgba(255, 59, 48, 0.05);
                border-radius: 12px;
              ">
                ❌ No se pudo cargar la imagen<br>
                <span style="font-size: 0.7rem; color: #999;">${url.substring(0, 30)}...</span>
              </div>
            `;
          }} 
        />
      </div>
    );
  };

  // ============================================
  // RENDERIZADO DEL SELECTOR DE IMÁGENES
  // ============================================

  const renderImageSelector = (itemIdx, optIdx, categoria) => {
    const imagenes = imagenesPorCategoria[categoria] || [];
    
    if (imagenes.length === 0) return null;
    
    return (
      <div style={styles.imageSelector}>
        <label style={styles.label}>Seleccionar de catálogo:</label>
        <div style={styles.imageGrid}>
          {imagenes.map((img, idx) => {
            const nombreArchivo = getNombreDesdeUrl(img);
            return (
              <div
                key={idx}
                style={styles.imageOption}
                onClick={() => handleSelectNombreDesdeImagen(itemIdx, optIdx, img, categoria)}
                title={nombreArchivo}
                className="image-option"
              >
                <img src={img} alt={nombreArchivo} style={styles.imageOptionThumb} />
                <span style={styles.imageOptionName}>
                  {nombreArchivo.substring(0, 12)}
                  {nombreArchivo.length > 12 ? '...' : ''}
                </span>
              </div>
            );
          })}
        </div>
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
              className="add-category-btn"
            >
              <span style={styles.addCategoryIcon}>➕</span>
              Añadir Categoría
            </button>

            {/* Lista de categorías (ACORDEÓN) */}
            {items.map((item, idx) => {
              const categoria = item.nombre || 'Otras';
              const isExpanded = categoriasExpandidas[idx] !== false;
              
              return (
                <div key={item.id || idx} style={styles.categoryCard}>
                  
                  {/* Header de categoría */}
                  <div 
                    style={styles.categoryHeader}
                    onClick={() => toggleCategory(idx)}
                  >
                    <div style={styles.categoryTitleRow}>
                      <span style={styles.categoryBadge}>Categoría</span>
                      <input 
                        style={styles.categoryInput}
                        value={item.nombre || ''} 
                        onChange={e => {
                          e.stopPropagation();
                          handleCategoryChange(idx, e.target.value);
                        }} 
                        placeholder="Ej: Primero, Segundo, Postre, Otras..."
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                    <div style={styles.categoryActions}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCategory(idx);
                        }}
                        style={styles.removeCategoryBtn}
                        title="Eliminar categoría"
                      >
                        🗑️
                      </button>
                      <span style={styles.expandIcon}>
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la categoría */}
                  {isExpanded && (
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

                              {/* SELECTOR DE IMÁGENES POR CATEGORÍA */}
                              {renderImageSelector(idx, oidx, categoria)}

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
                                <label style={styles.label}>URL personalizada:</label>
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
                  )}
                </div>
              );
            })}

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
// ESTILOS ACTUALIZADOS CON ESTÉTICA IPHONE 16
// ============================================
const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 3000,
    display: 'flex',
    justifyContent: 'flex-end',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)'
  },
  drawer: {
    width: '520px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    height: '100%',
    overflowY: 'auto',
    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid rgba(255, 255, 255, 0.3)'
  },
  header: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600'
  },
  headerIcon: {
    fontSize: '1.5rem'
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '30px',
    width: '36px',
    height: '36px',
    color: 'white',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    backdropFilter: 'blur(4px)'
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
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(255, 179, 71, 0.3)'
  },
  addCategoryIcon: {
    fontSize: '1.2rem'
  },
  categoryCard: {
    marginBottom: '2rem',
    padding: '1.2rem',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '24px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    gap: '1rem',
    cursor: 'pointer'
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
    borderRadius: '30px',
    fontSize: '0.7rem',
    fontWeight: '700',
    whiteSpace: 'nowrap'
  },
  categoryInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.95rem',
    fontWeight: '500',
    background: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease'
  },
  categoryActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  removeCategoryBtn: {
    background: 'rgba(0, 0, 0, 0.05)',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#666',
    padding: '0.3rem',
    borderRadius: '20px',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  expandIcon: {
    fontSize: '0.8rem',
    color: 'var(--maracuya)',
    width: '24px',
    textAlign: 'center'
  },
  optionsSection: {
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    paddingTop: '1.2rem',
    marginTop: '0.5rem'
  },
  optionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  optionsTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },
  addOptionBtn: {
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 179, 71, 0.3)',
    color: 'var(--verde-selva)',
    padding: '0.3rem 1rem',
    borderRadius: '30px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  optionCard: {
    marginBottom: '1.2rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
    border: '1px solid rgba(255, 179, 71, 0.2)'
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
    padding: '0.2rem 0.8rem',
    borderRadius: '30px',
    fontSize: '0.65rem',
    fontWeight: '600'
  },
  removeOptionBtn: {
    background: 'rgba(0, 0, 0, 0.05)',
    border: 'none',
    color: '#666',
    fontSize: '0.8rem',
    cursor: 'pointer',
    width: '24px',
    height: '24px',
    borderRadius: '12px',
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
    fontSize: '0.75rem',
    color: 'var(--gris-texto)',
    marginBottom: '0.3rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.2s ease'
  },
  imageSelector: {
    marginBottom: '1rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 179, 71, 0.2)'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  imageOption: {
    cursor: 'pointer',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
    background: 'white'
  },
  imageOptionThumb: {
    width: '100%',
    height: '50px',
    objectFit: 'cover'
  },
  imageOptionName: {
    display: 'block',
    fontSize: '0.6rem',
    textAlign: 'center',
    padding: '0.2rem',
    color: 'var(--gris-texto)'
  },
  noOptions: {
    textAlign: 'center',
    padding: '1.5rem',
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '16px',
    color: '#999',
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
    borderRadius: '16px',
    border: '1px solid var(--maracuya)'
  },
  previewPlaceholder: {
    height: '60px',
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '16px',
    border: '1px dashed rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#999',
    margin: '0.5rem 0'
  },
  previewPlaceholderIcon: {
    fontSize: '1rem'
  },
  saveBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #2a6b2f 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(1, 64, 14, 0.2)',
    marginTop: '1.5rem',
    transition: 'all 0.2s ease'
  },
  saveBtnDisabled: {
    opacity: 0.5,
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
    box-shadow: 0 6px 16px rgba(255, 179, 71, 0.4) !important;
  }
  
  input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.1) !important;
    outline: none;
  }
  
  .image-option:hover {
    border-color: var(--maracuya) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 179, 71, 0.2);
  }
  
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3) !important;
  }
  
  .remove-category-btn:hover {
    background: rgba(255, 59, 48, 0.1) !important;
    color: #ff3b30 !important;
  }
  
  .add-option-btn:hover {
    background: rgba(255, 179, 71, 0.1) !important;
    border-color: var(--maracuya) !important;
  }
  
  .save-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(1, 64, 14, 0.3) !important;
  }
`;
document.head.appendChild(styleSheet);