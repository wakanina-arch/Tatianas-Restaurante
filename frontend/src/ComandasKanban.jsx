// ComandasKanban.jsx - Versión con globito naranja contador
import React from 'react';

export default function ComandasKanban({ pendingOrders, finishedOrders, setPendingOrders, setFinishedOrders, addLog }) {

  const entregarPedidoTaquilla = () => {
    if (pendingOrders.length > 0) {
      const primerPedido = pendingOrders[0];
      setPendingOrders(prev => prev.slice(1));
      setFinishedOrders(prev => [...prev, primerPedido]);
      
      if (addLog) {
        addLog({
          tipo: 'MAGIA',
          pedido: primerPedido.id,
          hora: new Date().toLocaleTimeString(),
          detalle: '✨ Pedido movido de COMANDAS a TAQUILLA'
        });
      }
    }
  };

  return (
    <div className="admin-card" style={cardStyle}>

      {/* 📋 COMANDAS 🟢3 */}
      <div style={headerStyle}>
        <span style={titleStyle}>📋 COMANDAS</span>
        <span style={badgeGreenStyle}>{pendingOrders.length}</span>
      </div>

      <hr style={separatorThickStyle} />

      {/* LISTA DE PEDIDOS EN COCINA */}
      {pendingOrders.length > 0 ? (
        pendingOrders.map((order) => (
          <div key={order.id} style={orderContainerStyle}>
            
            <div style={orderNumberStyle}>#ORD-{order.id}</div>
            <hr style={separatorLightStyle} />

            <div style={itemsContainerStyle}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={itemStyle}>
                  📦 {item.cantidad}x {item.nombre}
                </div>
              ))}
            </div>

            <div style={dotsStyle}>............................</div>
            <div style={dotsStyle}>::::::::::::::::::::::::::::</div>
          </div>
        ))
      ) : (
        <div style={emptyStateStyle}>🍳 Cocina vacía</div>
      )}

      <hr style={separatorLightStyle} />

      {/* 🛒 EN TAQUILLA 🟠2 (ahora con el contador aquí) */}
      <div style={taquillaHeaderStyle}>
        <span>🛒 EN TAQUILLA</span>
        <span style={badgeOrangeStyle}>{finishedOrders.length}</span>
      </div>

      <hr style={separatorThickStyle} />

      {/* Botón ENTREGAR (sin contador) */}
      <button
        style={{
          ...entregarBtnStyle,
          backgroundColor: pendingOrders.length > 0 ? '#e86108' : '#bdc3c7',
          cursor: pendingOrders.length > 0 ? 'pointer' : 'not-allowed'
        }}
        onClick={entregarPedidoTaquilla}
        disabled={pendingOrders.length === 0}
      >
        🚀 ENTREGAR
      </button>

    </div>
  );
}

// --- 🎨 ESTILOS (se mantienen igual) ---
const cardStyle = {
  background: 'white',
  borderRadius: '15px',
  padding: '1.5rem',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '2px solid #f0f0f0'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem'
};

const titleStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#333'
};

const badgeGreenStyle = {
  background: '#2ecc71',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 'bold'
};

const badgeOrangeStyle = {
  background: '#e86108',  // 🟠 NARANJA
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 'bold'
};

const separatorThickStyle = {
  border: 'none',
  borderTop: '2px solid #333',
  margin: '10px 0'
};

const separatorLightStyle = {
  border: 'none',
  borderTop: '1px dashed #ccc',
  margin: '10px 0'
};

const orderContainerStyle = {
  marginBottom: '20px'
};

const orderNumberStyle = {
  fontWeight: 'bold',
  color: '#764ba2',
  fontSize: '1.1rem',
  marginBottom: '5px'
};

const itemsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '10px'
};

const itemStyle = {
  fontSize: '0.95rem',
  color: '#555'
};

const dotsStyle = {
  textAlign: 'center',
  color: '#aaa',
  fontSize: '0.8rem',
  letterSpacing: '2px',
  margin: '8px 0'
};

const emptyStateStyle = {
  textAlign: 'center',
  color: '#999',
  padding: '30px',
  fontSize: '1rem'
};

const taquillaHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '10px 0'
};

const entregarBtnStyle = {
  width: '100%',
  padding: '15px',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  transition: '0.3s'
};