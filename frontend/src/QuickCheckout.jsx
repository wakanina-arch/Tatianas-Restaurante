import React, { useState } from 'react';

export default function QuickCheckout({ finishedOrders = [], setFinishedOrders, addLog }) {
  const [manualId, setManualId] = useState('');
  const [feedback, setFeedback] = useState({ msg: '', type: '' });

  // --- 🕵️‍♂️ VALIDACIÓN DE SEGURIDAD ---
  const handleCheckout = (orderInput) => {
    const cleanInput = orderInput.trim().toUpperCase().replace(/^#/, '');
    
    // Buscamos en la taquilla (finishedOrders) que viene de Comandas
    const idx = finishedOrders.findIndex(o => 
      o.id.toString().toUpperCase().includes(cleanInput)
    );

    if (idx === -1) {
      setFeedback({ msg: '❌ Código no válido o ya entregado', type: 'error' });
      return;
    }

    const order = finishedOrders[idx];
    
    // 🚚 FLUJO KANBAN: Sale de la taquilla y se archiva
    setFinishedOrders(prev => prev.filter((_, i) => i !== idx));
    setFeedback({ msg: `✅ ¡Buen provecho! Orden #${order.id} entregada`, type: 'success' });
    setManualId('');

    if (addLog) {
      addLog({
        tipo: 'ENTREGA',
        pedido: order.id,
        usuario: order.cliente || 'Universitario',
        hora: new Date().toLocaleTimeString(),
        detalle: 'Entrega física en taquilla'
      });
    }
  };

  return (
    <div style={taquillaContainerStyle}>
      {/* 🔔 CONTADOR DINÁMICO (KITCHEN TO COUNTER) */}
      <div style={counterStyle}>
        <span style={numberStyle}>{finishedOrders.length}</span>
        <p style={labelStyle}>PEDIDOS EN TAQUILLA</p>
      </div>

      <div style={inputGroupStyle}>
        <h3 style={{fontFamily: 'Fraunces', color: 'var(--selva-deep)', marginBottom: '1rem'}}>Validación de Entrega</h3>
        
        <div style={{position: 'relative', width: '100%'}}>
          <input
            type="text"
            placeholder="Escanear QR o ID Manual"
            value={manualId}
            onChange={e => setManualId(e.target.value)}
            style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && manualId && handleCheckout(manualId)}
          />
          <span style={qrIconPlaceholder}>📷</span>
        </div>

        <button
          style={btnAceptarStyle}
          onClick={() => manualId && handleCheckout(manualId)}
        >
          ACEPTAR Y ENTREGAR
        </button>
      </div>

      {feedback.msg && (
        <div style={{
          marginTop: '1rem', 
          color: feedback.type === 'error' ? '#e74c3c' : '#27ae60',
          fontWeight: '700',
          fontFamily: 'Montserrat'
        }}>
          {feedback.msg}
        </div>
      )}

      <p style={footerNoteStyle}>
        Verifique el código QR del estudiante antes de entregar el paquete.
      </p>
    </div>
  );
}

// --- 🎨 ESTILOS TAQUILLA "ONE TO ONE" ---
const taquillaContainerStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px solid var(--crema-fondo)'
};

const counterStyle = {
  background: 'var(--selva-deep)',
  color: 'white',
  padding: '1.5rem',
  borderRadius: '50%',
  width: '120px',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '2rem',
  boxShadow: '0 8px 20px rgba(13, 89, 64, 0.3)',
  border: '4px solid var(--papaya-primary)'
};

const numberStyle = { fontSize: '2.5rem', fontWeight: '900', lineHeight: '1' };
const labelStyle = { fontSize: '0.6rem', fontWeight: '700', textAlign: 'center', marginTop: '5px' };

const inputGroupStyle = { width: '100%', textAlign: 'center' };

const inputStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  border: '2px solid var(--crema-fondo)',
  fontSize: '1rem',
  fontFamily: 'Montserrat',
  textAlign: 'center',
  outline: 'none',
  transition: '0.3s'
};

const qrIconPlaceholder = {
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: '0.4'
};

const btnAceptarStyle = {
  width: '100%',
  marginTop: '1rem',
  padding: '1rem',
  background: 'var(--papaya-primary)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '800',
  cursor: 'pointer',
  transition: '0.3s',
  letterSpacing: '1px'
};

const footerNoteStyle = {
  marginTop: '1.5rem',
  fontSize: '0.75rem',
  color: '#999',
  textAlign: 'center',
  fontStyle: 'italic'
};
