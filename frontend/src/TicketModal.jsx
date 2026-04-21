import React from "react";
import CodigoQR from "./CodigoQR";
import { captureTicketAsHTML, downloadTicketHTML, saveTicketToCollection } from "./services/ticketService";

export default function TicketModal({ open, onClose, order, user }) {
  if (!open || !order) return null;

  const fraseGuardada = JSON.parse(localStorage.getItem('fraseOraculo') || '{}');
  const { texto = "El barro espera paciente a que lo moldees.", icono = "⛰️" } = fraseGuardada;

  const handlePrintAndSend = async () => {
    try {
      // 1. Capturar el ticket como HTML profesional (sin botones)
      const ticketData = await captureTicketAsHTML();
      
      if (!ticketData.success) {
        alert('❌ Error al generar el ticket');
        return;
      }

      const orderNumber = order.numero || order.ordenId || 'OTO-001';
      
      // 2. Descargar el archivo HTML (para guardar o enviar por email)
      downloadTicketHTML(ticketData.html, orderNumber);

      // 3. Guardar en la colección local (histórico del comercio)
      saveTicketToCollection(order, ticketData.html);

      // 4. Generar mensaje para WhatsApp (CORREGIDO)
      const itemsList = order.items.map(i => `- ${i.cantidad}x ${i.nombre}`).join('%0A');
      const totalFormateado = Number(order.total || 0).toFixed(2);
      
      const mensajeWA = `*¡Hola! Mi pedido es el #${orderNumber}*%0A` +
        `--------------------------%0A` +
        itemsList +
        `%0A--------------------------%0A` +
        `*Total: $${totalFormateado}*%0A%0A` +
        `_Ref: ${texto}_`;

      // 5. Abrir WhatsApp (URL CORREGIDA)
      const urlWA = `https://wa.me/?text=${mensajeWA}`;
      window.open(urlWA, '_blank');

    } catch (error) {
      console.error('Error en handlePrintAndSend:', error);
      alert('❌ Ocurrió un error inesperado');
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div className="ticket-content" style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.printContainer}>
          <button style={styles.printBtn} onClick={handlePrintAndSend}>
            <span style={styles.printIcon}>📬</span>
          </button>
          <span style={styles.printText}>Enviar<br />Ticket</span>
        </div>

        <div id="ticket-qr" style={styles.qrContainer}>
          <CodigoQR valor={order.numero || order.ordenId || "OTO-001"} tamaño={100} />
        </div>

        <div style={styles.orderInfo}>
          <span style={styles.orderLabel}>Nº DE PEDIDO:</span>
          <span style={styles.orderNumber}>{order.numero || order.ordenId || "OTO-001"}</span>
        </div>

        <div style={styles.fiscalInfo}>
          <span style={styles.fiscalText}>
            {user?.restaurante?.nombreLegal || "Nombre del Comercio"}
          </span>
          <span style={styles.fiscalText}>
            RUC/NIT: {user?.restaurante?.ruc || "0000000000"}
          </span>
          <span style={styles.fiscalText}>
            Fecha: {new Date().toLocaleString('es-ES')}
          </span>
        </div>

        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Resumen de Compra</h3>
          <div style={styles.itemsList}>
            {order.items?.map((item, idx) => (
              <div key={item.id || idx} style={styles.itemRow}>
                <span style={styles.itemName}>{item.cantidad} x {item.nombre}</span>
                <span style={styles.itemPrice}>
                  ${Number(item.precio || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total:</span>
            <span style={styles.totalAmount}>
              ${Number(order.total || 0).toFixed(2)}
            </span>
          </div>
        </div>

        <div style={styles.tridenteContainer}>
          <span style={styles.tridenteIcon}>🔱</span>
        </div>

        <div style={styles.fraseEspiritual}>
          <div style={styles.elementoIcono}>{icono}</div>
          <p style={styles.fraseTexto}>"{texto}"</p>
        </div>

        <button style={styles.finishBtn} onClick={onClose} className="finish-btn">
          Finalizar y Cerrar
        </button>

        <div style={styles.linkContainer}>
          <a href="https://vercel.app" target="_blank" style={styles.link}>
            🔱 OneToOne.app
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 5000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem"
  },
  modal: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: "32px",
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
    padding: "1.5rem",
    maxWidth: "360px",
    width: "90%",
    maxHeight: "85vh",
    overflowY: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: '1px solid rgba(255, 255, 255, 0.5)',
    animation: "slideUp 0.3s ease-out"
  },
  printContainer: {
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px"
  },
  printBtn: {
    background: "linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%)",
    border: "none",
    borderRadius: "30px",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  printIcon: {
    fontSize: "1.2rem"
  },
  printText: {
    color: "var(--gris-texto)",
    fontWeight: "600",
    fontSize: "0.55rem",
    lineHeight: "1",
    textAlign: "center",
    opacity: 0.7
  },
  tridenteContainer: {
    marginBottom: "0.8rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  tridenteIcon: {
    fontSize: "2.5rem",
    filter: "drop-shadow(0 2px 8px rgba(255, 215, 0, 0.3))",
    animation: "pulso 2s infinite"
  },
  fraseEspiritual: {
    background: 'linear-gradient(135deg, #fdf2e9, #fff5f5)',
    padding: '0.6rem 1rem',
    borderRadius: '24px',
    marginBottom: '1rem',
    border: '1px solid #FFD700',
    width: '100%',
    textAlign: 'center'
  },
  elementoIcono: {
    fontSize: '1.6rem',
    marginBottom: '2px'
  },
  fraseTexto: {
    color: '#8B0000',
    fontSize: '0.75rem',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: '1.4'
  },
  summaryCard: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "24px",
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid rgba(255, 179, 71, 0.2)"
  },
  summaryTitle: {
    color: "var(--verde-selva)",
    fontSize: "0.8rem",
    fontWeight: "600",
    margin: "0 0 0.5rem 0",
    textAlign: "left"
  },
  itemsList: {
    maxHeight: "100px",
    overflowY: "auto",
    marginBottom: "0.5rem"
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.3rem 0",
    borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
    fontSize: "0.75rem"
  },
  itemName: {
    color: "var(--gris-texto)"
  },
  itemPrice: {
    fontWeight: "600",
    color: "var(--maracuya)"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "0.5rem",
    paddingTop: "0.5rem",
    borderTop: "1px solid rgba(255, 179, 71, 0.2)",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  totalLabel: {
    color: "var(--verde-selva)"
  },
  totalAmount: {
    color: "var(--maracuya)",
    fontSize: "0.95rem",
    fontWeight: "700"
  },
  qrContainer: {
    padding: '5px',
  },
  orderInfo: {
    textAlign: "center",
    marginBottom: "1rem"
  },
  orderLabel: {
    display: "block",
    fontSize: "0.6rem",
    color: "var(--gris-texto)",
    marginBottom: "0.1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  orderNumber: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "var(--morado-primario)",
    letterSpacing: "1px"
  },
  fiscalInfo: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  fiscalText: {
    display: 'block',
    fontSize: '0.65rem',
    color: 'var(--gris-texto)',
  },
  finishBtn: {
    width: "100%",
    background: "linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontWeight: "600",
    fontSize: "0.85rem",
    padding: "0.7rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "0.6rem"
  },
  linkContainer: {
    textAlign: "center"
  },
  link: {
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: "0.55rem",
    textDecoration: "none",
    transition: "color 0.2s ease"
  }
};

// Estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes pulso {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  
  .print-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 59, 48, 0.2) !important;
  }
  
  #ticket-qr canvas, #ticket-qr img {
    width: 140px !important;
    height: 140px !important;
    border-radius: 16px;
  }
  
  .finish-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important;
  }
  
  .link:hover {
    color: var(--maracuya) !important;
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}