import React, { useState } from 'react';
import EntregaPedido from '../EntregaPedido';

export default function Acordeon({ 
  menuItems, 
  finishedOrders, 
  setFinishedOrders,
  pendingOrders, 
  log,
  addLog,
  total,
  onOpenDrawer,
  onOpenOrders,
  onOpenLog,
  onOpenPromos,
  onCierreJornada,
  onConfirmarEntrega,
  onPayment
}) {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      id: 'caja',
      title: '💰 Caja Rápida',
      icon: '💰',
      badge: finishedOrders.length > 0 ? finishedOrders.length : null,
      badgeColor: 'var(--verde-selva)',
      content: (
        <>
          <div style={styles.totalDisplay}>
            <span style={styles.totalLabel}>Total en caja:</span>
            <span style={styles.totalAmount}>${total.toFixed(2)}</span>
          </div>
          {finishedOrders.length > 0 ? (
            <EntregaPedido 
              finishedOrders={finishedOrders}
              setFinishedOrders={setFinishedOrders}
              addLog={addLog}
            />
          ) : (
            <p style={styles.sinPedidos}>✨ No hay pedidos pendientes de cobro</p>
          )}
        </>
      )
    },
    {
      
  id: 'menu',
  title: '📝 Menú del Día',
  icon: '📝',
  badge: menuItems.length,
  badgeColor: 'var(--morado-primario)',
  content: (
        <>
          <p style={styles.cardDescription}>Configura Menú Diario y agrega precios e imagens </p>
          <button className="admin-btn" onClick={onOpenDrawer} style={styles.actionBtn}>
            🚀 Editar Menú
          </button>
        </>
      )
},

    {
      id: 'promos',
      title: '🏷️ Promociones',
      icon: '🏷️',
      badge: menuItems.filter(i => i.enOferta).length || null,
      badgeColor: 'var(--mango)',
      content: (
        <>
          <p style={styles.cardDescription}>Configura ofertas y descuentos especiales</p>
          <button className="admin-btn" onClick={onOpenPromos} style={styles.actionBtn}>
            🚀 Gestionar Promos
          </button>
        </>
      )
    },
    // ============================================
    // ✅ SECCIÓN COMANDAS CORREGIDA - abre directamente el drawer
    // ============================================
    {
      id: 'comandas',
      title: '👨‍🍳 Comandas',
      icon: '👨‍🍳',
      badge: pendingOrders.length || null,
      badgeColor: 'var(--maracuya)',
      content: null, // Sin contenido visible
      onClick: onOpenOrders // Al hacer clic, abre el drawer
    },
    {
      id: 'registro',
      title: '📊 Registro',
      icon: '📊',
      badge: log.length,
      badgeColor: 'var(--gris-secundario)',
      content: (
        <>
          <p style={styles.cardDescription}>Auditoría de entradas y salidas</p>
          <button className="admin-btn" onClick={onOpenLog} style={styles.actionBtn}>
            📜 Ver Registro
          </button>
        </>
      )
    },
    {
      id: 'cierre',
      title: '⏰ Cierre de Turno',
      icon: '⏰',
      badge: null,
      content: (
        <>
          <p style={styles.cardDescription}>Calcula ventas y genera reporte</p>
          <div style={styles.resumenVentas}>
            <span>Ventas hoy:</span>
            <strong style={styles.ventasTotal}>
              ${log
                .filter(entry => entry.tipo === 'Entrada')
                .reduce((acc, entry) => {
                  const match = entry.detalle?.match(/\$(\d+\.?\d*)/);
                  return acc + (match ? parseFloat(match[1]) : 0);
                }, 0).toFixed(2)}
            </strong>
          </div>
          <button className="admin-btn" style={styles.cierreBtn} onClick={onCierreJornada}>
            📥 Finalizar Día
          </button>
        </>
      )
    }
  ];

  return (
    <div className="admin-accordion" style={styles.accordion}>
      {sections.map((section) => (
        <div key={section.id} className="accordion-item" style={styles.accordionItem}>
          <button
            className="accordion-header"
            onClick={() => {
              if (section.onClick) {
                // ✅ CASO ESPECIAL: Comandas abre drawer directamente
                section.onClick();
              } else {
                // ✅ CASO NORMAL: expandir/colapsar
                setOpenSection(openSection === section.id ? null : section.id);
              }
            }}
            style={styles.accordionHeader(openSection === section.id)}
          >
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>{section.icon}</span>
              <span style={styles.headerTitle}>{section.title}</span>
            </div>
            
            <div style={styles.headerRight}>
              {section.badge && (
                <span style={styles.badge(section.badgeColor)}>
                  {section.badge}
                </span>
              )}
              {/* ✅ Mostrar chevron solo si NO tiene onClick (expandible) */}
              
                <span style={styles.chevron}>
                  {openSection === section.id ? '▼' : '▶'}
                </span>
              
            </div>
          </button>

          {/* ✅ Contenido solo si existe y está abierto */}
          {!section.onClick && openSection === section.id && section.content && (
            <div className="accordion-content" style={styles.accordionContent}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// ESTILOS
// ============================================
const styles = {
  acordeonContainer: {
    width: '95%',
    maxWidth: '350px', // 👈 Reducción: Más estrecho para iPhone
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px' // Espacio entre pestañas
  },
   itemAcordeon: {
    background: 'white',
    borderRadius: '16px', // Bordes suaves tipo iOS
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    border: '1px solid #f0f0f0'
  },
  acordeonHeader: (isOpen) => ({
   width: '100%',
    padding: '0.9rem 1.2rem', // 👈 Relleno reducido: Menos altura
    background: isOpen? '#fdfdfd' : 'white',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  }),
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerIcon: {
    fontSize: '1.2rem'
  },
  headerTitle: {
    fontSize: '0.95rem', fontWeight: '600', color: '#333'
  },
  headerRight: {
     display: 'flex', alignItems: 'center', gap: '10px' 
  },
  badge: (color) => ({
    background: color,
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  }),
  chevron: {
    fontSize: '0.8rem', color: '#999'
  },
  accordionContent: {
    padding: '1.5rem',
    background: 'white'
  },
  totalDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    marginBottom: '1rem',
    border: '2px solid var(--borde-tropical)'
  },
  totalLabel: {
    color: 'var(--gris-texto)',
    fontWeight: '600'
  },
  totalAmount: {
    color: 'var(--verde-selva)',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  cardDescription: {
    color: 'var(--gris-secundario)',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    lineHeight: 1.4
  },
  actionBtn: {
    width: '100%',
    marginTop: '0.5rem',
    padding: '0.8rem 1.5rem',
    borderRadius: '40px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'var(--morado-primario)',
    color: 'white'
  },
  sinPedidos: {
    textAlign: 'center',
    color: 'var(--gris-secundario)',
    padding: '2rem',
    fontStyle: 'italic'
  },
  resumenVentas: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid var(--borde-tropical)'
  },
  ventasTotal: {
    color: 'var(--rojo-cierre)',
    fontSize: '1.1rem'
  },
  cierreBtn: {
    background: 'var(--rojo-cierre)',
    color: 'white',
    width: '100%',
    padding: '0.8rem 1.5rem',
    borderRadius: '40px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};