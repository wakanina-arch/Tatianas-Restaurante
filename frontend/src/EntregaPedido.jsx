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
        className="admin-btn" 
        style={styles.qrToggleBtn}
      >
        {showQR ? '📱 Ocultar Lector' : '📷 Escanear QR'}
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
            opacity: manualId.trim() ? 1 : 0.6,
            cursor: manualId.trim() ? 'pointer' : 'not-allowed'
          }}
          onClick={() => manualId.trim() ? processCheckout(manualId.trim()) : 
            showTemporaryFeedback('⚠️ Ingresa un código primero', 'error')}
          disabled={!manualId.trim()}
        >
          ✅ ENTREGAR PEDIDO
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
          <span>{feedback.type === 'error' ? '❌' : feedback.type === 'success' ? '✅' : '🔔'}</span>
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
// ESTILOS
// ============================================
const styles = {
  container: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '20px',
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
    marginBottom: '1.5rem'
  },
  counterBadge: {
    background: 'var(--verde-selva)',
    color: 'white',
    padding: '0.5rem 0.8rem',
    borderRadius: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '60px'
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
    fontWeight: '600',
    cursor: 'pointer'
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
  cancelScanBtn: {
    width: '100%',
    padding: '0.5rem',
    background: '#f8f9fa',
    border: 'none',
    borderTop: '1px solid var(--borde-tropical)',
    cursor: 'pointer'
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
    fontSize: '1rem'
  },
  submitButton: {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '30px',
    fontWeight: '700',
    border: '2px solid var(--maracuya)',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)'
  },
  feedback: {
    marginTop: '0.5rem',
    padding: '0.8rem',
    borderRadius: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
  recentContainer: {
    marginTop: '1rem',
    padding: '0.8rem',
    background: 'var(--crema-tropical)',
    borderRadius: '12px'
  },
  recentTitle: {
    fontSize: '0.85rem',
    color: 'var(--gris-secundario)',
    marginBottom: '0.5rem',
    fontWeight: '600'
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    padding: '0.2rem 0'
  },
  recentId: {
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },
  recentTime: {
    color: 'var(--gris-secundario)'
  },
  footerNote: {
    marginTop: '1.5rem',
    fontSize: '0.8rem',
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    borderTop: '1px dashed var(--borde-tropical)',
    paddingTop: '1rem'
  },
  noteSignature: {
    display: 'block',
    fontSize: '0.7rem',
    color: '#666'
  }
};