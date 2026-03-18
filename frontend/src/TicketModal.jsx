import React from "react";

export default function TicketModal({ open, onClose, order }) {
  if (!open || !order) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* Botón de impresión */}
        <div style={styles.printContainer}>
          <button style={styles.printBtn} onClick={() => window.print()}>
            <span style={styles.printIcon}>🖨️</span>
          </button>
          <span style={styles.printText}>Imprimir<br />Ticket</span>
        </div>

        {/* Resumen de compra */}
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Resumen de Compra</h3>
          <div style={styles.itemsList}>
            {order.items?.map((item, idx) => (
              <div key={item.id || idx} style={styles.itemRow}>
                <span style={styles.itemName}>{item.cantidad} x {item.nombre}</span>
                <span style={styles.itemPrice}>${item.precio?.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total:</span>
            <span style={styles.totalAmount}>${order.total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <img 
            src={order.logoUrl || "/img/The-One.png"} 
            alt="Logo" 
            style={styles.logo} 
          />
        </div>

        {/* Mensaje de agradecimiento */}
        <div style={styles.thanksContainer}>
          <h2 style={styles.thanksTitle}>¡Gracias por elegirnos!</h2>
          <p style={styles.thanksSubtitle}>
            Tu pedido está en manos expertas <span style={styles.chefIcon}>👨‍🍳</span>
          </p>
        </div>

        {/* QR y número de pedido */}
        <div style={styles.qrContainer}>
          <img 
            src={order.qrUrl || "/qr-placeholder.png"} 
            alt="QR" 
            style={styles.qrImage} 
          />
        </div>
        
        <div style={styles.orderInfo}>
          <span style={styles.orderLabel}>Nº de pedido:</span>
          <span style={styles.orderNumber}>{order.numero || "ORD-910"}</span>
        </div>

        {/* Botón finalizar */}
        <button style={styles.finishBtn} onClick={onClose}>
          Finalizar y Cerrar
        </button>

        {/* Enlace */}
        <div style={styles.linkContainer}>
          <a 
            href="https://tatianas-restaurante.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={styles.link}
          >
            tatianas-restaurante.vercel.app
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ESTILOS IPHONE 16 - VERSIÓN MINIMALISTA
// ============================================
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.15)", // Más transparente
    backdropFilter: "blur(4px)", // Menos blur
    WebkitBackdropFilter: "blur(4px)",
    zIndex: 5000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1.5rem" // Más padding alrededor
  },
  modal: {
    background: "rgba(255, 255, 255, 0.85)", // Ligeramente más transparente
    backdropFilter: "blur(10px)", // Menos blur
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "32px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)", // Sombra más suave
    padding: "2.5rem 1.5rem 1.5rem",
    minWidth: "300px", // Un poco más estrecho
    maxWidth: "360px", // Más compacto
    width: "100%",
    maxHeight: "85vh", // Menos altura máxima
    overflowY: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid rgba(255, 255, 255, 0.3)"
  },
  printContainer: {
    position: "absolute",
    top: "12px", // Menos separación
    right: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px" // Menos gap
  },
  printBtn: {
    background: "linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%)",
    border: "none",
    borderRadius: "30px",
    width: "40px", // Más pequeño
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(255, 59, 48, 0.15)", // Sombra más suave
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  printIcon: {
    fontSize: "1.2rem" // Más pequeño
  },
  printText: {
    color: "var(--gris-texto)",
    fontWeight: "600",
    fontSize: "0.6rem", // Más pequeño
    lineHeight: "1",
    textAlign: "center",
    opacity: 0.7
  },
  summaryCard: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.3)", // Más transparente
    borderRadius: "20px", // Un poco menos
    padding: "1rem", // Menos padding
    marginBottom: "1.2rem", // Menos margen
    border: "1px solid rgba(255, 255, 255, 0.3)"
  },
  summaryTitle: {
    color: "var(--verde-selva)",
    fontSize: "1rem", // Más pequeño
    fontWeight: "600",
    margin: "0 0 0.8rem 0",
    textAlign: "left"
  },
  itemsList: {
    maxHeight: "120px", // Menos altura
    overflowY: "auto",
    marginBottom: "0.6rem"
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.3rem 0", // Menos padding
    borderBottom: "1px solid rgba(0, 0, 0, 0.03)", // Más sutil
    fontSize: "0.85rem" // Más pequeño
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
    marginTop: "0.6rem",
    paddingTop: "0.6rem",
    borderTop: "1px solid rgba(255, 179, 71, 0.15)", // Más sutil
    fontSize: "0.95rem",
    fontWeight: "600"
  },
  totalLabel: {
    color: "var(--verde-selva)"
  },
  totalAmount: {
    color: "var(--maracuya)",
    fontSize: "1.1rem", // Más pequeño
    fontWeight: "700"
  },
  logoContainer: {
    marginBottom: "0.8rem", // Menos margen
    background: "white",
    padding: "8px", // Menos padding
    borderRadius: "24px", // Un poco menos
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)" // Sombra más suave
  },
  logo: {
    width: "80px", // Más pequeño
    height: "auto",
    display: "block"
  },
  thanksContainer: {
    textAlign: "center",
    marginBottom: "1.2rem" // Menos margen
  },
  thanksTitle: {
    color: "var(--verde-selva)",
    fontSize: "1.1rem", // Más pequeño
    fontWeight: "600",
    margin: "0 0 0.2rem 0"
  },
  thanksSubtitle: {
    color: "var(--gris-texto)",
    fontSize: "0.8rem", // Más pequeño
    margin: 0,
    opacity: 0.7
  },
  chefIcon: {
    fontSize: "0.9rem"
  },
  qrContainer: {
    marginBottom: "0.8rem", // Menos margen
    padding: "0.4rem", // Menos padding
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.03)" // Sombra más suave
  },
  qrImage: {
    width: "100px", // Más pequeño
    height: "100px",
    borderRadius: "12px",
    display: "block"
  },
  orderInfo: {
    textAlign: "center",
    marginBottom: "1.2rem" // Menos margen
  },
  orderLabel: {
    display: "block",
    fontSize: "0.7rem", // Más pequeño
    color: "var(--gris-texto)",
    marginBottom: "0.1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  orderNumber: {
    fontSize: "1.2rem", // Más pequeño
    fontWeight: "700",
    color: "var(--morado-primario)",
    letterSpacing: "1px"
  },
  finishBtn: {
    width: "100%",
    background: "linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontWeight: "600",
    fontSize: "0.9rem", // Más pequeño
    padding: "10px", // Menos padding
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 8px rgba(99, 102, 241, 0.15)", // Sombra más suave
    marginBottom: "0.8rem" // Menos margen
  },
  linkContainer: {
    textAlign: "center"
  },
  link: {
    color: "rgba(0, 0, 0, 0.3)",
    fontSize: "0.65rem", // Más pequeño
    textDecoration: "none",
    transition: "color 0.2s ease"
  }
};

// ============================================
// ESTILOS DINÁMICOS (hover effects)
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .print-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(255, 59, 48, 0.2) !important;
  }

  .finish-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(99, 102, 241, 0.2) !important;
  }

  .link:hover {
    color: var(--maracuya) !important;
  }

  /* Scrollbar personalizado */
  .items-list::-webkit-scrollbar {
    width: 3px; /* Más delgada */
  }

  .items-list::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 2px;
  }

  .items-list::-webkit-scrollbar-thumb {
    background: var(--maracuya);
    border-radius: 2px;
  }
`;

// Añadir estilos al documento
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}