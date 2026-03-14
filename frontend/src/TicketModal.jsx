import React from "react";

export default function TicketModal({ open, onClose, order }) {
  if (!open || !order) return null;

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        {/* Botón de imprimir ticket */}
        <div style={printBtnContainerStyle}>
          <button style={printBtnStyle} onClick={() => window.print()}>
            <span role="img" aria-label="printer" style={{ fontSize: "1.7rem" }}>🖨️</span>
          </button>
          <span style={printTextStyle}>Imprimir<br />Ticket</span>
        </div>

        {/* Resumen de compra */}
        <div style={summaryCardStyle}>
          <div style={summaryTitleStyle}>Resumen de Compra</div>
          <div style={summaryItemsStyle}>
            {order.items.map(item => (
              <div key={item.id} style={itemRowStyle}>
                <span>{item.cantidad} x {item.nombre}</span>
                <span style={{ fontWeight: 500 }}>${item.precio?.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={totalRowStyle}>
            <span style={{ fontWeight: 700, color: "#4f5bd5" }}>Total:</span>
            <span style={{ fontWeight: 700, color: "#4f5bd5" }}>${order.total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Logo */}
        <div style={logoContainerStyle}>
          <img src={order.logoUrl || "/logo-theone.png"} alt="Logo" style={logoStyle} />
        </div>

        {/* Mensaje de agradecimiento */}
        <div style={thanksStyle}>
          <div style={thanksTitleStyle}>¡Gracias por elegirnos!</div>
          <div style={thanksSubtitleStyle}>
            Tu pedido está en manos expertas <span role="img" aria-label="chef">👨‍🍳</span>
          </div>
        </div>

        {/* QR y número de pedido */}
        <div style={qrContainerStyle}>
          <img src={order.qrUrl || "/qr-placeholder.png"} alt="QR" style={qrStyle} />
        </div>
        <div style={orderNumStyle}>
          <span style={{ color: "#764ba2", fontWeight: 700 }}>Nº de pedido:</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#333" }}>{order.numero || "ORD-910"}</div>
        </div>

        {/* Botón finalizar */}
        <button style={finishBtnStyle} onClick={onClose}>
          Finalizar y Cerrar
        </button>

        {/* Enlace */}
        <div style={linkContainerStyle}>
          <a href="https://tatianas-restaurante.vercel.app" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            tatianas-restaurante.vercel.app
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Estilos ---
const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.07)",
  zIndex: 5000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalStyle = {
  background: "#fff",
  borderRadius: "28px",
  boxShadow: "0 8px 32px rgba(118,75,162,0.15)",
  padding: "2.5rem 1.2rem 1.2rem 1.2rem",
  minWidth: "340px",
  maxWidth: "95vw",
  maxHeight: "95vh",
  overflowY: "auto",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const printBtnContainerStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const printBtnStyle = {
  background: "#ff4757",
  border: "none",
  borderRadius: "50%",
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(255,71,87,0.2)",
  cursor: "pointer"
};

const printTextStyle = {
  color: "#222",
  fontWeight: 600,
  fontSize: "1rem",
  lineHeight: "1.1",
  marginTop: "2px",
  textAlign: "center"
};

const summaryCardStyle = {
  background: "#f8f8ff",
  borderRadius: "18px",
};

const summaryTitleStyle = {
  color: "#4f5bd5",
  fontSize: "1.5rem",
  fontWeight: 700,
};

const summaryItemsStyle = {
  color: "#333",
  fontSize: "0.9rem",
  marginBottom: "0.5rem",
};

const itemRowStyle = {
  color: "#333",
  fontSize: "0.9rem",
  marginBottom: "0.5rem",
};

const totalRowStyle = {
  color: "#4f5bd5",
  fontSize: "1.2rem",
  fontWeight: 700,
};

const logoContainerStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  display: "flex",
  alignItems: "center",
};

const logoStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
};

const thanksStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  display: "flex",
  alignItems: "center",
};

const thanksTitleStyle = {
  color: "#4f5bd5",
  fontSize: "1.5rem",
  fontWeight: 700,
};

const thanksSubtitleStyle = {
  color: "#333",
  fontSize: "0.9rem",
};

const qrContainerStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  display: "flex",
  alignItems: "center",
};

const qrStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
};

const orderNumStyle = {
  color: "#764ba2",
  fontWeight: 700,
};

const finishBtnStyle = {
  marginTop: "1rem",
  width: "100%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "1rem",
  padding: "12px",
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(118,75,162,0.3)"
};