import React, { useState, useEffect } from 'react';

export default function EntregaPedido({ finishedOrders = [], setFinishedOrders, addLog }) {
  const [manualId, setManualId] = useState('');
  const [feedback, setFeedback] = useState({ msg: '', type: '' });

  // 🎵 EFECTO DE SONIDO VISUAL CUANDO LLEGA UN PEDIDO NUEVO
  useEffect(() => {
    if (finishedOrders.length > 0) {
      setFeedback({ msg: '🔔 ¡Pedido listo para entregar!', type: 'info' });
      setTimeout(() => setFeedback({ msg: '', type: '' }), 3000);
    }
  }, [finishedOrders.length]);

  // --- 🕵️‍♂️ VALIDACIÓN DE SEGURIDAD ---
  const handleCheckout = (orderInput) => {
    const cleanInput = orderInput.trim().toUpperCase().replace(/^#/, '');
    
    const idx = finishedOrders.findIndex(o => 
      o.id.toString().toUpperCase().includes(cleanInput)
    );

    if (idx === -1) {
      setFeedback({ msg: '❌ Código no válido o ya entregado', type: 'error' });
      return;
    }

    const order = finishedOrders[idx];
    
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
      
      {/* 🥘 CONTADOR CON SABOR ECUATORIANO */}
      <div style={counterStyle}>
        <span style={numberStyle}>{finishedOrders.length}</span>
        <p style={labelStyle}>PEDIDOS LISTOS</p>
        <span style={labelStyle}>(pa' llevar)</span>
      </div>

      {/* 🔐 BLOQUE DE VALIDACIÓN MEJORADO */}
      <div style={inputGroupStyle}>
        <h3 style={titleStyle}>
          🎫 Validar Entrega
          <span style={subtitleStyle}>Código QR o número de ticket</span>
        </h3>
        
        <div style={formContainerStyle}>
          
          {/* CAMPO DE BÚSQUEDA CON ESTILO */}
          <div style={searchBoxStyle}>
            <span style={qrIconStyle}>📷</span>
            <input
              type="text"
              placeholder="Ej: ORD-123 o escanear QR"
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && manualId && handleCheckout(manualId)}
            />
            {manualId && (
              <button 
                style={clearButtonStyle}
                onClick={() => setManualId('')}
              >
                ✕
              </button>
            )}
          </div>

         {/* 🎯 BOTÓN MEJORADO - TONO #cd7006 */}
{/* 🎯 BOTÓN CON ESTILO COMPLETO */}
{/* 🎯 BOTÓN CON MARCO Y COLOR */}
<button
  style={{
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    fontWeight: '800',
    cursor: manualId.trim() ? 'pointer' : 'not-allowed',
    letterSpacing: '1px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    
    // ESTADO ACTIVO (con código)
    ...(manualId.trim() ? {
      background: '#cd7006',
      border: '2px solid #b85e00',
      color: 'white',
      boxShadow: '0 8px 20px rgba(205, 112, 6, 0.4)'
    } : 
    // ESTADO INACTIVO (sin código)
    {
      background: '#f0f0f0',
      border: '2px dashed #cd7006',  // ← MARCO NARANJA AUNQUE ESTÉ GRIS
      color: '#666',
      boxShadow: 'none'
    })
  }}
  onClick={() => {
    if (manualId.trim()) {
      handleCheckout(manualId);
    } else {
      setFeedback({ msg: '⚠️ Ingresa un código primero, mi pana', type: 'error' });
    }
  }}
  onMouseEnter={(e) => {
    if (manualId.trim()) {
      e.target.style.background = '#e67e22';
      e.target.style.transform = 'scale(1.05)';
      e.target.style.border = '2px solid #b85e00';
    } else {
      e.target.style.background = '#ffe6d5';  // Naranja muy clarito al hover
      e.target.style.border = '2px dashed #cd7006';
    }
  }}
  onMouseLeave={(e) => {
    if (manualId.trim()) {
      e.target.style.background = '#cd7006';
      e.target.style.transform = 'scale(1)';
      e.target.style.border = '2px solid #b85e00';
    } else {
      e.target.style.background = '#f0f0f0';
      e.target.style.border = '2px dashed #cd7006';
    }
  }}
  disabled={!manualId.trim()}
>
  <span style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  }}>
    <span style={{fontSize: '1.2rem'}}>🚀</span>
    <span>ACEPTAR Y ENTREGAR</span>
    {finishedOrders.length > 0 && manualId.trim() && (
      <span style={{
        background: 'rgba(255,255,255,0.3)',
        padding: '2px 8px',
        borderRadius: '20px',
        fontSize: '0.8rem'
      }}>
        {finishedOrders.length}
      </span>
    )}
  </span>
</button>
        </div>
      </div>

      {/* 📢 FEEDBACK MEJORADO */}
      {feedback.msg && (
        <div style={{
          ...feedbackStyle,
          background: feedback.type === 'error' 
            ? '#fdeaea' 
            : feedback.type === 'success' 
              ? '#e8f8f5' 
              : '#fff3e0',
          borderLeft: `5px solid ${
            feedback.type === 'error' 
              ? '#e74c3c' 
              : feedback.type === 'success' 
                ? '#27ae60' 
                : '#f39c12'
          }`,
          color: feedback.type === 'error' 
            ? '#c0392b' 
            : feedback.type === 'success' 
              ? '#16a085' 
              : '#d35400'
        }}>
          <span style={{fontSize: '1.2rem', marginRight: '10px'}}>
            {feedback.type === 'error' ? '❌' : feedback.type === 'success' ? '✅' : '🔔'}
          </span>
          {feedback.msg}
        </div>
      )}

      {/* 🍽️ NOTA CON SABOR ECUATORIANO */}
      <p style={footerNoteStyle}>
        <span style={{fontSize: '1.2rem', marginRight: '5px'}}>🥘</span>
        "Verifica bien el código, no sea cosa que entregues el seco de pollo equivocado" 
        <span style={{display: 'block', marginTop: '5px', fontSize: '0.7rem'}}>
          - Atentamente, la cocina 👨‍🍳
        </span>
      </p>
    </div>
  );
}

