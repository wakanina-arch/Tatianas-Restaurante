import React, { useState } from 'react';
// Si instalas react-qr-reader, descomenta la siguiente línea:
// import { QrReader } from 'react-qr-reader';

export default function QuickCheckout({ finishedOrders, setFinishedOrders, addLog }) {
  const [qrResult, setQrResult] = useState('');
  const [manualId, setManualId] = useState('');
  const [feedback, setFeedback] = useState('');
  // const [showQR, setShowQR] = useState(false); // Si quieres mostrar/ocultar el lector

  // Simulación de escaneo QR (puedes conectar con QrReader real)
  const handleScan = (data) => {
    if (data) {
      setQrResult(data);
      handleCheckout(data.replace('TICKET-', ''));
    }
  };

  // Simulación de error QR
  const handleError = (err) => {
    setFeedback('Error al leer QR');
  };

  // Checkout por QR o manual
  const handleCheckout = (orderInput) => {
    // Normalizar entrada: quitar espacios, mayúsculas, prefijo #
    const cleanInput = orderInput.replace(/^#/, '').replace(/\s+/g, '').toUpperCase();
    let idx = finishedOrders.findIndex(o =>
      o.id && o.id.replace(/^#/, '').replace(/\s+/g, '').toUpperCase() === cleanInput
    );
    if (idx === -1 && !isNaN(cleanInput)) {
      // Buscar por número correlativo mostrado (ORDEN)
      const num = parseInt(cleanInput, 10);
      if (num > 0 && num <= finishedOrders.length) {
        idx = num - 1;
      }
    }
    if (idx === -1 || !finishedOrders[idx]) {
      setFeedback('Orden no encontrada o ya entregada');
      return;
    }
    const order = finishedOrders[idx];
    setFinishedOrders(finishedOrders.filter((_, i) => i !== idx));
    setFeedback(`Orden #${order.id} entregada correctamente`);
    setManualId('');
    if (addLog) {
      addLog({
        tipo: 'Salida',
        pedido: order.id,
        usuario: order.cliente || 'Cliente',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detalle: 'Entrega por checkout rápido'
      });
    }
  };

  return (
    <div style={{padding:'0.5rem 0', display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h4 style={{marginBottom: '0.7rem', fontSize:'1rem', fontWeight:600}}>Checkout Rápido</h4>
      {/*
      <button onClick={()=>setShowQR(v=>!v)} className="admin-btn" style={{marginBottom:8}}>
        {showQR ? 'Ocultar QR' : 'Escanear QR'}
      </button>
      {showQR && (
        <div style={{marginBottom:12}}>
          <QrReader
            onResult={(result, error) => {
              if (!!result) handleScan(result?.text);
              if (!!error) handleError(error);
            }}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
        </div>
      )}
      */}
      <div style={{width:'100%', maxWidth:220, display:'flex', flexDirection:'column', alignItems:'center', marginBottom:8}}>
        <input
          type="text"
          placeholder="Escanea QR o ingresa código"
          value={manualId}
          onChange={e => setManualId(e.target.value)}
          style={{width:'100%', padding:'0.32rem', borderRadius:5, border:'1px solid #ccc', textAlign:'center', fontSize:'0.98rem'}}
          onKeyDown={e => {
            if (e.key === 'Enter' && manualId.trim()) handleCheckout(manualId.trim());
          }}
        />
          <button
            className="admin-btn"
            style={{marginTop:6, width:'100%', fontSize:'0.95rem', padding:'0.35rem 0'}}
            onClick={() => {
              if (manualId.trim()) handleCheckout(manualId.trim());
            }}
          >Entregar manualmente</button>
      </div>
      {feedback && <div style={{color:'#28a745', fontWeight:600, marginTop:2, fontSize:'0.95rem'}}>{feedback}</div>}
      <div style={{fontSize:'0.85rem', color:'#888', marginTop:6, textAlign:'center'}}>
        Escanea el código QR del ticket<br />o ingresa el número de orden manualmente en el campo de abajo.
      </div>
    </div>
  );
}
