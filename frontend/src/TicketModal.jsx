import React from "react";
import CodigoQR from "./CodigoQR";

export default function TicketModal({ open, onClose, order, user, onBackToWelcome }) {
  if (!open || !order) return null;

  const fraseGuardada = JSON.parse(localStorage.getItem('fraseOraculo') || '{}');
  const { texto = "El barro espera paciente a que lo moldees.", icono = "⛰️" } = fraseGuardada;

  const handlePrintAndSend = async () => {
    try {
      const orderNumber = order.numero || order.ordenId || 'OTO-001';
      const totalFormateado = Number(order.total || 0).toFixed(2);
      const itemsList = order.items.map(i => `- ${i.cantidad}x ${i.nombre}`).join('%0A');

      // 1. Capturar el HTML del ticket visual (el mismo que ve el cliente)
      const ticketElement = document.querySelector('.ticket-content');
      if (!ticketElement) throw new Error('No se encontró el ticket');

      const ticketClone = ticketElement.cloneNode(true);
      
      // Eliminar botones del clon
      const printContainer = ticketClone.querySelector('[style*="position: absolute"]');
      if (printContainer) printContainer.remove();
      const finishBtn = ticketClone.querySelector('.finish-btn');
      if (finishBtn) finishBtn.remove();
      const linkContainer = ticketClone.querySelector('[style*="textAlign: center"]');
      if (linkContainer) linkContainer.remove();

      const estilos = Array.from(document.querySelectorAll('style'))
        .map(style => style.innerHTML)
        .join('\n');

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ticket #${orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: flex; justify-content: center; align-items: center;
              min-height: 100vh; background: #f0f0f0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
            }
            .ticket-content {
              background: rgba(255, 255, 255, 0.95);
              border-radius: 32px; padding: 1.5rem;
              max-width: 360px; width: 100%;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
              display: flex; flexDirection: column; alignItems: center;
            }
            ${estilos}
          </style>
        </head>
        <body>${ticketClone.outerHTML}</body>
        </html>
      `;

      // 2. Descargar el HTML
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 3. Guardar en localStorage
      let collection = JSON.parse(localStorage.getItem('ticketsCollection') || '[]');
      collection.push({
        id: `TICKET-${Date.now()}`,
        orderNumber,
        total: totalFormateado,
        items: order.items || [],
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem('ticketsCollection', JSON.stringify(collection));

      // 4. Abrir WhatsApp
      const mensajeWA = `*¡Hola! Mi pedido es el #${orderNumber}*%0A` +
        `--------------------------%0A` +
        itemsList +
        `%0A--------------------------%0A` +
        `*Total: $${totalFormateado}*%0A%0A` +
        `_Ref: ${texto}_`;

      window.open(`https://wa.me/?text=${mensajeWA}`, '_blank');

    } catch (error) {
      console.error('Error en handlePrintAndSend:', error);
      alert('❌ Ocurrió un error inesperado');
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div className="ticket-content" style={S.modal} onClick={e => e.stopPropagation()}>
        
        {/* Botón Enviar Ticket */}
        <div style={S.printContainer}>
          <button style={S.printBtn} onClick={handlePrintAndSend}>
            <span style={S.printIcon}>📬</span>
          </button>
          <span style={S.printText}>Enviar<br />Ticket</span>
        </div>

        {/* QR */}
        <div id="ticket-qr" style={S.qrContainer}>
          <CodigoQR valor={order.numero || order.ordenId || "OTO-001"} tamaño={100} />
        </div>

        {/* Nº Pedido */}
        <div style={S.orderInfo}>
          <span style={S.orderLabel}>Nº DE PEDIDO:</span>
          <span style={S.orderNumber}>{order.numero || order.ordenId || "OTO-001"}</span>
        </div>

        {/* Info Fiscal */}
        <div style={S.fiscalInfo}>
          <span style={S.fiscalText}>{user?.restaurante?.nombreLegal || "Nombre del Comercio"}</span>
          <span style={S.fiscalText}>RUC/NIT: {user?.restaurante?.ruc || "0000000000"}</span>
          <span style={S.fiscalText}>Fecha: {new Date().toLocaleString('es-ES')}</span>
        </div>

        {/* Resumen de Compra */}
        <div style={S.summaryCard}>
          <h3 style={S.summaryTitle}>Resumen de Compra</h3>
          <div style={S.itemsList}>
            {order.items?.map((item, idx) => (
              <div key={item.id || idx} style={S.itemRow}>
                <span style={S.itemName}>{item.cantidad} x {item.nombre}</span>
                <span style={S.itemPrice}>${Number(item.precio || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={S.totalRow}>
            <span style={S.totalLabel}>Total:</span>
            <span style={S.totalAmount}>${Number(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Tridente */}
        <div style={S.tridenteContainer}>
          <span style={S.tridenteIcon}>🔱</span>
        </div>

        {/* Frase */}
        <div style={S.fraseEspiritual}>
          <div style={S.elementoIcono}>{icono}</div>
          <p style={S.fraseTexto}>"{texto}"</p>
        </div>

        {/* Finalizar y Cerrar */}
        <button 
          style={S.finishBtn} 
          onClick={() => {
            onClose();
            if (onBackToWelcome) onBackToWelcome();
          }} 
          className="finish-btn"
        >
          Finalizar y Cerrar
        </button>

        {/* Link OneToOne */}
        <div style={S.linkContainer}>
          <a href="https://vercel.app" target="_blank" style={S.link}>🔱 OneToOne.app</a>
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 5000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  modal: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: "32px",
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    padding: "1.5rem",
    maxWidth: "360px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: '1px solid rgba(255, 255, 255, 0.3)',
    animation: "slideUp 0.3s ease-out",
    margin: "auto",
  },
  printContainer: {
    position: "absolute",
    top: "12px", right: "12px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
    zIndex: 10,
  },
  printBtn: {
    background: '#250e0e',
    border: '2px solid #F5F5F5',
    borderRadius: '50%',
    width: '40px', height: '40px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  printIcon: { fontSize: '1.2rem', color: '#F5F5F5' },
  printText: { color: '#666', fontWeight: '600', fontSize: '0.5rem', lineHeight: '1', textAlign: 'center', opacity: 0.7 },
  qrContainer: { padding: '5px' },
  orderInfo: { textAlign: "center", marginBottom: "1rem" },
  orderLabel: { display: "block", fontSize: "0.6rem", color: "#999", marginBottom: "0.1rem", textTransform: "uppercase", letterSpacing: "0.5px" },
  orderNumber: { fontSize: "1rem", fontWeight: "700", color: "#6366f1", letterSpacing: "1px" },
  fiscalInfo: { width: '100%', textAlign: 'center', marginBottom: '1rem' },
  fiscalText: { display: 'block', fontSize: '0.65rem', color: '#999' },
  summaryCard: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "24px",
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid rgba(139, 92, 246, 0.2)",
  },
  summaryTitle: { color: "#047857", fontSize: "0.8rem", fontWeight: "600", margin: "0 0 0.5rem 0", textAlign: "left" },
  itemsList: { maxHeight: "100px", overflowY: "auto", marginBottom: "0.5rem" },
  itemRow: { display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid rgba(0,0,0,0.03)", fontSize: "0.75rem" },
  itemName: { color: "#666" },
  itemPrice: { fontWeight: "600", color: "#f97316" },
  totalRow: { display: "flex", justifyContent: "space-between", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,179,71,0.2)", fontSize: "0.8rem", fontWeight: "600" },
  totalLabel: { color: "#047857" },
  totalAmount: { color: "#f97316", fontSize: "0.95rem", fontWeight: "700" },
  tridenteContainer: { marginBottom: "0.8rem", display: "flex", justifyContent: "center", alignItems: "center" },
  tridenteIcon: { fontSize: "2.5rem", filter: "drop-shadow(0 2px 8px rgba(255,215,0,0.3))", animation: "pulso 2s infinite" },
  fraseEspiritual: {
    background: 'linear-gradient(135deg, #fdf2e9, #fff5f5)',
    padding: '0.6rem 1rem', borderRadius: '24px', marginBottom: '1rem',
    border: '1px solid #FFD700', width: '100%', textAlign: 'center',
  },
  elementoIcono: { fontSize: '1.6rem', marginBottom: '2px' },
  fraseTexto: { color: '#8B0000', fontSize: '0.75rem', fontStyle: 'italic', margin: 0, lineHeight: '1.4' },
  finishBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white", border: "none", borderRadius: "30px",
    fontWeight: "600", fontSize: "0.85rem", padding: "0.7rem",
    cursor: "pointer", transition: "all 0.2s ease", marginBottom: "0.6rem",
  },
  linkContainer: { textAlign: "center" },
  link: { color: "rgba(0,0,0,0.3)", fontSize: "0.55rem", textDecoration: "none", transition: "color 0.2s ease" },
};

// Estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes pulso { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
  .print-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 59, 48, 0.2) !important; }
  #ticket-qr canvas, #ticket-qr img { width: 140px !important; height: 140px !important; border-radius: 16px; }
  .finish-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important; }
  .link:hover { color: #f97316 !important; }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}