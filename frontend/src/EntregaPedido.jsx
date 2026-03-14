import React, { useState, useEffect } from 'react';

// ============================================
// QUICK CHECKOUT - PUNTO DE ENTREGA RÁPIDA



// Integrado con el sistema Kanban de cocina
// ============================================

// Si instalas react-qr-reader, descomenta la siguiente línea:
// import { QrReader } from 'react-qr-reader';

export default function EntregaPedido({ finishedOrders = [], setFinishedOrders, addLog }) {
  const [qrResult, setQrResult] = useState('');
  const [manualId, setManualId] = useState('');
  const [feedback, setFeedback] = useState({ msg: '', type: '' });
  const [showQR, setShowQR] = useState(false);
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  // ============================================
  // EFECTOS
  // ============================================

  // Notificación cuando llegan nuevos pedidos listos
  useEffect(() => {
    if (finishedOrders.length > 0) {
      const ultimoPedido = finishedOrders[finishedOrders.length - 1];
      setFeedback({ 
        msg: `🔔 ¡Nuevo pedido #${ultimoPedido.id} listo para entregar!`, 
        type: 'info' 
      });
      
      // Auto-limpiar feedback después de 3 segundos
      const timer = setTimeout(() => setFeedback({ msg: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [finishedOrders.length]);

  // ============================================
  // FUNCIONES DE ESCANEO QR
  // ============================================

  const handleScan = (data) => {
    if (data) {
      setQrResult(data);
      handleCheckout(data.replace('TICKET-', '').replace('ORD-', ''));
    }
  };

  const handleError = (err) => {
    setFeedback({ msg: '❌ Error al leer el código QR', type: 'error' });
    console.error('QR Error:', err);
  };

  // ============================================
  // VALIDACIÓN Y ENTREGA DE PEDIDOS
  // ============================================

  /**
   * Procesa la entrega de un pedido por código manual o QR
   */
  const handleCheckout = (orderInput) => {
    // Validar entrada
    if (!orderInput || !orderInput.trim()) {
      setFeedback({ msg: '⚠️ Ingresa un código válido', type: 'error' });
      return;
    }

    // Normalizar entrada: limpiar espacios, mayúsculas, prefijos
    const cleanInput = orderInput
      .toString()
      .trim()
      .replace(/^#/, '')
      .replace(/\s+/g, '')
      .toUpperCase();

    // Buscar el pedido en la lista de terminados
    let idx = finishedOrders.findIndex(o => {
      const orderId = o.id?.toString().replace(/^#/, '').replace(/\s+/g, '').toUpperCase();
      return orderId === cleanInput;
    });

    // Si no encuentra por ID exacto, intentar búsqueda por número correlativo
    if (idx === -1 && !isNaN(cleanInput)) {
      const num = parseInt(cleanInput, 10);
      if (num > 0 && num <= finishedOrders.length) {
        idx = num - 1;
      }
    }

    // Si aún no encuentra, buscar por contenido parcial (útil para escaneo rápido)
    if (idx === -1) {
      idx = finishedOrders.findIndex(o => 
        o.id?.toString().toUpperCase().includes(cleanInput) ||
        o.numero?.toString().toUpperCase().includes(cleanInput)
      );
    }

    // Validar resultado
    if (idx === -1 || !finishedOrders[idx]) {
      setFeedback({ 
        msg: '❌ Código no válido o pedido ya entregado', 
        type: 'error' 
      });
      return;
    }

    // Procesar la entrega
    const order = finishedOrders[idx];
    
    // Actualizar listas
    setFinishedOrders(prev => prev.filter((_, i) => i !== idx));
    
    // Registrar en entregas recientes
    setRecentDeliveries(prev => [
      { 
        id: order.id, 
        cliente: order.cliente || 'Cliente', 
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev.slice(0, 4) // Mantener solo últimas 5
    ]);

    // Feedback de éxito
    setFeedback({ 
      msg: `✅ ¡Orden #${order.id} entregada con éxito!`, 
      type: 'success' 
    });

    // Limpiar campo
    setManualId('');

    // Registrar en el log de auditoría
    if (addLog) {
      addLog({
        tipo: 'Salida',
        pedido: order.id,
        usuario: order.cliente || 'Cliente',
        mesa: order.mesa || 'N/A',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detalle: `Entrega por checkout rápido - Total: $${order.total?.toFixed(2)}`
      });
    }

    // Auto-limpiar feedback después de 3 segundos
    setTimeout(() => setFeedback({ msg: '', type: '' }), 3000);
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div style={styles.container}>
      
      {/* Header con contador de pedidos listos */}
      <div style={styles.header}>
        <div style={styles.counterBadge}>
          <span style={styles.counterNumber}>{finishedOrders.length}</span>
          <span style={styles.counterLabel}>listos</span>
        </div>
        <h4 style={styles.title}>🚀 Checkout Rápido</h4>
      </div>

      {/* Botón para alternar lector QR (comentado hasta implementar) */}
      {/*
      <button 
        onClick={() => setShowQR(!showQR)} 
        className="admin-btn" 
        style={styles.qrToggleBtn}
      >
        {showQR ? '📱 Ocultar Lector' : '📷 Escanear QR'}
      </button>
      */}

      {/* Lector QR (comentado hasta instalar dependencia) */}
      {/*
      {showQR && (
        <div style={styles.qrReader}>
          <QrReader
            onResult={(result, error) => {
              if (!!result) handleScan(result?.text);
              if (!!error) handleError(error);
            }}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%', borderRadius: '12px' }}
          />
          <p style={styles.qrHint}>Enfoca el código QR del ticket</p>
        </div>
      )}
      */}

      {/* Formulario de entrada manual */}
      <div style={styles.formContainer}>
        <div style={styles.inputWrapper}>
          <span style={styles.inputIcon}>🔍</span>
          <input
            type="text"
            placeholder="Código del ticket o #orden"
            value={manualId}
            onChange={e => setManualId(e.target.value)}
            style={styles.input}
            onKeyDown={e => {
              if (e.key === 'Enter' && manualId.trim()) {
                handleCheckout(manualId.trim());
              }
            }}
          />
          {manualId && (
            <button 
              style={styles.clearButton}
              onClick={() => setManualId('')}
              aria-label="Limpiar campo"
            >
              ✕
            </button>
          )}
        </div>

        <button
          className="add-btn-small"
          style={{
            ...styles.submitButton,
            opacity: manualId.trim() ? 1 : 0.6,
            cursor: manualId.trim() ? 'pointer' : 'not-allowed'
          }}
          onClick={() => {
            if (manualId.trim()) {
              handleCheckout(manualId.trim());
            } else {
              setFeedback({ 
                msg: '⚠️ Ingresa un código primero', 
                type: 'error' 
              });
            }
          }}
          disabled={!manualId.trim()}
        >
          <span style={styles.buttonContent}>
            <span>✅</span>
            <span>ENTREGAR PEDIDO</span>
            {finishedOrders.length > 0 && manualId.trim() && (
              <span style={styles.buttonBadge}>
                {finishedOrders.length}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Feedback visual */}
      {feedback.msg && (
        <div style={{
          ...styles.feedback,
          ...(feedback.type === 'error' && styles.feedbackError),
          ...(feedback.type === 'success' && styles.feedbackSuccess),
          ...(feedback.type === 'info' && styles.feedbackInfo)
        }}>
          <span style={styles.feedbackIcon}>
            {feedback.type === 'error' && '❌'}
            {feedback.type === 'success' && '✅'}
            {feedback.type === 'info' && '🔔'}
          </span>
          {feedback.msg}
        </div>
      )}

      {/* Lista de entregas recientes */}
      {recentDeliveries.length > 0 && (
        <div style={styles.recentContainer}>
          <p style={styles.recentTitle}>📋 Últimas entregas:</p>
          <div style={styles.recentList}>
            {recentDeliveries.map((delivery, idx) => (
              <div key={idx} style={styles.recentItem}>
                <span style={styles.recentId}>#{delivery.id}</span>
                <span style={styles.recentTime}>{delivery.hora}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ayuda visual */}
      <div style={styles.helpText}>
        <span style={styles.helpIcon}>📌</span>
        Escanea el código QR del ticket o ingresa el número de orden manualmente
      </div>

      {/* Nota con sabor ecuatoriano (integrada de EntregaPedido) */}
      <p style={styles.footerNote}>
        <span style={styles.noteIcon}>🥘</span>
        "Verifica bien el código, no sea cosa que entregues el seco de pollo equivocado" 
        <span style={styles.noteSignature}>
          - Atentamente, la cocina 👨‍🍳
        </span>
      </p>
    </div>
  );
}

// ============================================
// ESTILOS INTEGRADOS CON VARIABLES CSS
// ============================================
const styles = {
  container: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid var(--borde-tropical)',
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    width: '100%',
    position: 'relative'
  },

  counterBadge: {
    background: 'var(--verde-selva)',
    color: 'white',
    padding: '0.5rem 0.8rem',
    borderRadius: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '60px',
    boxShadow: '0 4px 12px rgba(1, 64, 14, 0.3)',
    border: '2px solid var(--mango)'
  },

  counterNumber: {
    fontSize: '1.5rem',
    fontWeight: '900',
    lineHeight: 1
  },

  counterLabel: {
    fontSize: '0.6rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  },

  title: {
    margin: 0,
    fontSize: '1.2rem',
    color: 'var(--verde-selva)',
    fontWeight: '600'
  },

  qrToggleBtn: {
    marginBottom: '1rem',
    width: '100%',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    border: 'none',
    padding: '0.6rem',
    borderRadius: '30px',
    fontWeight: '600'
  },

  qrReader: {
    width: '100%',
    marginBottom: '1rem',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid var(--borde-tropical)'
  },

  qrHint: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'var(--gris-secundario)',
    marginTop: '0.3rem'
  },

  formContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginBottom: '1rem'
  },

  inputWrapper: {
    position: 'relative',
    width: '100%'
  },

  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    opacity: 0.5,
    zIndex: 1
  },

  input: {
    width: '100%',
    padding: '0.8rem 0.8rem 0.8rem 35px',
    borderRadius: '30px',
    border: '2px solid var(--borde-tropical)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },

  clearButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px 8px',
    borderRadius: '50%'
  },

  submitButton: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '30px',
    fontWeight: '700',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    border: '2px solid var(--maracuya)',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)'
  },

  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },

  buttonBadge: {
    background: 'rgba(1, 64, 14, 0.2)',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },

  feedback: {
    marginTop: '0.5rem',
    padding: '0.8rem',
    borderRadius: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    boxSizing: 'border-box',
    animation: 'slideIn 0.3s ease'
  },

  feedbackError: {
    background: '#fdeaea',
    borderLeft: '5px solid #e74c3c',
    color: '#c0392b'
  },

  feedbackSuccess: {
    background: '#e8f8f5',
    borderLeft: '5px solid #27ae60',
    color: '#16a085'
  },

  feedbackInfo: {
    background: '#fff3e0',
    borderLeft: '5px solid #f39c12',
    color: '#d35400'
  },

  feedbackIcon: {
    fontSize: '1.1rem'
  },

  recentContainer: {
    width: '100%',
    marginTop: '1rem',
    padding: '0.8rem',
    background: 'var(--crema-tropical)',
    borderRadius: '12px',
    border: '1px solid var(--borde-tropical)'
  },

  recentTitle: {
    fontSize: '0.85rem',
    color: 'var(--gris-secundario)',
    marginBottom: '0.5rem',
    fontWeight: '600'
  },

  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },

  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    padding: '0.2rem 0',
    borderBottom: '1px dotted var(--borde-tropical)'
  },

  recentId: {
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },

  recentTime: {
    color: 'var(--gris-secundario)'
  },

  helpText: {
    marginTop: '1rem',
    fontSize: '0.8rem',
    color: 'var(--gris-secundario)',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 179, 71, 0.1)',
    padding: '0.5rem',
    borderRadius: '20px',
    width: '100%'
  },

  helpIcon: {
    fontSize: '1rem'
  },

  // Elementos integrados de EntregaPedido.jsx
  footerNote: {
    marginTop: '1.5rem',
    fontSize: '0.8rem',
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    borderTop: '1px dashed var(--borde-tropical)',
    paddingTop: '1rem',
    width: '100%'
  },

  noteIcon: {
    fontSize: '1.2rem',
    marginRight: '5px'
  },

  noteSignature: {
    display: 'block',
    marginTop: '5px',
    fontSize: '0.7rem',
    color: '#666'
  }
};

// ============================================
// ESTILOS DINÁMICOS
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .counter-badge {
    animation: pulse 2s infinite;
  }

  input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  }

  .clear-button:hover {
    background: rgba(0,0,0,0.05);
  }
`;
document.head.appendChild(styleSheet);














