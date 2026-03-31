import React, { useState, useEffect } from 'react';

// ============================================
// PROMOS DRAWER - GESTIÓN DE OFERTAS
// Con efecto vidrio iPhone 16
// ============================================

export default function PromosDrawer({ open, onClose, menuItems, onSaveMenu }) {
  
  const [selectedItemId, setSelectedItemId] = useState('');
  const [promoData, setPromoData] = useState({
    descuento: '',
    tag: ''
  });

  // Resetear al cerrar el drawer
  useEffect(() => {
    if (!open) {
      setSelectedItemId('');
      setPromoData(prev => ({ ...prev, descuento: 0 }));
    }
  }, [open]);

  if (!open) return null;

  // ============================================
  // FUNCIÓN PARA APLICAR PROMOCIÓN
  // ============================================
  const handleGuardarPromo = () => {
    if (!selectedItemId) {
      alert("❌ Selecciona un plato primero");
      return;
    }

    const descuento = parseInt(promoData.descuento);
    if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
      alert("❌ Ingresa un descuento válido entre 1 y 100");
      return;
    }

    const itemSeleccionado = menuItems.find(i => i.id === parseInt(selectedItemId));
    
    const nuevoMenu = menuItems.map(item => {
      if (item.id === parseInt(selectedItemId)) {
        const opcionesConDescuento = item.opciones.map(opt => {
          const precioOriginal = opt.precio || 0;
          const precioConDescuento = precioOriginal * (1 - descuento / 100);
          return {
            ...opt,
            precioOriginal,
            precio: precioConDescuento
          };
        });
        return {
          ...item,
          enOferta: true,
          descuentoAplicado: descuento,
          tagPromo: promoData.tag.toUpperCase(),
          opciones: opcionesConDescuento
        };
      }
      return item;
    });

    onSaveMenu(nuevoMenu);
    alert(`✅ ¡Promoción activada en ${itemSeleccionado?.nombre}! 🚀`);
    
    setSelectedItemId('');
    setPromoData(prev => ({ ...prev, descuento: 0 }));
  };

  // ============================================
  // FUNCIÓN PARA ELIMINAR PROMOCIÓN
  // ============================================
  const handleEliminarPromo = (id) => {
    const itemEliminado = menuItems.find(i => i.id === id);
    
    const nuevoMenu = menuItems.map(item => {
      if (item.id === id) {
        const opcionesRestauradas = item.opciones.map(opt => ({
          ...opt,
          precio: opt.precioOriginal || opt.precio,
          precioOriginal: undefined
        }));
        return {
          ...item,
          enOferta: false,
          descuentoAplicado: 0,
          tagPromo: '',
          opciones: opcionesRestauradas
        };
      }
      return item;
    });
    
    onSaveMenu(nuevoMenu);
    alert(`✅ Promoción eliminada de ${itemEliminado?.nombre}`);
  };

  const itemsConPromo = menuItems.filter(i => i.enOferta);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            <span style={styles.titleIcon}>🏷️</span>
            Configurador de Ofertas
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Formulario de promoción */}
        <div style={styles.content}>
          <div style={styles.formContainer}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Seleccionar Plato:</label>
              <select 
                style={styles.select}
                value={selectedItemId} 
                onChange={(e) => setSelectedItemId(e.target.value)}
              >
                <option value="">-- Elige un plato --</option>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} {item.enOferta ? '🔥' : ''} 
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descuento (%):</label>
              <input 
                type="number" 
                min="1"
                max="100"
                style={styles.input}
                value={promoData.descuento}
                onChange={(e) => setPromoData({...promoData, descuento: e.target.value})}
                placeholder="0,00"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Etiqueta de Oferta:</label>
              <input 
                type="text" 
                style={styles.input}
                placeholder="Especifica la Promoción"
                value={promoData.tag}
                onChange={(e) => setPromoData({...promoData, tag: e.target.value})}
              />
            </div>

            <button 
              onClick={handleGuardarPromo}
              style={styles.activateBtn}
            >
              🚀 Activar Promoción
            </button>
          </div>

          {/* Separador */}
          <hr style={styles.divider} />

          {/* Lista de promociones activas */}
          <div style={styles.promosList}>
            <h3 style={styles.promosTitle}>
              Promociones Activas {itemsConPromo.length > 0 && `(${itemsConPromo.length})`}
            </h3>
            
            {itemsConPromo.length > 0 ? (
              itemsConPromo.map(item => (
                <div key={item.id} style={styles.promoCard}>
                  <div style={styles.promoInfo}>
                    <span style={styles.promoName}>{item.nombre}</span>
                    <div style={styles.promoTags}>
                      <span style={styles.tagBadge}>
                        🏷️ {item.tagPromo}
                      </span>
                      <span style={styles.discountBadge}>
                        -{item.descuentoAplicado}%
                      </span>
                      <span style={styles.priceInfo}>
                        ${(item.precioOriginal || item.precio)?.toFixed(2)} → 
                        <strong style={styles.newPrice}> ${item.precio?.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminarPromo(item.id)}
                    style={styles.deleteBtn}
                    title="Eliminar promoción"
                  >
                    🗑️
                  </button>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p>No hay promociones activas</p>
                <span style={styles.emptyIcon}>🏷️</span>
              </div>
            )}
          </div>

          {/* Nota informativa */}
          <div style={styles.footerNote}>
            <span style={styles.noteIcon}>🔥</span>
            <span>Las promociones aparecerán junto al nombre del plato en el menú</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ESTILOS CON EFECTO VIDRIO (EL QUE BUSCAS)
// ============================================
const styles = {
   overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  drawer: {
    width: '90%',
    maxWidth: '550px',
    maxHeight: '85vh',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '32px',
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  header: {
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)',
    color: 'white',
    borderTopLeftRadius: '32px',
    borderTopRightRadius: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
   title: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'white'  // ← cambiar de var(--verde-selva) a blanco
  },
  titleIcon: {
    fontSize: '1.3rem'
  },
  closeBtn: {
    background: 'rgba(0, 0, 0, 0.2)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    transition: 'all 0.2s ease'
  },
  content: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto'
  },
  formContainer: {
    padding: '0 0 1rem 0'
  },
  formGroup: {
    marginBottom: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: 'var(--gris-texto)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  select: {
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer'
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: 'rgba(255, 255, 255, 0.8)'
  },
  activateBtn: {
    width: '100%',
    marginTop: '0.5rem',
    padding: '0.8rem',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    border: 'none',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(255, 179, 71, 0.2)'
  },
  divider: {
    margin: '1.5rem 0',
    border: 'none',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
  },
  promosList: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '300px',
    marginBottom: '1rem'
  },
  promosTitle: {
    fontSize: '1rem',
    color: 'var(--verde-selva)',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255, 179, 71, 0.3)',
    fontWeight: '600'
  },
  promoCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    marginBottom: '0.8rem',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease'
  },
  promoInfo: {
    flex: 1
  },
  promoName: {
    fontWeight: '600',
    color: 'var(--verde-selva)',
    fontSize: '0.95rem',
    marginBottom: '0.3rem',
    display: 'block'
  },
  promoTags: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  tagBadge: {
    background: 'linear-gradient(135deg, var(--mango) 0%, #ff9f1c 100%)',
    color: 'var(--verde-selva)',
    padding: '0.3rem 0.8rem',
    borderRadius: '30px',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  discountBadge: {
    background: 'var(--maracuya)',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '30px',
    fontSize: '0.7rem',
    fontWeight: '600'
  },
  priceInfo: {
    fontSize: '0.75rem',
    color: 'var(--gris-texto)'
  },
  newPrice: {
    color: 'var(--verde-selva)',
    fontSize: '0.85rem'
  },
  deleteBtn: {
    background: 'rgba(255, 255, 255, 0.3)',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '30px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--gris-texto)',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  emptyIcon: {
    display: 'block',
    fontSize: '2rem',
    marginTop: '0.5rem',
    opacity: 0.5
  },
  footerNote: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    fontSize: '0.8rem',
    color: 'var(--gris-texto)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  noteIcon: {
    fontSize: '1.1rem'
  }
};

// Animación y hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .close-btn:hover {
    background: rgba(0, 0, 0, 0.1) !important;
  }
  
  .promo-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.4) !important;
    border-color: var(--maracuya) !important;
  }

  .delete-btn:hover {
    background: rgba(255, 59, 48, 0.1) !important;
    color: #ff3b30 !important;
    transform: scale(1.1);
  }

  select:hover, input:hover {
    border-color: var(--maracuya) !important;
  }

  select:focus, input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.1) !important;
  }

  .activate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 179, 71, 0.3) !important;
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}