// --- 🎨 ESTILOS MEJORADOS ---
const taquillaContainerStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px solid var(--crema-fondo)',
  maxWidth: '400px',
  margin: '0 auto'
};

const counterStyle = {
  background: 'var(--selva-deep)',
  color: 'white',
  padding: '1.5rem',
  borderRadius: '50%',
  width: '140px',
  height: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '2rem',
  boxShadow: '0 8px 20px rgba(13, 89, 64, 0.3)',
  border: '4px solid var(--papaya-primary)',
  position: 'relative',
  animation: 'pulse 2s infinite'
};

const numberStyle = { 
  fontSize: '2.8rem', 
  fontWeight: '900', 
  lineHeight: '1',
  textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
};

const labelStyle = { 
  fontSize: '0.65rem', 
  fontWeight: '700', 
  textAlign: 'center', 
  marginTop: '2px',
  letterSpacing: '0.5px'
};

const inputGroupStyle = { 
  width: '100%', 
  textAlign: 'center' 
};

const titleStyle = {
  fontFamily: 'Fraunces',
  color: 'var(--selva-deep)',
  marginBottom: '1.5rem',
  fontSize: '1.3rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const subtitleStyle = {
  fontSize: '0.8rem',
  color: '#666',
  fontWeight: 'normal'
};

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  width: '100%'
};

const searchBoxStyle = {
  position: 'relative',
  width: '100%'
};

const qrIconStyle = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '1.2rem',
  zIndex: 1
};

const inputStyle = {
  width: '100%',
  padding: '1rem 1rem 1rem 45px',
  borderRadius: '12px',
  border: '2px solid var(--crema-fondo)',
  fontSize: '1rem',
  fontFamily: 'Montserrat',
  outline: 'none',
  transition: 'all 0.3s',
  boxSizing: 'border-box'
};

const clearButtonStyle = {
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '#999',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '5px'
};

const btnAceptarStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  fontWeight: '800',
  cursor: 'pointer',
  letterSpacing: '1px',
  fontSize: '1rem',
  border: 'none',
  transition: 'all 0.3s ease'
};

const btnContentStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px'
};

const btnBadgeStyle = {
  background: 'rgba(255,255,255,0.3)',
  padding: '2px 8px',
  borderRadius: '20px',
  fontSize: '0.9rem'
};

const feedbackStyle = {
  marginTop: '1.5rem',
  padding: '1rem',
  borderRadius: '8px',
  fontWeight: '500',
  fontFamily: 'Montserrat',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box'
};

const footerNoteStyle = {
  marginTop: '1.5rem',
  fontSize: '0.8rem',
  color: '#999',
  textAlign: 'center',
  fontStyle: 'italic',
  borderTop: '1px dashed #ddd',
  paddingTop: '1rem',
  width: '100%'
};

// Animación para el contador
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
