import React, { useState } from 'react';
import TicketModal from './TicketModal'; // Importamos el modal del ticket

export default function OrdersLogDrawer({ open, onClose, log }) {
  const [filter, setFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!open) return null;

  const safeLog = Array.isArray(log) ? log : [];

  // Filtrar registros
  const filteredLog = safeLog.filter(entry => 
    (entry.pedido?.toLowerCase().includes(filter.toLowerCase())) || 
    (entry.usuario?.toLowerCase().includes(filter.toLowerCase()))
  );

  // Función para abrir ticket
  const abrirTicket = (entry) => {
    setSelectedOrder(entry);
    setModalOpen(true);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 3000
      }}>
        <div style={{
          width: '600px',
          maxWidth: '90%',
          background: 'white',
          height: '100%',
          padding: '2rem',
          overflowY: 'auto',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
          borderRadius: '20px 0 0 20px'
        }}>
          
          {/* CABECERA VIKINGA */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            borderBottom: '3px solid #764ba2',
            paddingBottom: '1rem'
          }}>
            <h2 style={{ 
              color: '#764ba2', 
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: '800'
            }}>
              📋 REGISTRO DE CONTROL
            </h2>
            <button 
              onClick={onClose}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(244, 67, 54, 0.3)'
              }}
            >
              ✕
            </button>
          </div>

          {/* BUSCADOR ÉPICO (BAJO FOCO) */}
          <div style={{ marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="🔍 Buscar por #ORD-1234 o nombre..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px 20px', 
                borderRadius: '50px', 
                border: '2px solid #e9ecef',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s',
                background: '#f8f9fa',
                color: '#495057',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#764ba2'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          {/* LISTA DE REGISTROS */}
          <div className="orders-log-list">
            {filteredLog.length > 0 ? (
              filteredLog.map((entry, idx) => (
                <div 
                  key={entry.id || idx}
                  onClick={() => abrirTicket(entry)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.2rem',
                    marginBottom: '0.5rem',
                    background: idx % 2 === 0 ? '#f8f9fa' : '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f3f5';
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.borderColor = '#764ba2';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(118, 75, 162, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = idx % 2 === 0 ? '#f8f9fa' : '#ffffff';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.borderColor = '#e9ecef';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Lado izquierdo: Tipo + Pedido + Usuario */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: entry.tipo === '🍽️ Comida' ? '#4caf50' : 
                                   entry.tipo === '🥤 Bebida' ? '#2196f3' : '#ff9800',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      {entry.tipo || '📦 Otro'}
                    </span>
                    
                    <span style={{
                      background: '#764ba2',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace'
                    }}>
                      {entry.pedido || 'S/N'}
                    </span>
                    
                    <span style={{ fontWeight: '500', color: '#495057' }}>
                      {entry.usuario}
                    </span>
                  </div>

                  {/* Lado derecho: Hora + botón Ver */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                      color: '#868e96', 
                      fontSize: '0.9rem',
                      background: '#e9ecef',
                      padding: '0.3rem 1rem',
                      borderRadius: '20px'
                    }}>
                      {entry.hora || '--:--'}
                    </span>
                    
                    <span style={{
                      background: '#764ba2',
                      color: 'white',
                      padding: '0.3rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      ⏳ Ver Ticket
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#868e96',
                background: '#f8f9fa',
                borderRadius: '12px',
                fontSize: '1.1rem'
              }}>
                🧌 No se encontraron registros con ese filtro
              </div>
            )}
          </div>

          {/* PIE DE PÁGINA CON TOTALES */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-around',
            fontSize: '0.9rem'
          }}>
            <span>📋 Total: {filteredLog.length} registros</span>
            <span>🕒 Pendientes: {filteredLog.filter(e => e.estado === 'pendiente').length}</span>
            <span>✅ Completados: {filteredLog.filter(e => e.estado === 'completado').length}</span>
          </div>
        </div>
      </div>

      {/* MODAL DEL TICKET */}
      {modalOpen && selectedOrder && (
        <TicketModal 
          order={selectedOrder}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}