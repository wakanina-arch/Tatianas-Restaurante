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
          <p style={styles.cardDescription}>Configura Menú Diario y agrega precios e imágenes</p>
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
    {
      id: 'comandas',
      title: '👨‍🍳 Comandas',
      icon: '👨‍🍳',
      badge: pendingOrders.length || null,
      badgeColor: 'var(--maracuya)',
      content: null,
      onClick: onOpenOrders
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
    <div className="admin-accordion" style={styles.acordeonContainer}>
      {sections.map((section) => (
        <div key={section.id} className="accordion-item" style={styles.itemAcordeon}>
          <button
            className="accordion-header"
            onClick={() => {
              if (section.onClick) {
                section.onClick();
              } else {
                setOpenSection(openSection === section.id ? null : section.id);
              }
            }}
            // ✅ CORREGIDO: Usar acordeonHeader (con 'e') como función
            style={styles.acordeonHeader(openSection === section.id)}
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
              {/* ✅ Mostrar chevron solo si es expandible */}
              {!section.onClick && (
                <span style={styles.chevron}>
                  {openSection === section.id ? '▼' : '▶'}
                </span>
              )}
            </div>
          </button>

          {/* ✅ Contenido solo si existe, está abierto y es expandible */}
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
// ESTILOS CORREGIDOS Y ALINEADOS CON IPHONE 16
// ============================================
const styles = {
  acordeonContainer: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '1rem'
  },
  itemAcordeon: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.2s ease'
  },
  // ✅ CORREGIDO: Nombre consistente (acordeonHeader, no accordionHeader)
  acordeonHeader: (isOpen) => ({
    width: '100%',
    padding: '1rem 1.2rem',
    background: isOpen ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  }),
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerIcon: {
    fontSize: '1.3rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
  },
  headerTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--verde-selva)',
    letterSpacing: '0.3px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  badge: (color) => ({
    background: color,
    color: 'white',
    padding: '4px 10px',
    borderRadius: '30px',
    fontSize: '0.7rem',
    fontWeight: '700',
    minWidth: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  }),
  chevron: {
    fontSize: '0.8rem',
    color: 'var(--maracuya)',
    transition: 'transform 0.2s ease'
  },
  accordionContent: {
    padding: '1.2rem 1.5rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.5)',
    borderTop: '1px solid rgba(255, 179, 71, 0.1)'
  },
  totalDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'white',
    borderRadius: '20px',
    marginBottom: '1rem',
    border: '1px solid rgba(255, 179, 71, 0.2)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  },
  totalLabel: {
    color: 'var(--gris-texto)',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  totalAmount: {
    color: 'var(--verde-selva)',
    fontSize: '1.6rem',
    fontWeight: '700',
    lineHeight: 1
  },
  cardDescription: {
    color: 'var(--gris-texto)',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    lineHeight: 1.5,
    opacity: 0.8
  },
  actionBtn: {
    width: '100%',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
  },
  sinPedidos: {
    textAlign: 'center',
    color: 'var(--gris-texto)',
    padding: '1.5rem',
    fontStyle: 'italic',
    fontSize: '0.9rem',
    opacity: 0.7
  },
  resumenVentas: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    background: 'white',
    borderRadius: '16px',
    marginBottom: '1rem',
    border: '1px solid rgba(255, 179, 71, 0.2)'
  },
  ventasTotal: {
    color: '#ff3b30',
    fontSize: '1.1rem',
    fontWeight: '700'
  },
  cierreBtn: {
    background: 'linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%)',
    color: 'white',
    width: '100%',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(255, 59, 48, 0.2)'
  }
};