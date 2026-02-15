import React, { useRef } from 'react';

export default function TicketModal({ order, onClose }) {
  const ticketRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket ${order.pedido || order.id}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .ticket {
              max-width: 380px;
              width: 100%;
              background: white;
              border-radius: 20px;
              padding: 25px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            .resumen-compra {
              margin-bottom: 1rem;
              border: 1px solid #ececff;
              border-radius: 12px;
              padding: 0.7rem 1rem;
              background: #fafaff;
            }
            .resumen-compra h3 {
              margin: 0 0 0.5rem 0;
              font-size: 1rem;
              color: #764ba2;
            }
            .resumen-compra ul {
              list-style: none;
              padding: 0;
              margin: 0;
              max-height: 100px;
              overflow-y: auto;
            }
            .resumen-compra li {
              padding: 0.2rem 0;
              border-bottom: 1px solid #eee;
              font-size: 0.9rem;
            }
            .resumen-compra .total {
              text-align: right;
              font-size: 1rem;
              color: #667eea;
              font-weight: bold;
              margin-top: 8px;
            }
            .identidad-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 1rem;
              background: #fff;
              border-radius: 15px;
              animation: bounceIn 0.8s ease;
            }
            .logo-container {
              background: #fff;
              padding: 12px;
              border-radius: 25px;
              box-shadow: 0 8px 20px rgba(102,126,234,0.2);
              margin-bottom: 1rem;
            }
            .logo-container img {
              width: 130px;
              height: auto;
            }
            .identidad-section h2 {
              margin: 0;
              font-size: 1.4rem;
              color: #764ba2;
              font-family: cursive;
            }
            .identidad-section p {
              color: #666;
              font-size: 0.9rem;
              margin-bottom: 1rem;
            }
            .qr-code {
              width: 150px;
              border-radius: 10px;
              border: 4px solid #f0f0f0;
            }
            .order-number {
              margin-top: 10px;
              text-align: center;
            }
            .order-number span {
              font-size: 1rem;
              color: #764ba2;
              font-weight: 600;
            }
            .order-number div {
              font-size: 1.5rem;
              color: #333;
              font-weight: bold;
            }
            .close-button {
              margin-top: 1rem;
              width: 100%;
              padding: 1rem;
              background: #764ba2;
              color: white;
              border: none;
              border-radius: 10px;
              font-weight: bold;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <!-- Resumen de Compra -->
            <div class="resumen-compra">
              <h3>Resumen de Compra</h3>
              <ul>
                ${order.items && order.items.length > 0 ? order.items.map(item => `
                  <li>
                    ${item.cantidad || 1} x ${item.nombre} 
                    <span style="float:right;">$${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</span>
                  </li>
                `).join('') : '<li style="text-align:center;">Sin items</li>'}
              </ul>
              <div class="total">
                Total: $${(order.total || 0).toFixed(2)}
              </div>
            </div>

            <!-- Sección de Identidad (Logo y QR) -->
            <div class="identidad-section">
              <div class="logo-container">
                <img src="/img/The-One.png" alt="Logo" />
              </div>

              <h2>¡Gracias por elegirnos!</h2>
              <p>Tu pedido está en manos expertas 👨‍🍳</p>
              
              <!-- QR Code -->
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`https://tatianas-restaurante.vercel.app/pedido/${order.pedido || order.id}`)}" 
                   alt="QR" 
                   class="qr-code" />
              
              <!-- Número de pedido -->
              <div class="order-number">
                <span>N° de pedido:</span>
                <div>${order.pedido || order.id}</div>
              </div>
            </div>

            <button class="close-button" onclick="window.close()">
              Finalizar y Cerrar
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!order) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 4000,
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '20px',
        background: 'white',
        padding: '25px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        
        {/* VISTA PREVIA DEL TICKET */}
        <div ref={ticketRef}>
          {/* Resumen de Compra */}
          <div style={{
            marginBottom: '1rem',
            border: '1px solid #ececff',
            borderRadius: 12,
            padding: '0.7rem 1rem',
            background: '#fafaff'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#764ba2' }}>
              Resumen de Compra
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              maxHeight: '100px',
              overflowY: 'auto'
            }}>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, i) => (
                  <li key={i} style={{
                    padding: '0.2rem 0',
                    borderBottom: '1px solid #eee',
                    fontSize: '0.9rem'
                  }}>
                    {item.cantidad || 1} x {item.nombre} 
                    <span style={{ float: 'right' }}>
                      ${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}
                    </span>
                  </li>
                ))
              ) : (
                <li style={{ textAlign: 'center', color: '#999' }}>
                  Sin items
                </li>
              )}
            </ul>
            <div style={{
              textAlign: 'right',
              fontSize: '1rem',
              color: '#667eea',
              fontWeight: 'bold',
              marginTop: '8px'
            }}>
              Total: ${(order.total || 0).toFixed(2)}
            </div>
          </div>

          {/* SECCIÓN DE IDENTIDAD (LOGO Y QR) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            background: '#fff',
            borderRadius: '15px',
            animation: 'bounceIn 0.8s ease'
          }}>
            <div style={{
              background: '#fff',
              padding: '12px',
              borderRadius: '25px',
              boxShadow: '0 8px 20px rgba(102,126,234,0.2)',
              marginBottom: '1rem'
            }}>
              <img 
                src="/img/The-One.png" 
                alt="Logo" 
                style={{ width: '130px', height: 'auto' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                }}
              />
            </div>

            <h2 style={{
              margin: 0,
              fontSize: '1.4rem',
              color: '#764ba2',
              fontFamily: 'cursive'
            }}>
              ¡Gracias por elegirnos!
            </h2>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              Tu pedido está en manos expertas 👨‍🍳
            </p>
            
            {/* QR Code */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`https://tatianas-restaurante.vercel.app/pedido/${order.pedido || order.id}`)}`}
              alt="QR" 
              style={{
                width: '150px',
                borderRadius: 10,
                border: '4px solid #f0f0f0'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
              }}
            />
            
            {/* Número de pedido */}
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '1rem', color: '#764ba2', fontWeight: 600 }}>
                N° de pedido:
              </span>
              <div style={{
                fontSize: '1.5rem',
                color: '#333',
                fontWeight: 'bold'
              }}>
                {order.pedido || order.id}
              </div>
            </div>
          </div>
        </div>

        {/* BOTÓN DE CERRAR */}
        <button 
          onClick={onClose}
          style={{
            marginTop: '1rem',
            width: '100%',
            padding: '1rem',
            background: '#764ba2',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(118, 75, 162, 0.3)'
          }}
        >
          Finalizar y Cerrar
        </button>
      </div>
    </div>
  );
}