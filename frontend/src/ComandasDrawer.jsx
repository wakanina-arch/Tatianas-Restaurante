import React, { useState } from 'react';

export default function OrdersDrawer({ open, onClose, pendingOrders, setPendingOrders, finishedOrders, setFinishedOrders, addLog }) {
  const [expanded, setExpanded] = useState(null);

  if (!open) return null;

  // --- 🚦 LÓGICA DE TRASPASO KANBAN (COCINA -> TAQUILLA) ---
  const marcarComoTerminado = (idx) => {
    const pedidoFinalizado = pendingOrders[idx];
    
    // 1. Movemos a Taquilla (finishedOrders)
    setFinishedOrders(prev => [...prev, { ...pedidoFinalizado, estado: 'Listo' }]);
    
    // 2. Eliminamos de Cocina (pendingOrders)
    setPendingOrders(prev => prev.filter((_, i) => i !== idx));
    
    setExpanded(null);

    if (addLog) {
      addLog({
        id: Date.now(),
        tipo: 'PROCESO',
        pedido: pedidoFinalizado.id,
        usuario: pedidoFinalizado.cliente,
        hora: new Date().toLocaleTimeString(),
        detalle: `Cocción terminada - Enviado a Taquilla`
      });
    }
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer" style={kanbanDrawerStyle}>
        <div style={headerStyle}>
          <h2 style={{ color: "var(--selva-deep)", margin: 0, fontFamily: 'Fraunces' }}>👨‍🍳 Control de Comandas</h2>
          <button onClick={onClose} style={closeXStyle}>✕</button>
        </div>

        <div style={kanbanGridStyle}>
          
          {/* COLUMNA: EN COCINA */}
          <div style={columnStyle}>
            <h3 style={columnTitleStyle}>🔥 EN COCINA</h3>
            {pendingOrders.length === 0 ? (
              <p style={{textAlign:'center', fontSize:'0.8rem', color:'#999'}}>No hay pedidos pendientes</p>
            ) : (
              pendingOrders.map((order, idx) => (
                <div key={order.id || idx} style={cardStyle}>
                  <div style={cardHeader}>
                    <strong>#{order.id}</strong>
                    <span style={timeStyle}>{order.hora}</span>
                  </div>
                  <p style={{margin: '5px 0', fontSize: '0.85rem'}}>Mesa: {order.mesa} | {order.cliente}</p>
                  
                  <button 
                    style={btnVerdeStyle}
                    onClick={() => marcarComoTerminado(idx)}
                  >
                    ● TERMINAR COCCIÓN
                  </button>

                  <div style={itemsListStyle}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{fontSize: '0.8rem'}}>• {item.cantidad}x {item.nombre}</div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* COLUMNA: EN TAQUILLA (LECTURA) */}
          <div style={columnStyle}>
            <h3 style={columnTitleStyle}>🛎️ EN TAQUILLA</h3>
            {finishedOrders.length === 0 ? (
              <p style={{textAlign:'center', fontSize:'0.8rem', color:'#999'}}>Esperando platos...</p>
            ) : (
              finishedOrders.map((order, idx) => (
                <div key={order.id || idx} style={{...cardStyle, borderLeft: '5px solid #ff4757'}}>
                  <div style={cardHeader}>
                    <strong>#{order.id}</strong>
                    <span style={{color: '#ff4757', fontWeight: 'bold', fontSize:'0.7rem'}}>LISTO</span>
                  </div>
                  <div style={{fontSize: '0.8rem', color: '#666'}}>
                    {order.items.length} productos listos para entrega física.
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        <button style={closeBtnStyle} onClick={onClose}>
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}

// --- 🎨 ESTILOS (DEFINIDOS FUERA DE LA FUNCIÓN PRINCIPAL) ---
const kanbanDrawerStyle = { 
  width: '850px', maxWidth: '95%', background: 'white', height: '100%', 
  padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' 
};

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' };

const kanbanGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, overflowY: 'auto' };

const columnStyle = { background: '#f4f7f6', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' };

const columnTitleStyle = { fontSize: '0.75rem', letterSpacing: '2px', textAlign: 'center', color: '#7f8c8d', fontWeight: '700', textTransform: 'uppercase' };

const cardStyle = { background: 'white', borderRadius: '10px', padding: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };

const cardHeader = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' };

const timeStyle = { fontSize: '0.75rem', color: '#999' };

const itemsListStyle = { marginTop: '10px', padding: '8px', background: '#fafafa', borderRadius: '6px' };

const btnVerdeStyle = {
  width: '100%', padding: '10px', background: '#27ae60', color: 'white', border: 'none', 
  borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem'
};

const closeXStyle = { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#ccc' };

const closeBtnStyle = {
  marginTop: '2rem', width: '100%', background: 'var(--selva-deep)', color: 'white',
  border: 'none', borderRadius: '12px', fontWeight: 'bold', padding: '15px', cursor: 'pointer'
};
