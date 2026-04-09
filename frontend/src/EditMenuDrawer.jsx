import { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';

// ============================================
// EDIT MENU DRAWER - EDICIÓN SIMPLE DE PLATOS
// Con soporte para upload de imágenes personalizadas
// ============================================

// Nombres fijos de categorías (orden oficial)
const CATEGORIAS_FIJAS = ['Picoteo', 'Entrantes', 'Gourmets', 'Escuderos', 'Zombies', 'FastFurious', 'Postres', 'Bebidas'];

export default function EditMenuDrawer({ open, onClose, comercioId, menuItems, onSave }) {
  // Sincronizar nombres de categoría con los fijos (corrige datos legacy en localStorage)
  const syncCategoriaNombres = (rawItems) => {
    if (!rawItems) return [];
    return rawItems.map((item, idx) => {
      if (idx < CATEGORIAS_FIJAS.length && item.nombre !== CATEGORIAS_FIJAS[idx]) {
        return { ...item, nombre: CATEGORIAS_FIJAS[idx] };
      }
      return item;
    });
  };

  const [items, setItems] = useState(() => syncCategoriaNombres(menuItems || []));
  const [saving, setSaving] = useState(false);
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  const [imageErrores, setImageErrores] = useState({});
  const [imagenesPersonales, setImagenesPersonales] = useState([]);
  const [imagenAñadidaReciente, setImagenAñadidaReciente] = useState(null);
  const [recargarImagenes, setRecargarImagenes] = useState(0); // Trigger para recargar
  
  // Cargar imágenes personales desde localStorage
  useEffect(() => {
    if (comercioId && open) {
      cargarImagenesPersonales();
    }
  }, [comercioId, open]);

  // Recargar cuando se dispara el trigger
  useEffect(() => {
    if (comercioId && recargarImagenes > 0) {
      cargarImagenesPersonales();
    }
  }, [recargarImagenes, comercioId]);

  const cargarImagenesPersonales = () => {
    try {
      const key = `${comercioId}_miImágenes`;
      const data = localStorage.getItem(key);
      if (data) {
        setImagenesPersonales(JSON.parse(data));
      } else {
        setImagenesPersonales([]);
      }
    } catch (error) {
      console.error('Error cargando imágenes personales:', error);
      setImagenesPersonales([]);
    }
  };

  const guardarImagenPersonal = (url, nombre) => {
    try {
      const key = `${comercioId}_miImágenes`;
      const imagenes = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Verificar si ya existe
      const existe = imagenes.some(img => img.url === url);
      if (existe) return;
      
      const nuevaImagen = {
        id: Date.now(),
        url,
        nombre: nombre || getNombreDesdeUrl(url)
      };
      
      imagenes.push(nuevaImagen);
      localStorage.setItem(key, JSON.stringify(imagenes));
      setImagenesPersonales(imagenes);
    } catch (error) {
      console.error('Error guardando imagen:', error);
    }
  };

  const eliminarImagenPersonal = (imagenId) => {
    try {
      const key = `${comercioId}_miImágenes`;
      const imagenes = JSON.parse(localStorage.getItem(key) || '[]');
      const filtradas = imagenes.filter(img => img.id !== imagenId);
      
      localStorage.setItem(key, JSON.stringify(filtradas));
      setImagenesPersonales(filtradas);
    } catch (error) {
      console.error('Error eliminando imagen:', error);
    }
  };

  const [imagenesPorCategoria, setImagenesPorCategoria] = useState({
    Picoteo: [],
    Entrantes: [],
    Gourmets: [],
    Escuderos: [],
    Zombies: [],
    FastFurious: [],
    Postres: [],
    Bebidas: []
  });
  
  // Cargar imágenes del catálogo
  useEffect(() => {
    setImagenesPorCategoria(prev => ({
      ...prev,
      Picoteo: ['/img/Picoteo/Alitas2.png', '/img/Picoteo/Bolon%20de%20Verde.JPG', '/img/Picoteo/Bowl%20Patatas%20fritas.png', '/img/Picoteo/Nachos%20con%20queso.png', '/img/Picoteo/Palomitas%20de%20ma%C3%ADz.png', '/img/Picoteo/Patacones%20con%20Queso.JPG'],
      Entrantes: ['/img/Entrantes/Ceviche%20de%20Camaron.JPG', '/img/Entrantes/Locro%20de%20Papa.JPG', '/img/Entrantes/Mote%20Pillo.JPG', '/img/Entrantes/Pincho%20de%20verduras.png', '/img/Entrantes/Tigrillo.JPG'],
      Gourmets: ['/img/Gourmets/Bistec%20convinado.png', '/img/Gourmets/Cuy%20Asado.JPG', '/img/Gourmets/Encebollado.JPG', '/img/Gourmets/Encocado%20de%20Pescado.JPG', '/img/Gourmets/Estofado%20de%20Pollo.JPG', '/img/Gourmets/Pollo%20broster.png', '/img/Gourmets/Tabla%20flamenca.png'],
      Escuderos: ['/img/Escuderos/Ensalada%20Alemana%20de%20Patata.jpg', '/img/Escuderos/Ensalada%20Caprese.jpg', '/img/Escuderos/Ensalada%20C%C3%A9sar.jpg', '/img/Escuderos/Ensalada%20Coleslaw.jpg', '/img/Escuderos/Ensalada%20Griega.jpg', '/img/Escuderos/Ensalada%20Mimosa.jpg', '/img/Escuderos/Ensalada%20Nizarda.jpg', '/img/Escuderos/Ensalada%20Tabal%C3%A9.jpg', '/img/Escuderos/Ensalada%20Waldorf.jpg', '/img/Escuderos/Ensaladilla%20Rusa.jpg'],
      Zombies: ['/img/Zombies/Carbonara.jpg', '/img/Zombies/Champinones.jpg', '/img/Zombies/Cuatro-Quesos.jpg', '/img/Zombies/Hawaiana.jpg', '/img/Zombies/Margherita.jpg', '/img/Zombies/Marinera.jpg', '/img/Zombies/Napolitana.jpg', '/img/Zombies/Papas%20con%20cuero.JPG', '/img/Zombies/Pepperoni.jpg', '/img/Zombies/Rustica.jpg'],
      FastFurious: ['/img/FastFurious/Ceviche%20de%20Camaron.JPG', '/img/FastFurious/Combos.png', '/img/FastFurious/Humitas.JPG', '/img/FastFurious/LLapingachos.JPG', '/img/FastFurious/Pincho%20de%20verduras.png', '/img/FastFurious/Tabla%20flamenca.png', '/img/FastFurious/Tonga.JPG'],
      Postres: ['/img/Postres/Dulce%20de%20Tomate.JPG', '/img/Postres/Helado%20de%20Paila.JPG', '/img/Postres/ZumoDeFrutas.jpg', '/img/Postres/ZumosVerdes.jpg'],
      Bebidas: ['/img/Bebidas/AguaMineral.jpg', '/img/Bebidas/CervezaClub.jpg', '/img/Bebidas/CervezaGuinness.jpg', '/img/Bebidas/CervezaHeineken.jpg', '/img/Bebidas/CocaCola.jpg', '/img/Bebidas/Fanta.jpg', '/img/Bebidas/Guarana.jpg', '/img/Bebidas/Pepsi.jpg']
    }));
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

  const handleOptionChange = (itemIdx, optIdx, field, value) => {
    const updated = [...items];
    if (!updated[itemIdx].opciones) updated[itemIdx].opciones = [];
    if (!updated[itemIdx].opciones[optIdx]) updated[itemIdx].opciones[optIdx] = {};
    
    updated[itemIdx].opciones[optIdx] = {
      ...updated[itemIdx].opciones[optIdx],
      [field]: value
    };
    setItems(updated);

    // Si es una URL de imagen, guardarla automáticamente en personal
    if (field === 'imagen' && value && value.startsWith('http')) {
      guardarImagenPersonal(value, getNombreDesdeUrl(value));
    }
  };

  // Función para decodificar URL y obtener nombre legible
  const getNombreDesdeUrl = (url) => {
    try {
      // Obtener solo el nombre del archivo
      let nombreArchivo = url.split('/').pop();
      // Decodificar caracteres especiales (%20 = espacio, %C3%A9 = é, etc)
      nombreArchivo = decodeURIComponent(nombreArchivo);
      // Remover extensión
      nombreArchivo = nombreArchivo.split('.')[0];
      return nombreArchivo;
    } catch (e) {
      console.error('Error decodificando URL:', url, e);
      return 'Imagen';
    }
  };

  // Nueva función: seleccionar nombre desde catálogo de imágenes
  const handleSelectNombreDesdeImagen = (itemIdx, optIdx, imagenUrl) => {
    const nombreLimpio = getNombreDesdeUrl(imagenUrl);
    
    // Guardar automáticamente en colección personal
    guardarImagenPersonal(imagenUrl, nombreLimpio);
    
    // Asignar al plato
    handleOptionChange(itemIdx, optIdx, 'nombre', nombreLimpio);
    handleOptionChange(itemIdx, optIdx, 'imagen', imagenUrl);
    
    // Mostrar feedback visual
    setImagenAñadidaReciente(imagenUrl);
    setTimeout(() => {
      setImagenAñadidaReciente(null);
    }, 2500);
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

  const handleEliminarImagenPersonalizada = (imagenId) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    eliminarImagenPersonal(imagenId);
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

  // ============================================
  // RENDERIZADO DE PREVISUALIZACIÓN
  // ============================================

  const handleImageError = (url) => {
    setImageErrores(prev => ({
      ...prev,
      [url]: true
    }));
  };

  const renderPreview = (url) => {
    const tieneError = imageErrores[url] === true;

    if (!url) {
      return (
        <div style={styles.previewPlaceholder}>
          <span style={styles.previewPlaceholderIcon}>🖼️</span>
          <span>Sin imagen</span>
        </div>
      );
    }

    if (tieneError) {
      return (
        <div style={styles.previewError}>
          <div style={styles.previewErrorIcon}>❌</div>
          <div style={styles.previewErrorText}>
            No se pudo cargar la imagen
          </div>
          <div style={styles.previewErrorUrl}>
            {url.substring(0, 40)}...
          </div>
          <button
            type="button"
            style={styles.previewRetryBtn}
            onClick={() => {
              setImageErrores(prev => {
                const newObj = { ...prev };
                delete newObj[url];
                return newObj;
              });
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <div style={styles.previewContainer}>
        <img 
          src={url} 
          alt="Preview" 
          style={styles.previewMedia} 
          onError={() => handleImageError(url)}
          onLoad={() => {
            // Limpiar error si carga correctamente
            setImageErrores(prev => {
              const newObj = { ...prev };
              delete newObj[url];
              return newObj;
            });
          }}
        />
      </div>
    );
  };

  // ============================================
  // RENDERIZADO DEL SELECTOR DE IMÁGENES
  // ============================================

  const renderImageSelector = (itemIdx, optIdx, categoria) => {
    const catalogoImagenes = imagenesPorCategoria[categoria] || [];
    
    // Combinar imágenes personales + catálogo
    const todasLasImagenes = [
      ...imagenesPersonales.map(img => ({
        tipo: 'personal',
        url: img.url,
        nombre: img.nombre,
        id: img.id
      })),
      ...catalogoImagenes.map((url, idx) => ({
        tipo: 'catalogo',
        url,
        nombre: getNombreDesdeUrl(url),
        id: idx
      }))
    ];

    return (
      <div style={styles.imageSelector}>
        <div style={styles.imageSelectorHeader}>
          <label style={styles.labelImagenes}>
            {todasLasImagenes.length > 0 ? '🖼️ Selector de Imágenes' : '📷 Sube imágenes o selecciona del catálogo'}
          </label>
          {comercioId && (
            <ImageUploader 
              comercioId={comercioId}
              onImageUploaded={() => setRecargarImagenes(prev => prev + 1)}
              compact={true}
            />
          )}
        </div>

        {todasLasImagenes.length > 0 ? (
          <div style={styles.imageGrid}>
            {todasLasImagenes.map((img) => {
              const esImagenAñadida = imagenAñadidaReciente === img.url;
              return (
                <div
                  key={`${img.tipo}-${img.id}`}
                  style={{
                    ...styles.imageOption,
                    opacity: esImagenAñadida ? 0.6 : 1,
                    backgroundColor: esImagenAñadida ? 'rgba(0, 150, 200, 0.1)' : 'transparent'
                  }}
                  onClick={() => handleSelectNombreDesdeImagen(itemIdx, optIdx, img.url)}
                  title={img.nombre}
                  className="image-option"
                >
                  <div style={styles.imageOptionContainer}>
                    <img 
                      src={img.url} 
                      alt={img.nombre} 
                      style={styles.imageOptionThumb}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                  <span style={styles.imageOptionName}>
                    {img.nombre.substring(0, 10)}
                    {img.nombre.length > 10 ? '...' : ''}
                  </span>
                  {esImagenAñadida && (
                    <div style={styles.feedbackImagenAñadida}>
                      Imagen Añadida
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.noImagesMessage}>
            <p>Sube imágenes con el uploader o selecciona del catálogo</p>
          </div>
        )}
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
    <span style={styles.categoryBadge}>📁</span>
    <span style={styles.categoryName}>{item.nombre}</span>
  </div>
  <div style={styles.categoryActions}>
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

                              {renderPreview(opt.imagen, idx, oidx)}
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
            {/* Botón flotante de guardado (FAB) */}
<button
  onClick={() => {
    const form = document.querySelector('form');
    if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
  }}
  disabled={saving}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #01400e, #2a6b2f)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    transition: 'all 0.2s ease',
    zIndex: 1000,
  }}
  title="Guardar cambios"
>
  {saving ? <span style={styles.spinner}></span> : '💾'}
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
  imageSelectorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    gap: '1rem'
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
    background: 'white',
    position: 'relative'
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
  feedbackImagenA\u00f1adida: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#0096c8',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.6rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0, 150, 200, 0.3)'
  },
  imageSelectorSection: {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
  },
  labelPersonalizado: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#01400e',
    marginBottom: '0.5rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  labelImagenes: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#01400e',
    marginBottom: '0.5rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  imageBadge: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    fontSize: '0.75rem',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '4px'
  },
  noImagesMessage: {
    textAlign: 'center',
    padding: '1rem',
    color: '#999',
    fontSize: '0.8rem',
    fontStyle: 'italic'
  },
  deleteImageBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: 'rgba(255, 59, 48, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease'
  },
  imageOptionContainer: {
    position: 'relative',
    width: '100%',
    height: '50px',
    overflow: 'hidden',
    borderRadius: '8px'
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
  previewError: {
    margin: '0.5rem 0',
    padding: '1rem',
    background: 'rgba(255, 59, 48, 0.08)',
    borderRadius: '16px',
    border: '2px solid #ff3b30',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  previewErrorIcon: {
    fontSize: '1.5rem'
  },
  previewErrorText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: '0.8rem'
  },
  previewErrorUrl: {
    fontSize: '0.65rem',
    color: '#999',
    fontFamily: 'monospace',
    lineBreak: 'anywhere',
    maxWidth: '100%'
  },
  previewRetryBtn: {
    marginTop: '0.5rem',
    padding: '0.4rem 0.8rem',
    background: '#ff3b30',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.7rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
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
  },
  categoryName: {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#01400e',
  marginLeft: '0.5rem',
},
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
  
  .image-option:hover button {
    opacity: 1 !important;
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