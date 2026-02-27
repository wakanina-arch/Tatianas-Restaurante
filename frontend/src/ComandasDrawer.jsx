import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

// ============================================
// ORDERS DRAWER - SISTEMA KANBAN DE COCINA
// Flujo: Nuevo → Preparación → Listo → Despachado
// ============================================

// Estados posibles en el flujo Kanban
const ORDER_STATES = {
  NUEVO: { id: 'nuevo', label: '🆕 Nuevo', color: '#3498db', next: 'preparacion' },
  PREPARACION: { id: 'preparacion', label: '👨‍🍳 En preparación', color: '#f39c12', next: 'listo' },
  LISTO: { id: 'listo', label: '✅ Listo para entregar', color: '#27ae60', next: 'despachado' },
  DESPACHADO: { id: 'despachado', label: '🚚 Despachado', color: '#95a5a6', next: null }
};

// Tiempo estimado de preparación por tipo de plato (en minutos)
const PREP_TIME_BY_TYPE = {
  'Primero': 8,
  'Segundo': 12,
  'Postre': 5
};

export default function ComandasDrawer({ 
  open, 
  onClose, 
  pendingOrders = [], 
  setPendingOrders, 
  finishedOrders = [], 
  setFinishedOrders, 
  addLog 
}) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterState, setFilterState] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [timer, setTimer] = useState({});

  // ============================================
  // EFECTOS Y TIMERS
  // ============================================
  
  // Actualizar timers cada minuto para pedidos en preparación
  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const newTimers = {};
      
      [...pendingOrders, ...finishedOrders].forEach(order => {
        if (order.estado === ORDER_STATES.PREPARACION.id && order.inicioPreparacion) {
          const inicio = new Date(order.inicioPreparacion);
          const elapsed = Math.floor((now - inicio) / 60000); // minutos transcurridos
          const estimado = order.tiempoEstimado || 10;
          newTimers[order.id] = {
            elapsed,
            estimado,
            progress: Math.min(100, (elapsed / estimado) * 100),
            isOverdue: elapsed > estimado
          };
        }
      });
      
      setTimer(newTimers);
    }, 60000); // actualizar cada minuto
    
    return () => clearInterval(interval);
  }, [open, pendingOrders, finishedOrders]);

  // ============================================
  // FUNCIONES DE CAMBIO DE ESTADO
  // ============================================

  /**
   * Avanza un pedido al siguiente estado en el flujo
   */
  const avanzarEstado = (order, index, currentState) => {
    const nextStateId = ORDER_STATES[currentState]?.next;
    if (!nextStateId) return;

    const updatedOrder = {
      ...order,
      estado: nextStateId,
      ...(nextStateId === ORDER_STATES.PREPARACION.id && { 
        inicioPreparacion: new Date().toISOString(),
        tiempoEstimado: calcularTiempoEstimado(order.items)
      }),
      ...(nextStateId === ORDER_STATES.LISTO.id && { 
        tiempoListo: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }),
      ...(nextStateId === ORDER_STATES.DESPACHADO.id && { 
        horaDespacho: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    };

    // Actualizar listas según el nuevo estado
    if (nextStateId === ORDER_STATES.DESPACHADO.id) {
      // Mover a terminados
      setFinishedOrders(prev => [...prev, updatedOrder]);
      setPendingOrders(prev => prev.filter((_, i) => i !== index));
      
      // Registrar en log
      if (addLog) {
        addLog({
          tipo: 'Salida',
          pedido: order.id,
          usuario: order.cliente || 'Mesa ' + order.mesa,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          detalle: `Pedido entregado - Total: $${order.total?.toFixed(2)}`
        });
      }
    } else {
      // Actualizar en pendingOrders
      const updatedPending = [...pendingOrders];
      updatedPending[index] = updatedOrder;
      setPendingOrders(updatedPending);
    }

    // Notificación visual (podría ser un toast)
    mostrarNotificacion(order, nextStateId);
    setExpandedOrder(null);
  };

  /**
   * Calcula el tiempo estimado basado en los items del pedido
   */
  const calcularTiempoEstimado = (items) => {
    if (!items || items.length === 0) return 10;
    
    let totalTime = 0;
    items.forEach(item => {
      const tipo = Object.keys(PREP_TIME_BY_TYPE).find(t => 
        item.nombre?.toLowerCase().includes(t.toLowerCase())
      ) || 'Segundo';
      totalTime += PREP_TIME_BY_TYPE[tipo] * (item.cantidad || 1);
    });
    
    // Tiempo base + tiempo por items (con un mínimo de 5 min)
    return Math.max(5, Math.ceil(totalTime / 2));
  };

  /**
   * Muestra notificación del cambio de estado
   */
  const mostrarNotificacion = (order, nuevoEstado) => {
    const estadoLabel = Object.values(ORDER_STATES).find(s => s.id === nuevoEstado)?.label;
    
    // Usar Notification API si está disponible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Pedido #${order.id}`, {
        body: `${estadoLabel} - Mesa ${order.mesa}`,
        icon: '/The-One-icon.png'
      });
    }
    
    // También podríamos integrar un sistema de toasts aquí
    console.log(`🔔 Pedido #${order.id}: ${estadoLabel}`);
  };

  // ============================================
  // FUNCIONES DE FILTRADO
  // ============================================

  /**
   * Filtra pedidos según estado y término de búsqueda
   */
  const filtrarPedidos = (orders) => {
    return orders.filter(order => {
      // Filtro por estado
      if (filterState !== 'todos' && order.estado !== filterState) {
        return false;
      }
      
      // Filtro por búsqueda
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          order.id?.toLowerCase().includes(term) ||
          order.cliente?.toLowerCase().includes(term) ||
          `mesa ${order.mesa}`.includes(term) ||
          order.items?.some(item => item.nombre?.toLowerCase().includes(term))
        );
      }
      
      return true;
    });
  };

  // ============================================
  // RENDERIZADO DE COMPONENTES
  // ============================================

  if (!open) return null;

  const pedidosFiltrados = filtrarPedidos(pendingOrders);
  const terminadosFiltrados = filtrarPedidos(finishedOrders);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <h2>👨‍🍳 Panel de Cocina - Kanban</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Controles de filtro */}
        <div style={styles.filterBar}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar pedido, mesa, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.stateFilters}>
            <button
              style={{...styles.filterChip, ...(filterState === 'todos' ? styles.filterChipActive : {})}}
              onClick={() => setFilterState('todos')}
            >
              Todos
            </button>
            {Object.values(ORDER_STATES).map(state => (
              <button
                key={state.id}
                style={{
                  ...styles.filterChip,
                  ...(filterState === state.id ? styles.filterChipActive : {}),
                  borderLeft: `3px solid ${state.color}`
                }}
                onClick={() => setFilterState(state.id)}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div style={styles.statsBar}>
          <span style={styles.statItem}>
            <span style={styles.statValue}>{pendingOrders.length}</span>
            <span style={styles.statLabel}>En cocina</span>
          </span>
          <span style={styles.statItem}>
            <span style={styles.statValue}>
              {pendingOrders.filter(o => o.estado === ORDER_STATES.LISTO.id).length}
            </span>
            <span style={styles.statLabel}>Listos</span>
          </span>
          <span style={styles.statItem}>
            <span style={styles.statValue}>
              {Object.values(timer).filter(t => t.isOverdue).length}
            </span>
            <span style={styles.statLabel}>Atrasados</span>
          </span>
          <span style={styles.statItem}>
            <span style={styles.statValue}>{finishedOrders.length}</span>
            <span style={styles.statLabel}>Despachados</span>
          </span>
        </div>

        {/* Tablero Kanban */}
        <div style={styles.kanbanBoard}>
          {/* Columna: Pendientes */}
          <div style={styles.kanbanColumn}>
            <div style={{...styles.columnHeader, background: ORDER_STATES.NUEVO.color + '20'}}>
              <h3>🆕 Nuevos</h3>
              <span style={styles.columnCount}>
                {pendingOrders.filter(o => o.estado === ORDER_STATES.NUEVO.id).length}
              </span>
            </div>
            <div style={styles.columnContent}>
              {renderizarPedidosPorEstado(pendingOrders, ORDER_STATES.NUEVO.id)}
            </div>
          </div>

          {/* Columna: En preparación */}
          <div style={styles.kanbanColumn}>
            <div style={{...styles.columnHeader, background: ORDER_STATES.PREPARACION.color + '20'}}>
              <h3>👨‍🍳 Preparación</h3>
              <span style={styles.columnCount}>
                {pendingOrders.filter(o => o.estado === ORDER_STATES.PREPARACION.id).length}
              </span>
            </div>
            <div style={styles.columnContent}>
              {renderizarPedidosPorEstado(pendingOrders, ORDER_STATES.PREPARACION.id)}
            </div>
          </div>

          {/* Columna: Listos */}
          <div style={styles.kanbanColumn}>
            <div style={{...styles.columnHeader, background: ORDER_STATES.LISTO.color + '20'}}>
              <h3>✅ Listos</h3>
              <span style={styles.columnCount}>
                {pendingOrders.filter(o => o.estado === ORDER_STATES.LISTO.id).length}
              </span>
            </div>
            <div style={styles.columnContent}>
              {renderizarPedidosPorEstado(pendingOrders, ORDER_STATES.LISTO.id)}
            </div>
          </div>
        </div>

        {/* Sección de pedidos despachados (colapsable) */}
        <details style={styles.finishedSection}>
          <summary style={styles.finishedSummary}>
            <span>📦 Pedidos Despachados ({finishedOrders.length})</span>
            <span style={styles.expandIcon}>▼</span>
          </summary>
          <div style={styles.finishedList}>
            {terminadosFiltrados.length === 0 ? (
              <p style={styles.emptyText}>No hay pedidos despachados hoy</p>
            ) : (
              terminadosFiltrados.map((order, idx) => (
                <div key={order.id || idx} style={styles.finishedCard}>
                  <div style={styles.finishedHeader}>
                    <span style={styles.finishedId}>#{order.id}</span>
                    <span style={styles.finishedTime}>{order.horaDespacho}</span>
                  </div>
                  <div style={styles.finishedInfo}>
                    Mesa {order.mesa} · {order.cliente || 'Cliente'}
                  </div>
                  <div style={styles.finishedTotal}>
                    Total: <strong>${order.total?.toFixed(2)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </details>
      </div>
    </div>
  );

  // ============================================
  // FUNCIONES AUXILIARES DE RENDERIZADO
  // ============================================

  function renderizarPedidosPorEstado(orders, estadoId) {
    const pedidosFiltrados = orders.filter(o => o.estado === estadoId);
    
    if (pedidosFiltrados.length === 0) {
      return <p style={styles.emptyColumn}>Sin pedidos</p>;
    }

    return pedidosFiltrados.map((order, idx) => {
      const indexEnLista = orders.findIndex(o => o.id === order.id);
      const orderTimer = timer[order.id];
      const isExpanded = expandedOrder === order.id;
      
      return (
        <div
          key={order.id}
          style={{
            ...styles.orderCard,
            ...(orderTimer?.isOverdue ? styles.orderCardOverdue : {}),
            ...(isExpanded ? styles.orderCardExpanded : {})
          }}
        >
          {/* Header de la card */}
          <div style={styles.orderCardHeader} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
            <div style={styles.orderMainInfo}>
              <span style={styles.orderId}>#{order.id}</span>
              <span style={styles.orderMesa}>Mesa {order.mesa}</span>
            </div>
            
            {/* Timer si está en preparación */}
            {orderTimer && (
              <div style={styles.timerContainer}>
                <div style={{
                  ...styles.timerBar,
                  width: `${orderTimer.progress}%`,
                  background: orderTimer.isOverdue ? '#e74c3c' : '#27ae60'
                }} />
                <span style={styles.timerText}>
                  {orderTimer.elapsed}/{orderTimer.estimado} min
                </span>
              </div>
            )}
            
            <span style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
          </div>

          {/* Detalles expandidos */}
          {isExpanded && (
            <div style={styles.orderDetails}>
              <p style={styles.orderCliente}>👤 {order.cliente || 'Cliente'}</p>
              
              <ul style={styles.itemsList}>
                {order.items?.map((item, i) => (
                  <li key={i} style={styles.itemRow}>
                    <span>
                      {item.cantidad} x {item.nombre}
                      {item.notas && <span style={styles.itemNote}> 📝 {item.notas}</span>}
                    </span>
                    <span style={styles.itemPrice}>
                      ${(item.precio * (item.cantidad || 1)).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div style={styles.orderFooter}>
                <div style={styles.orderTotal}>
                  Total: <strong>${order.total?.toFixed(2)}</strong>
                </div>
                
                {/* Botón de acción según estado */}
                {ORDER_STATES[estadoId]?.next && (
                  <button
                    className="add-btn-small"
                    style={{
                      ...styles.actionButton,
                      background: ORDER_STATES[ORDER_STATES[estadoId].next].color
                    }}
                    onClick={() => avanzarEstado(order, indexEnLista, estadoId)}
                  >
                    {estadoId === ORDER_STATES.NUEVO.id && '▶ Iniciar'}
                    {estadoId === ORDER_STATES.PREPARACION.id && '✅ Marcar listo'}
                    {estadoId === ORDER_STATES.LISTO.id && '🚚 Entregar'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      );
    });
  }
}

// ============================================
// ESTILOS (integrados con el sistema)
// ============================================
const styles = {
  filterBar: {
    padding: '1rem',
    background: 'var(--crema-tropical)',
    borderBottom: '2px solid var(--borde-tropical)'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '30px',
    padding: '0.3rem 0.3rem 0.3rem 1rem',
    marginBottom: '1rem',
    border: '2px solid var(--borde-tropical)'
  },
  searchIcon: {
    opacity: 0.5,
    marginRight: '0.5rem'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    padding: '0.5rem',
    outline: 'none',
    fontSize: '0.95rem'
  },
  stateFilters: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  filterChip: {
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    background: 'white',
    border: '2px solid var(--borde-tropical)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.3s ease'
  },
  filterChipActive: {
    background: 'var(--mango)',
    color: 'var(--verde-selva)',
    borderColor: 'var(--maracuya)'
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
    padding: '1rem',
    background: 'white'
  },
  statItem: {
    textAlign: 'center',
    padding: '0.5rem',
    background: 'var(--crema-tropical)',
    borderRadius: '12px'
  },
  statValue: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--verde-selva)'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--gris-secundario)'
  },
  kanbanBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    padding: '1rem',
    minHeight: '400px'
  },
  kanbanColumn: {
    background: '#f8f9fa',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  columnHeader: {
    padding: '0.8rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid rgba(0,0,0,0.1)'
  },
  columnContent: {
    flex: 1,
    padding: '0.5rem',
    overflowY: 'auto',
    maxHeight: '500px'
  },
  columnCount: {
    background: 'rgba(0,0,0,0.1)',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.8rem'
  },
  emptyColumn: {
    textAlign: 'center',
    color: 'var(--gris-secundario)',
    padding: '1rem',
    fontStyle: 'italic'
  },
  orderCard: {
    background: 'white',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    border: '2px solid var(--borde-tropical)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  orderCardOverdue: {
    borderColor: '#e74c3c',
    background: 'rgba(231, 76, 60, 0.05)'
  },
  orderCardExpanded: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  },
  orderMainInfo: {
    display: 'flex',
    gap: '1rem'
  },
  orderId: {
    fontWeight: 'bold',
    color: 'var(--verde-selva)'
  },
  orderMesa: {
    color: 'var(--maracuya)'
  },
  timerContainer: {
    flex: 1,
    margin: '0 1rem',
    height: '20px',
    background: '#ecf0f1',
    borderRadius: '10px',
    position: 'relative',
    overflow: 'hidden'
  },
  timerBar: {
    height: '100%',
    transition: 'width 0.3s ease'
  },
  timerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.7rem',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  expandIcon: {
    color: 'var(--gris-secundario)',
    fontSize: '0.8rem'
  },
  orderDetails: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    borderTop: '1px dashed var(--borde-tropical)'
  },
  orderCliente: {
    fontSize: '0.9rem',
    color: 'var(--gris-texto)',
    marginBottom: '0.3rem'
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: '0.5rem 0'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    padding: '0.2rem 0',
    borderBottom: '1px dotted #eee'
  },
  itemNote: {
    fontSize: '0.75rem',
    color: 'var(--gris-secundario)',
    fontStyle: 'italic'
  },
  itemPrice: {
    fontWeight: '600'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem'
  },
  orderTotal: {
    fontSize: '0.9rem'
  },
  actionButton: {
    padding: '0.3rem 1rem',
    fontSize: '0.85rem',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  },
  finishedSection: {
    margin: '1rem',
    padding: '0.5rem',
    background: 'white',
    borderRadius: '12px',
    border: '2px solid var(--borde-tropical)'
  },
  finishedSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600'
  },
  finishedList: {
    padding: '0.5rem',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  finishedCard: {
    padding: '0.5rem',
    marginBottom: '0.3rem',
    background: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '0.85rem'
  },
  finishedHeader: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  finishedId: {
    fontWeight: 'bold',
    color: 'var(--gris-secundario)'
  },
  finishedTime: {
    color: '#999'
  },
  finishedInfo: {
    margin: '0.2rem 0'
  },
  finishedTotal: {
    fontSize: '0.8rem'
  },
  emptyText: {
    textAlign: 'center',
    color: 'var(--gris-secundario)',
    padding: '1rem'
  }
};

// Estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .order-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .filter-chip:hover {
    background: var(--mango);
    color: var(--verde-selva);
  }
  
  .action-button:hover {
    filter: brightness(1.1);
    transform: scale(1.02);
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  
  .order-card-overdue {
    animation: pulse 2s infinite;
  }
`;
document.head.appendChild(styleSheet);
