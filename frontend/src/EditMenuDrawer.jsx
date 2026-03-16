import React, { useState, useEffect } from 'react';

// ============================================
// EDIT MENU DRAWER - EDICIÓN SIMPLE DE PLATOS
// Solo nombres y precios por opción
// ============================================

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  const [items, setItems] = useState(menuItems || []);
  const [saving, setSaving] = useState(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  
  // ============================================
  // CATÁLOGO DE IMÁGENES POR CATEGORÍA
  // ============================================
  const [imagenesPorCategoria, setImagenesPorCategoria] = useState({
    Primero: [],
    Segundo: [],
    Postre: [],
    Otras: []
  });

  // Cargar imágenes disponibles (simulado - en producción sería desde el servidor)
  useEffect(() => {
    // Aquí cargarías las imágenes reales de cada carpeta
    // Por ahora simulamos con las que ya existen en tu proyecto
    setImagenesPorCategoria({
     'Primero': [
    '/img/Complementos/Alitas1.png',
    '/img/Complementos/Alitas2.png',
    '/img/Complementos/Bistec convinado.png',
    '/img/Complementos/Bowl Patatas fritas.png',
    '/img/Complementos/Combos.png',
    '/img/Complementos/Nachos con queso.png',
    '/img/Complementos/Palomitas de maiz.png',
    '/img/Complementos/Pincho de verduras.png',
    '/img/Complementos/Pinchos morunos.png',
    '/img/Complementos/Pollo broster.png',
    '/img/Complementos/Tabla flamenca.png'
  ],
  'Segundo': [
    '/img/Ensaladas/Ensalada Alemana de Patata.jpg',
    '/img/Ensaladas/Ensalada Caprese.jpg',
    '/img/Ensaladas/Ensalada César.jpg',
    '/img/Ensaladas/Coleslaw.jpg',
    '/img/Ensaladas/Ensalada Griega.jpg',
    '/img/Ensaladas/Ensalada Mimosa.jpg',
    '/img/Ensaladas/Ensalada Nizarda.jpg',
    '/img/Ensaladas/Ensalada Tabulé.jpg',
    '/img/Ensaladas/Ensalada Waldorf.jpg',
    '/img/Ensaladas/Ensalada Rusa.jpg'
  ],
  'Postre': [
    '/img/Bebidas/AguaMineral.jpg',
    '/img/Bebidas/CervezaClub.jpg',
    '/img/Bebidas/CervezaGuinness.jpg',
    '/img/Bebidas/CervezaHeineken.jpg',
    '/img/Bebidas/CocaCola.jpg',
    '/img/Bebidas/Fanta.jpg',
    '/img/Bebidas/Guarana.jpg',
    '/img/Bebidas/Pepsi.jpg',
    '/img/Bebidas/ZumoDeFrutas.jpg',
    '/img/Bebidas/ZumosVerdes.jpg'
  ],
  'Otras': [
    '/img/Pizzas/Carbonara.jpg',
    '/img/Pizzas/Champiñones.jpg',
    '/img/Pizzas/Cuatro Quesos.jpg',  
    '/img/Pizzas/Hawaiana.jpg',
    '/img/Pizzas/Marguerita.jpg',
    '/img/Pizzas/Marinera.jpg',
    '/img/Pizzas/Napolitana.jpg',
    '/img/Pizzas/Peperoni.jpg',
    '/img/Pizzas/Rústica.jpg'
  ]
    });
  }, []);

  // Inicializar expansión de categorías
  useEffect(() => {
    if (items.length > 0) {
      const expandidas = {};
      items.forEach((item, idx) => {
        expandidas[idx] = true; // Por defecto todas expandidas
      });
      setCategoriasExpandidas(expandidas);
    }
  }, [items]);

  if (!open) return null;

  // ============================================
  // FUNCIONES DE MANEJO
  // ============================================

  const toggleCategoria = (idx) => {
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
    
    updated[itemIdx].opciones[optIdx] = {
      ...updated[itemIdx].opciones[optIdx],
      [field]: value
    };
    setItems(updated);
  };

  // Nueva función: seleccionar nombre desde catálogo de imágenes
  const handleSelectNombreDesdeImagen = (itemIdx, optIdx, imagenUrl, categoria) => {
    // Extraer nombre del archivo de la URL
    const nombreArchivo = imagenUrl.split('/').pop().split('.')[0];
    // Limpiar nombre (quitar guiones, underscores, etc.)
    const nombreLimpio = nombreArchivo
      .replace(/[-_]/g, ' ')
      .replace(/\.[^/.]+$/, '');
    
    handleOptionChange(itemIdx, optIdx, 'nombre', nombreLimpio);
    handleOptionChange(itemIdx, optIdx, 'imagen', imagenUrl);
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
    
    // Expandir la categoría automáticamente
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
    
    // Expandir la nueva categoría
    setCategoriasExpandidas(prev => ({
      ...prev,
      [items.length]: true
    }));
  };

  const handleRemoveCategory = (idx) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      setItems(items.filter((_, i) => i !== idx));
      
      // Limpiar expansión de la categoría eliminada
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
            e.target.parentElement.innerHTML = '<div style="padding:0.5rem; text-align:center; color:#999; font-size:0.8rem">❌ Error al cargar</div>';
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
            const nombreArchivo = img.split('/').pop().split('.')[0];
            return (
              <div
                key={idx}
                style={styles.imageOption}
                onClick={() => handleSelectNombreDesdeImagen(itemIdx, optIdx, img, categoria)}
                title={nombreArchivo}
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
                  
                  {/* Header de categoría (clickeable para expandir/colapsar) */}
                  <div 
                    style={styles.categoryHeader}
                    onClick={() => toggleCategoria(idx)}
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

                  {/* Contenido de la categoría (se muestra solo si está expandida) */}
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
                              
                              {/* Nombre del plato (con selector de imágenes) */}
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

                              {/* URL de imagen/video (personalizada) */}
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
// ESTILOS INTEGRADOS (actualizados)
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
    width: '500px',
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
    right: '1rem',
    background: 'var(--rojo-cierre)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    color: 'white',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
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
  categoryActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
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
  expandIcon: {
    fontSize: '0.9rem',
    color: 'var(--maracuya)',
    width: '24px',
    textAlign: 'center'
  },
  optionsSection: {
    borderTop: '2px dashed var(--borde-tropical)',
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
  imageSelector: {
    marginBottom: '1rem',
    padding: '0.8rem',
    background: 'white',
    borderRadius: '8px',
    border: '2px solid var(--borde-tropical)'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  imageOption: {
    cursor: 'pointer',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '2px solid transparent',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: 'var(--maracuya)',
      transform: 'scale(1.05)'
    }
  },
  imageOptionThumb: {
    width: '100%',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px'
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
  
  .image-option:hover {
    border-color: var(--maracuya) !important;
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
  }
`;
document.head.appendChild(styleSheet);