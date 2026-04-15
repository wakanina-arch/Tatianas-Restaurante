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

  // ============================================
  // LÓGICA DE MOVIMIENTO (Tus funciones originales)
  // ============================================

  const iniciarPreparacion = (order) => {
    const index = pendingOrders.findIndex(o => o.id === order.id);
    const updatedOrder = {
      ...order,
      estado: 'preparacion',
      inicioPreparacion: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedPending = [...pendingOrders];
    updatedPending[index] = updatedOrder;
    setPendingOrders(updatedPending);
    
    if (addLog) {
      addLog({
        tipo: 'Recepción → Producción',
        pedido: order.id,
        detalle: `🔥 Pedido #${order.id} entró a cocina`
      });
    }
  };

  const enviarACajaRapida = (order) => {
    const cajaOrder = {
      ...order,
      estado: 'listo',
      tiempoListo: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setFinishedOrders(prev => [...prev, cajaOrder]);
    setPendingOrders(prev => prev.filter(o => o.id !== order.id));
    
    if (addLog) {
      addLog({
        tipo: 'Producción → Entrega',
        pedido: order.id,
        detalle: `📦 Pedido #${order.id} listo en Estación de Entrega`
      });
    }
  };

  // ============================================
  // CLASIFICACIÓN POR ESTACIONES (Tu Esquema)
  // ============================================
  const pedidosRecepcion = pendingOrders.filter(o => !o.estado || o.estado === 'nuevo');
  const pedidosProduccion = pendingOrders.filter(o => o.estado === 'preparacion');

  if (!open) return null;

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.drawer} onClick={e => e.stopPropagation()}>
        
        <div style={S.header}>
          <h2 style={S.headerTitle}>👨‍🍳 GESTIÓN DE PRODUCCIÓN</h2>
          <button style={S.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={S.scrollArea}>

          {/* --- ESTACIÓN 1: RECEPCIÓN (Rojo en tu esquema) --- */}
          <div style={S.estacionSection}>
            <div style={{...S.estacionHeader, borderLeft: '6px solid #B22222'}}>
              <span>📥 RECEPCIÓN (Comanda +1)</span>
              <span style={S.badge}>{pedidosRecepcion.length}</span>
            </div>
            {pedidosRecepcion.map((order) => (
              <div key={order.id} style={S.orderCard}>
                <div style={S.cardMain}>
                  <strong>#{order.id} - {order.cliente || 'Cliente'}</strong>
                  <button onClick={() => iniciarPreparacion(order)} style={S.btnIniciar}>
                    ▶ Iniciar Producción
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- ESTACIÓN 2: PRODUCCIÓN (Naranja en tu esquema) --- */}
          <div style={S.estacionSection}>
            <div style={{...S.estacionHeader, borderLeft: '6px solid #FF8C00'}}>
              <span>🔥 PRODUCCIÓN (Comanda -1)</span>
              <span style={S.badge}>{pedidosProduccion.length}</span>
            </div>
            {pedidosProduccion.map((order) => (
              <div key={order.id} style={{...S.orderCard, borderColor: '#FF8C00'}}>
                <div style={S.cardMain}>
                  <strong>#{order.id}</strong>
                  <div style={S.itemsList}>
                    {order.items?.map((it, i) => <div key={i}>• {it.cantidad}x {it.nombre}</div>)}
                  </div>
                  <button onClick={() => enviarACajaRapida(order)} style={S.btnListo}>
                    ✅ Listo para Entrega
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- ESTACIÓN 3: ENTREGA (Azul/Verde en tu esquema) --- */}
          <div style={S.estacionSection}>
            <div style={{...S.estacionHeader, borderLeft: '6px solid #27ae60'}}>
              <span>📦 ENTREGA (+1 Comanda -1)</span>
              <span style={S.badge}>{finishedOrders.length}</span>
            </div>
            {finishedOrders.map((order) => (
              <div key={order.id} style={{...S.orderCard, borderColor: '#27ae60', opacity: 0.8}}>
                <div style={S.cardMain}>
                  <strong>#{order.id} - LISTO</strong>
                  <span style={{fontSize: '0.8rem'}}>Esperando verificación QR / Pago</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ============================================
// ESTILOS DINÁMICOS (Minimalistas)
// ============================================
const S = {
  backdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 5000, display: 'flex', justifyContent: 'flex-end' },
  drawer: { width: '100%', maxWidth: '400px', background: '#f4f4f4', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 20px rgba(0,0,0,0.3)' },
  header: { padding: '20px', background: '#1a1a1a', color: '#FFD700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { margin: 0, fontSize: '1.1rem', fontWeight: 'bold' },
  closeBtn: { background: 'none', border: 'none', color: '#FFD700', fontSize: '1.8rem', cursor: 'pointer' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '15px' },
  estacionSection: { marginBottom: '25px' },
  estacionHeader: { background: '#fff', padding: '10px 15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  badge: { background: '#333', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' },
  orderCard: { background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '12px', marginBottom: '10px', transition: 'all 0.3s' },
  cardMain: { display: 'flex', flexDirection: 'column', gap: '8px' },
  itemsList: { fontSize: '0.9rem', color: '#555', padding: '5px 0' },
  btnIniciar: { background: '#B22222', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnListo: { background: '#FF8C00', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
};
