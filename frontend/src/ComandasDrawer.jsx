import React, { useState } from 'react';

export default function ComandasDrawer({ 
  open, 
  onClose, 
  pendingOrders = [], 
  setPendingOrders, 
  finishedOrders = [], 
  setFinishedOrders, 
  archivedOrders = [],
  setArchivedOrders,
  addLog
}) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showEntrada, setShowEntrada] = useState(true);
  const [showSalida, setShowSalida] = useState(true);
  const [showArchivados, setShowArchivados] = useState(false);

  // ============================================
  // PASO 1: De COCINA a CAJA RÁPIDA
  // ============================================
  const enviarACajaRapida = (order, index) => {
    const cajaOrder = {
      ...order,
      estado: 'listo',
      tiempoListo: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setFinishedOrders(prev => [...prev, cajaOrder]);
    setPendingOrders(prev => prev.filter((_, i) => i !== index));
    
    if (addLog) {
      addLog({
        tipo: 'Cocina → Caja',
        pedido: order.id,
        detalle: `📦 Pedido #${order.id} listo para entregar`
      });
    }
    setExpandedOrder(null);
  };

  // ============================================
  // PASO 2: De CAJA RÁPIDA a ARCHIVADOS
  // (Esta función la llamará EntregaPedido.jsx)
  // ============================================
  const entregarPedido = (order) => {
    const archivedOrder = {
      ...order,
      entregadoEn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setArchivedOrders(prev => [...prev, archivedOrder]);
    setFinishedOrders(prev => prev.filter(o => o.id !== order.id));
    
    if (addLog) {
      addLog({
        tipo: 'Entrega',
        pedido: order.id,
        detalle: `✅ Pedido #${order.id} entregado al cliente`
      });
    }
  };

  // ============================================
  // Iniciar preparación
  // ============================================
  const iniciarPreparacion = (order, index) => {
    const updatedOrder = {
      ...order,
      estado: 'preparacion',
      inicioPreparacion: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedPending = [...pendingOrders];
    updatedPending[index] = updatedOrder;
    setPendingOrders(updatedPending);
    setExpandedOrder(null);
  };

  if (!open) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer drawer--cocina" onClick={e => e.stopPropagation()}>
        
        <div className="drawer-header">
          <h2>👨‍🍳 PANEL DE COCINA</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* ======================================== */}
        {/* COCINA */}
        {/* ======================================== */}
        <div style={styles.acumulador}>
          <button style={styles.acumuladorHeader} onClick={() => setShowEntrada(!showEntrada)}>
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>👨‍🍳</span>
              <span style={styles.headerTitle}>COCINA ({pendingOrders.length})</span>
            </div>
            <span style={styles.chevron}>{showEntrada ? '▼' : '▶'}</span>
          </button>

          {showEntrada && (
            <div style={styles.acumuladorContent}>
              {pendingOrders.length === 0 ? (
                <p style={styles.emptyText}>No hay pedidos en cocina</p>
              ) : (
                pendingOrders.map((order, idx) => {
                  const isExpanded = expandedOrder === order.id;
                  
                  return (
                    <div key={order.id} style={styles.orderCard}>
                      <div style={styles.orderHeader} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                        <div style={styles.orderMainInfo}>
                          <span style={styles.orderId}>#{order.id}</span>
                          <span style={styles.orderComanda}>Comanda {order.comanda || order.mesa}</span>
                          
                          {/* BOTÓN "En Preparación" - Envía a CAJA RÁPIDA */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              enviarACajaRapida(order, idx);
                            }}
                            style={{
                              ...styles.estadoBadge,
                              background: '#f39c12',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            🍳 en-Preparación
                          </button>
                        </div>
                        <span style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
                      </div>

                      {isExpanded && (
                        <div style={styles.orderDetails}>
                          <p>👤 {order.cliente || 'Cliente'}</p>
                          <ul style={styles.itemsList}>
                            {order.items?.map((item, i) => (
                              <li key={i} style={styles.itemRow}>
                                <span>{item.cantidad} x {item.nombre}</span>
                                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <div style={styles.orderFooter}>
                            <strong>Total: ${order.total?.toFixed(2)}</strong>
                            {order.estado === 'nuevo' && (
                              <button style={styles.actionButton} onClick={(e) => {
                                e.stopPropagation();
                                enviarACajaRapida(order, idx);
                              }}>
                                ▶ Iniciar
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* CAJA RÁPIDA - SOLO CONTADOR (SIN BOTÓN) */}
        {/* ======================================== */}
        <div style={{...styles.acumulador, marginTop: '1rem'}}>
          <button style={styles.acumuladorHeader} onClick={() => setShowSalida(!showSalida)}>
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>💰</span>
              <span style={styles.headerTitle}>CAJA RÁPIDA ({finishedOrders.length})</span>
            </div>
            <span style={styles.chevron}>{showSalida ? '▼' : '▶'}</span>
          </button>

          {showSalida && (
            <div style={styles.acumuladorContent}>
              {finishedOrders.length === 0 ? (
                <p style={styles.emptyText}>No hay pedidos en caja</p>
              ) : (
                finishedOrders.map((order) => {
                  const isExpanded = expandedOrder === `caja-${order.id}`;
                  
                  return (
                    <div key={order.id} style={{...styles.orderCard, borderLeftColor: '#27ae60'}}>
                      <div style={styles.orderHeader} onClick={() => setExpandedOrder(isExpanded ? null : `caja-${order.id}`)}>
                        <div style={styles.orderMainInfo}>
                          <span style={styles.orderId}>#{order.id}</span>
                          <span style={styles.orderComanda}>Comanda {order.comanda || order.mesa}</span>
                          <span style={{...styles.estadoBadge, background: '#27ae60'}}>
                            ✅ Listo-Entregar
                          </span>
                        </div>
                        <span style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
                      </div>

                      {isExpanded && (
                        <div style={styles.orderDetails}>
                          <p>👤 {order.cliente || 'Cliente'}</p>
                          <ul style={styles.itemsList}>
                            {order.items?.map((item, i) => (
                              <li key={i} style={styles.itemRow}>
                                <span>{item.cantidad} x {item.nombre}</span>
                                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <div style={styles.orderFooter}>
                            <strong>Total: ${order.total?.toFixed(2)}</strong>
                            <span style={styles.orderTime}>Listo: {order.tiempoListo}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* ARCHIVADOS */}
        {/* ======================================== */}
        <div style={{...styles.acumulador, marginTop: '1rem', borderColor: '#95a5a6'}}>
          <button style={{...styles.acumuladorHeader, background: '#ecf0f1'}} onClick={() => setShowArchivados(!showArchivados)}>
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>🗂️</span>
              <span style={{...styles.headerTitle, color: '#7f8c8d'}}>ARCHIVADOS ({archivedOrders.length})</span>
            </div>
            <span style={styles.chevron}>{showArchivados ? '▼' : '▶'}</span>
          </button>

          {showArchivados && (
            <div style={styles.acumuladorContent}>
              {archivedOrders.length === 0 ? (
                <p style={styles.emptyText}>No hay pedidos archivados</p>
              ) : (
                archivedOrders.map((order) => {
                  const isExpanded = expandedOrder === `archivo-${order.id}`;
                  
                  return (
                    <div key={order.id} style={{...styles.orderCard, borderLeftColor: '#95a5a6', opacity: 0.8}}>
                      <div style={styles.orderHeader} onClick={() => setExpandedOrder(isExpanded ? null : `archivo-${order.id}`)}>
                        <div style={styles.orderMainInfo}>
                          <span style={styles.orderId}>#{order.id}</span>
                          <span style={styles.orderComanda}>Comanda {order.comanda || order.mesa}</span>
                          <span style={{...styles.estadoBadge, background: '#95a5a6'}}>🗂️ Entregado</span>
                        </div>
                        <span style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
                      </div>

                      {isExpanded && (
                        <div style={styles.orderDetails}>
                          <p>👤 {order.cliente || 'Cliente'}</p>
                          <ul style={styles.itemsList}>
                            {order.items?.map((item, i) => (
                              <li key={i} style={styles.itemRow}>
                                <span>{item.cantidad} x {item.nombre}</span>
                                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <div style={styles.orderFooter}>
                            <strong>Total: ${order.total?.toFixed(2)}</strong>
                            <span style={styles.orderTime}>Entregado: {order.entregadoEn}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Resumen */}
        <p style={styles.debugNote}>
          📊 Cocina: {pendingOrders.length} | Caja: {finishedOrders.length} | Archivados: {archivedOrders.length}
        </p>
      </div>
    </div>
  );
}

// ============================================
// EXPONEMOS entregarPedido para que lo use EntregaPedido.jsx
// ============================================
// NOTA: Esta función se pasa al componente padre (AdminPage)
// y luego a EntregaPedido como prop

const styles = {
  acumulador: { background: 'white', borderRadius: '12px', border: '2px solid var(--borde-tropical)', overflow: 'hidden', marginBottom: '0.5rem' },
  acumuladorHeader: { width: '100%', padding: '1rem', background: 'var(--crema-tropical)', border: 'none', borderBottom: '2px solid var(--borde-tropical)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  headerIcon: { fontSize: '1.2rem' },
  headerTitle: { fontSize: '1rem', color: 'var(--verde-selva)' },
  chevron: { color: 'var(--gris-secundario)' },
  acumuladorContent: { padding: '0.5rem', maxHeight: '300px', overflowY: 'auto' },
  emptyText: { textAlign: 'center', color: 'var(--gris-secundario)', padding: '2rem', fontStyle: 'italic' },
  orderCard: { background: 'white', borderRadius: '8px', marginBottom: '0.5rem', border: '2px solid var(--borde-tropical)', overflow: 'hidden' },
  orderHeader: { padding: '0.8rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' },
  orderMainInfo: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  orderId: { fontWeight: 'bold', color: 'var(--verde-selva)' },
  orderComanda: { color: 'var(--maracuya)', fontSize: '0.9rem' },
  estadoBadge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: 'white', fontWeight: '500' },
  orderRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  orderTime: { color: 'var(--gris-secundario)', fontSize: '0.8rem' },
  expandIcon: { color: 'var(--gris-secundario)' },
  orderDetails: { padding: '0.8rem', borderTop: '1px dashed var(--borde-tropical)', background: 'white' },
  itemsList: { listStyle: 'none', padding: 0, margin: '0 0 0.5rem 0' },
  itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.2rem 0', borderBottom: '1px dotted #eee' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' },
  actionButton: { background: '#3498db', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' },
  debugNote: { textAlign: 'center', fontSize: '0.8rem', color: '#999', marginTop: '1rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '8px' }
};

// Estilos globales
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .drawer-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
  .drawer--cocina { width: 90%; max-width: 600px; max-height: 80vh; background: white; border-radius: 20px; padding: 1.5rem; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--gris-secundario); }
  .close-btn:hover { color: var(--rojo-cierre); }
`;
document.head.appendChild(styleSheet);