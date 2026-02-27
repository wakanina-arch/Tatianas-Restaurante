import React, { useState, useEffect } from 'react';

// ============================================
// PROMOS DRAWER - GESTIÓN DE OFERTAS
// Integrado con el sistema de estilos del restaurante
// ============================================

export default function PromosDrawer({ open, onClose, menuItems, onSaveMenu }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [promoData, setPromoData] = useState({
    descuento: 0,
    tag: 'DESPIERTA' // Tag por defecto
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
        // Aplicar descuento a CADA OPCIÓN del plato
      const opcionesConDescuento = item.opciones.map(opt => {
        const precioOriginal = opt.precio || 0;
        const precioConDescuento = precioOriginal * (1 - descuento / 100);
        console.log(`💰 Opción ${opt.nombre}: ${precioOriginal} → ${precioConDescuento} (${descuento}% descuento)`);
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
          //precioOriginal: item.precioOriginal || item.precio,
          //precio: item.precio * (1 - descuento / 100)
        };
      }
      return item;
    });

    onSaveMenu(nuevoMenu);
    alert(`✅ ¡Promoción activada en ${itemSeleccionado?.nombre}! 🚀`);
    
    // Limpiar formulario
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
        // Restaurar precios originales de CADA OPCIÓN
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
          //precio: item.precioOriginal || item.precio,
          //precioOriginal: undefined
        };
      }
      return item;
    });
    
    onSaveMenu(nuevoMenu);
    alert(`✅ Promoción eliminada de ${itemEliminado?.nombre}`);
  };

  // Filtrar items con promoción activa
  const itemsConPromo = menuItems.filter(i => i.enOferta);

  return (
    <div className="drawer-backdrop">
      <div className="drawer">
        {/* Header del drawer (estilo consistente) */}
        <div className="drawer-header">
          <h2>🏷️ Configurador de Ofertas</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Formulario de promoción */}
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
              placeholder="Ej: 20"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Etiqueta de Oferta:</label>
            <input 
              type="text" 
              style={styles.input}
              placeholder="Ej: OFERTA, 2x1, ESPECIAL"
              value={promoData.tag}
              onChange={(e) => setPromoData({...promoData, tag: e.target.value})}
            />
          </div>

          <button 
            onClick={handleGuardarPromo}
            className="add-btn"
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
                  className="delete-btn"
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
  );
}

// ============================================
// ESTILOS INTEGRADOS (Usando variables del CSS)
// ============================================
const styles = {
  formContainer: {
    padding: '1.5rem 0'
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
    fontSize: '0.95rem'
  },
  select: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.3s',
    cursor: 'pointer'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.3s'
  },
  activateBtn: {
    width: '100%',
    marginTop: '0.5rem',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    fontWeight: 'bold'
  },
  divider: {
    margin: '1.5rem 0',
    border: 'none',
    borderTop: '2px dashed var(--borde-tropical)'
  },
  promosList: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '300px',
    marginBottom: '1rem'
  },
  promosTitle: {
    fontSize: '1.1rem',
    color: 'var(--gris-texto)',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--mango)'
  },
  promoCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'var(--crema-tropical)',
    borderRadius: '12px',
    marginBottom: '0.8rem',
    border: '2px solid var(--borde-tropical)',
    transition: 'all 0.3s ease'
  },
  promoInfo: {
    flex: 1
  },
  promoName: {
    fontWeight: 'bold',
    color: 'var(--verde-selva)',
    fontSize: '1rem',
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
    padding: '0.3rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(255, 179, 71, 0.3)'
  },
  discountBadge: {
    background: 'var(--maracuya)',
    color: 'white',
    padding: '0.3rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
  },
  priceInfo: {
    fontSize: '0.8rem',
    color: 'var(--gris-secundario)'
  },
  newPrice: {
    color: 'var(--verde-selva)',
    fontSize: '0.9rem'
  },
  deleteBtn: {
    minWidth: '40px',
    height: '40px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--gris-secundario)',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
    border: '2px dashed var(--borde-tropical)'
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
    background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: 'var(--gris-texto)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid var(--borde-tropical)'
  },
  noteIcon: {
    fontSize: '1.2rem'
  }
};

// Estilos en CSS para hover effects (se agregarán al head)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .promo-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.15);
    border-color: var(--maracuya) !important;
  }

  .delete-btn:hover {
    background: var(--maracuya) !important;
    transform: scale(1.15) rotate(8deg);
  }

  select:hover, input:hover {
    border-color: var(--mango) !important;
  }

  select:focus, input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);