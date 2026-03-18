import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';

// ============================================
// COMPONENTE DE ENTREGA RÁPIDA
// Con escaneo QR y entrada manual
// ============================================

export default function EntregaPedido({ 
  finishedOrders = [], 
  setFinishedOrders, 
  addLog 
}) {
  // ============================================
  // ESTADOS
  // ============================================
  const [manualId, setManualId] = useState('');
  const [feedback, setFeedback] = useState({ msg: '', type: '' });
  const [showQR, setShowQR] = useState(false);
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  // ============================================
  // EFECTOS
  // ============================================
  useEffect(() => {
    if (finishedOrders.length > 0) {
      const ultimoPedido = finishedOrders[finishedOrders.length - 1];
      showTemporaryFeedback(`🔔 ¡Nuevo pedido #${ultimoPedido.id} listo!`, 'info');
    }
  }, [finishedOrders.length]);

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const showTemporaryFeedback = (msg, type) => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: '', type: '' }), 3000);
  };

  const normalizeOrderId = (input) => {
    return input
      .toString()
      .trim()
      .replace(/^#/, '')
      .replace(/\s+/g, '')
      .toUpperCase();
  };

  const findOrderIndex = (cleanInput) => {
    // Búsqueda por ID exacto
    let idx = finishedOrders.findIndex(o => {
      const orderId = o.id?.toString().replace(/^#/, '').replace(/\s+/g, '').toUpperCase();
      return orderId === cleanInput;
    });

    // Búsqueda por número correlativo
    if (idx === -1 && !isNaN(cleanInput)) {
      const num = parseInt(cleanInput, 10);
      if (num > 0 && num <= finishedOrders.length) {
        idx = num - 1;
      }
    }

    // Búsqueda parcial
    if (idx === -1) {
      idx = finishedOrders.findIndex(o => 
        o.id?.toString().toUpperCase().includes(cleanInput) ||
        o.numero?.toString().toUpperCase().includes(cleanInput)
      );
    }

    return idx;
  };

  // ============================================
  // MANEJO DE ESCANEO QR
  // ============================================
  const handleScan = (data) => {
    if (data) {
      setShowQR(false);
      const orderId = data
        .toString()
        .replace(/^ORD-/i, '')
        .replace(/^TICKET-/i, '')
        .replace(/^#/, '')
        .trim();
      processCheckout(orderId);
    }
  };

  const handleError = (err) => {
    console.error('QR Error:', err);
    showTemporaryFeedback('❌ Error al leer el código QR', 'error');
  };

  // ============================================
  // PROCESAR ENTREGA
  // ============================================
  const processCheckout = (input) => {
    if (!input || !input.trim()) {
      showTemporaryFeedback('⚠️ Ingresa un código válido', 'error');
      return;
    }

    const cleanInput = normalizeOrderId(input);
    const idx = findOrderIndex(cleanInput);

    if (idx === -1 || !finishedOrders[idx]) {
      showTemporaryFeedback('❌ Código no válido o pedido ya entregado', 'error');
      return;
    }

    const order = finishedOrders[idx];
    
    // Actualizar listas
    setFinishedOrders(prev => prev.filter((_, i) => i !== idx));
    
    // Registrar entrega reciente
    setRecentDeliveries(prev => [
      { 
        id: order.id, 
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev.slice(0, 4)
    ]);

    showTemporaryFeedback(`✅ ¡Orden #${order.id} entregada!`, 'success');
    setManualId('');

    // Registrar en log
    if (addLog) {
      addLog({
        tipo: 'Salida',
        pedido: order.id,
        usuario: order.cliente || 'Cliente',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detalle: `Entrega - Total: $${order.total?.toFixed(2)}`
      });
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================
  return (
    <div style={styles.container}>
      
      {/* Header con contador */}
      <div style={styles.header}>
        <div style={styles.counterBadge}>
          <span style={styles.counterNumber}>{finishedOrders.length}</span>
          <span style={styles.counterLabel}>listos</span>
        </div>
        <h4 style={styles.title}>🚀 Checkout Rápido</h4>
      </div>

      {/* Botón QR */}
      <button 
        onClick={() => setShowQR(!showQR)} 
        style={styles.qrToggleBtn}
      >
        <span style={styles.qrIcon}>{showQR ? '📱' : '📷'}</span>
        {showQR ? ' Ocultar Lector' : ' Escanear QR'}
      </button>

      {/* Lector QR */}
      {showQR && (
        <div style={styles.qrReader}>
          <QrScanner
            onScan={(data) => {
              if (data) {
                handleScan(data.text);
              }
            }}
            onError={handleError}
            style={{ width: '100%' }}
            constraints={{
              video: { facingMode: 'environment' }
            }}
          />
          <p style={styles.qrHint}>Enfoca el código QR del ticket</p>
          <button 
            style={styles.cancelScanBtn}
            onClick={() => setShowQR(false)}
          >
            ✕ Cancelar escaneo
          </button>
        </div>
      )}

      {/* Entrada manual */}
      <div style={styles.formContainer}>
        <div style={styles.inputWrapper}>
          <span style={styles.inputIcon}>🔍</span>
          <input
            type="text"
            placeholder="Código del ticket o #orden"
            value={manualId}
            onChange={e => setManualId(e.target.value)}
            style={styles.input}
            onKeyDown={e => e.key === 'Enter' && manualId.trim() && processCheckout(manualId.trim())}
          />
          {manualId && (
            <button style={styles.clearButton} onClick={() => setManualId('')}>✕</button>
          )}
        </div>

        <button
          style={{
            ...styles.submitButton,
            opacity: manualId.trim() ? 1 : 0.5,
            cursor: manualId.trim() ? 'pointer' : 'not-allowed'
          }}
          onClick={() => manualId.trim() ? processCheckout(manualId.trim()) : 
            showTemporaryFeedback('⚠️ Ingresa un código primero', 'error')}
          disabled={!manualId.trim()}
        >
          <span style={styles.submitIcon}>✅</span>
          ENTREGAR PEDIDO
        </button>
      </div>

      {/* Feedback */}
      {feedback.msg && (
        <div style={{
          ...styles.feedback,
          ...(feedback.type === 'error' && styles.feedbackError),
          ...(feedback.type === 'success' && styles.feedbackSuccess),
          ...(feedback.type === 'info' && styles.feedbackInfo)
        }}>
          <span style={styles.feedbackIcon}>
            {feedback.type === 'error' ? '❌' : feedback.type === 'success' ? '✅' : '🔔'}
          </span>
          {feedback.msg}
        </div>
      )}

      {/* Entregas recientes */}
      {recentDeliveries.length > 0 && (
        <div style={styles.recentContainer}>
          <p style={styles.recentTitle}>📋 Últimas entregas:</p>
          {recentDeliveries.map((delivery, idx) => (
            <div key={idx} style={styles.recentItem}>
              <span style={styles.recentId}>#{delivery.id}</span>
              <span style={styles.recentTime}>{delivery.hora}</span>
            </div>
          ))}
        </div>
      )}

      {/* Nota ecuatoriana */}
      <p style={styles.footerNote}>
        🥘 "Verifica bien el código, no sea cosa que entregues el seco de pollo equivocado"
        <span style={styles.noteSignature}> - La cocina 👨‍🍳</span>
      </p>
    </div>
  );
}

// ============================================
// ESTILOS IPHONE 16
// ============================================
const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding: '1.5rem',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  counterBadge: {
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #2a6b2f 100%)',
    color: 'white',
    padding: '0.5rem 0.8rem',
    borderRadius: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '60px',
    boxShadow: '0 4px 12px rgba(1, 64, 14, 0.2)'
  },
  counterNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: 1
  },
  counterLabel: {
    fontSize: '0.6rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    color: 'var(--verde-selva)',
    fontWeight: '600',
    letterSpacing: '-0.5px'
  },
  qrToggleBtn: {
    marginBottom: '1rem',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.5)',
    color: 'var(--verde-selva)',
    border: '1px solid rgba(255, 179, 71, 0.3)',
    padding: '0.8rem',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem'
  },
  qrIcon: {
    fontSize: '1.1rem'
  },
  qrReader: {
    width: '100%',
    marginBottom: '1rem',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 179, 71, 0.3)',
    background: 'white'
  },
  qrHint: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'var(--gris-texto)',
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  cancelScanBtn: {
    width: '100%',
    padding: '0.6rem',
    background: 'rgba(0, 0, 0, 0.02)',
    border: 'none',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#ff3b30',
    transition: 'all 0.2s ease'
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
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    opacity: 0.5,
    zIndex: 1
  },
  input: {
    width: '100%',
    padding: '0.8rem 2.5rem 0.8rem 40px',
    borderRadius: '30px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease'
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
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  submitButton: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '0.95rem',
    border: 'none',
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #2a6b2f 100%)',
    color: 'white',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(1, 64, 14, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem'
  },
  submitIcon: {
    fontSize: '1.1rem'
  },
  feedback: {
    marginTop: '0.5rem',
    padding: '0.8rem 1rem',
    borderRadius: '20px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem'
  },
  feedbackIcon: {
    fontSize: '1.1rem'
  },
  feedbackError: {
    background: 'rgba(255, 59, 48, 0.1)',
    color: '#ff3b30',
    border: '1px solid rgba(255, 59, 48, 0.2)'
  },
  feedbackSuccess: {
    background: 'rgba(52, 199, 89, 0.1)',
    color: '#34c759',
    border: '1px solid rgba(52, 199, 89, 0.2)'
  },
  feedbackInfo: {
    background: 'rgba(255, 179, 71, 0.1)',
    color: 'var(--maracuya)',
    border: '1px solid rgba(255, 179, 71, 0.2)'
  },
  recentContainer: {
    marginTop: '1rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  recentTitle: {
    fontSize: '0.85rem',
    color: 'var(--gris-texto)',
    marginBottom: '0.5rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    padding: '0.3rem 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
  },
  recentId: {
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },
  recentTime: {
    color: 'var(--gris-texto)',
    fontSize: '0.75rem'
  },
  footerNote: {
    marginTop: '1.5rem',
    fontSize: '0.8rem',
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
    borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
    paddingTop: '1rem'
  },
  noteSignature: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'rgba(0, 0, 0, 0.3)',
    marginTop: '0.2rem'
  }
};

// ============================================
// ESTILOS DINÁMICOS (hover effects)
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .qr-toggle-btn:hover {
    background: rgba(255, 179, 71, 0.1) !important;
    border-color: var(--maracuya) !important;
  }

  .cancel-scan-btn:hover {
    background: rgba(255, 59, 48, 0.05) !important;
  }

  .input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.1) !important;
  }

  .clear-button:hover {
    background: rgba(0, 0, 0, 0.05) !important;
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(1, 64, 14, 0.3) !important;
  }
`;

// Añadir estilos al documento
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}