import React, { useState } from 'react';

// Simulación de registros de control
const sampleLog = [
  { id: 1, tipo: 'Entrada', pedido: 'ORD-001', usuario: 'Juan Pérez', hora: '12:34', detalle: 'Pedido recibido en cocina' },
  { id: 2, tipo: 'Salida', pedido: 'ORD-001', usuario: 'Carmen Ruiz', hora: '12:50', detalle: 'Pedido entregado en mesa 5' },
  { id: 3, tipo: 'Entrada', pedido: 'ORD-002', usuario: 'Ana López', hora: '12:40', detalle: 'Pedido recibido en cocina' },
  { id: 4, tipo: 'Salida', pedido: 'ORD-002', usuario: 'Carmen Ruiz', hora: '12:55', detalle: 'Pedido entregado en mesa 2' }
];

export default function OrdersLogDrawer({ open, onClose, log }) {
  if (!open) return null;

  const safeLog = Array.isArray(log) ? log : [];

  return (
    <div className="drawer-backdrop">
      <div className="drawer">
        <h2>Registro de Entradas y Salidas</h2>
        <button className="close-btn" onClick={onClose}>Cerrar</button>
        <div className="orders-log-list">
          <table className="orders-log-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Pedido</th>
                <th>Usuario</th>
                <th>Hora</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {safeLog.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.tipo}</td>
                  <td>{entry.pedido}</td>
                  <td>{entry.usuario}</td>
                  <td>{entry.hora}</td>
                  <td>{entry.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
