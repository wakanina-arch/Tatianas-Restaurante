import React, { useState } from 'react'; // 1. IMPORTANTE: Agregamos useState aquí

export default function OrdersLogDrawer({ open, onClose, log }) {
  const [filter, setFilter] = useState(''); // 2. El estado debe ir AQUÍ adentro

  if (!open) return null;

  const safeLog = Array.isArray(log) ? log : [];

  // 3. Lógica de filtrado
  const filteredLog = safeLog.filter(entry => 
    (entry.pedido?.toLowerCase().includes(filter.toLowerCase())) || 
    (entry.usuario?.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="drawer-backdrop">
      <div className="drawer">
        <h2>Registro de Entradas y Salidas</h2>
        <button className="close-btn" onClick={onClose}>Cerrar</button>
        
        {/* Buscador estilizado */}
        <input 
          type="text" 
          placeholder="🔍 Buscar por pedido o usuario..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd',
            fontSize: '1rem'
          }}
        />

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
  {/* 4. CAMBIO CLAVE: Mapeamos filteredLog y añadimos el índice (idx) */}
  {filteredLog.length > 0 ? (
    filteredLog.map((entry, idx) => (
      // Usamos el ID del entry, pero le sumamos el idx como respaldo
      <tr key={entry.id || idx}>
        <td>{entry.tipo}</td>
        <td>{entry.pedido}</td>
        <td>{entry.usuario}</td>
        <td>{entry.hora}</td>
        <td>{entry.detalle}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
        No se encontraron registros
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

