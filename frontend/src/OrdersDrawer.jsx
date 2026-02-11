import React, { useState } from 'react';
import { useCart } from './CartContext';

// Simulación de datos de pedidos
const sampleOrders = [
  {
    id: 'ORD-001',
    cliente: 'Juan Pérez',
    mesa: 5,
    estado: 'En preparación',
    hora: '12:34',
    items: [
      { nombre: 'Primero - Menestra', cantidad: 1, precio: 5.5 },
      { nombre: 'Segundo - Pescado', cantidad: 2, precio: 8.0 },
      { nombre: 'Postre - Flan', cantidad: 1, precio: 4.5 }
    ],
    total: 26.0
  },
  {
    id: 'ORD-002',
    cliente: 'Ana López',
    mesa: 2,
    estado: 'En preparación',
    hora: '12:40',
    items: [
      { nombre: 'Primero - Pollo', cantidad: 1, precio: 5.5 },
      { nombre: 'Segundo - Camarón', cantidad: 1, precio: 8.0 }
    ],
    total: 13.5
  }
];

export default function OrdersDrawer({ open, onClose, pendingOrders, setPendingOrders, finishedOrders, setFinishedOrders, addLog }) {
  const [expanded, setExpanded] = useState(null);

  if (!open) return null;

  const handleStateChange = (idx) => {
    const order = pendingOrders[idx];
    setFinishedOrders(prev => [...prev, { ...order, estado: 'Despachado' }]);
    setPendingOrders(prev => prev.filter((_, i) => i !== idx));
    setExpanded(null);
    // Agregar registro de salida
    if (addLog) {
      addLog({
        id: Date.now(),
        tipo: 'Salida',
        pedido: order.id,
        usuario: order.cliente,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detalle: `Pedido entregado en mesa ${order.mesa}`
      });
    }
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer">
        <h2>Comandas del Día</h2>
        <button className="close-btn" onClick={onClose}>Cerrar</button>
        <div className="orders-list">
          <h3>Pedidos Pendientes</h3>
          {pendingOrders.length === 0 && <p>No hay pedidos pendientes.</p>}
          {pendingOrders.map((order, idx) => (
            <div key={order.id} className="order-block">
              <div className="order-summary" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                <span><b>#{order.id}</b> mesa {order.mesa} - {order.cliente}</span>
                <span>
                  <button
                    className={
                      'order-state-btn' + (order.estado === 'Despachado' ? '' : ' pending')
                    }
                    onClick={e => { e.stopPropagation(); handleStateChange(idx); }}
                  >
                    {order.estado === 'Despachado' ? 'Pedido despachado' : 'Pedido recibido'}
                  </button>
                  {' • '}{order.hora}
                </span>
                <span style={{marginLeft: 'auto'}}>{expanded === idx ? '▲' : '▼'}</span>
              </div>
              {expanded === idx && (
                <div className="order-details">
                  <ul>
                    {order.items.map((item, i) => (
                      <li key={i}>{item.cantidad} x {item.nombre} <span style={{float:'right'}}>${(item.precio * item.cantidad).toFixed(2)}</span></li>
                    ))}
                  </ul>
                  <div className="order-total">Total: <b>${order.total.toFixed(2)}</b></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="orders-list">
          <h3>Pedidos Terminados</h3>
          {finishedOrders.length === 0 && <p>No hay pedidos terminados.</p>}
          {finishedOrders.map((order, idx) => (
            <div key={order.id} className="order-block">
              <div className="order-summary">
                <span><b>#{order.id}</b> mesa {order.mesa} - {order.cliente}</span>
                <span>
                  <button className="order-state-btn" disabled>
                    Pedido despachado
                  </button>
                  {' • '}{order.hora}
                </span>
              </div>
              <div className="order-details">
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>{item.cantidad} x {item.nombre} <span style={{float:'right'}}>${(item.precio * item.cantidad).toFixed(2)}</span></li>
                  ))}
                </ul>
                <div className="order-total">Total: <b>${order.total.toFixed(2)}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
