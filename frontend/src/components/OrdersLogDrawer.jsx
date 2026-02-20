import React, { useState, useMemo } from "react";
import TicketModal from "./TicketModal";

export default function OrdersLogDrawer({ open, onClose, orders = [] }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const kanbanColumns = useMemo(() => {
    const ahora = new Date();
    const filtrados = orders.filter(o => {
      const matchId = (o._id || "").toLowerCase().includes(busqueda.toLowerCase());
      const matchPlatos = o.items?.some(item => item.nombre.toLowerCase().includes(busqueda.toLowerCase()));
      return matchId || matchPlatos;
    });

    return {
      recientes: filtrados.filter(o => (ahora - new Date(o.fecha)) < 3600000), 
      hoy: filtrados.filter(o => {
        const d = new Date(o.fecha);
        return d.getDate() === ahora.getDate() && (ahora - d) >= 3600000;
      }),
      archivo: filtrados.filter(o => new Date(o.fecha).getDate() !== ahora.getDate())
    };
  }, [orders, busqueda]);

  if (!open) return null;

  return (
    <div style={backdropStyle}>
      <div style={drawerStyle}>
        {/* BOTÓN X SUPERIOR (SALIDA RÁPIDA) */}
        <button className="close-btn" onClick={onClose}>×</button>

        <div style={headerStyle}>
          <h2 style={{ color: "var(--selva-deep)", margin: 0, fontFamily: 'Fraunces' }}>Repositorio de Auditoría</h2>
          <div style={searchContainerStyle}>
            <input 
              type="text"
              placeholder="🔍 Buscar ID (ej: ORD-123) o Plato..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={searchInputStyle}
            />
          </div>
        </div>

        <div style={kanbanBoardStyle}>
          <div style={columnStyle}>
            <h4 style={labelStyle}>⚡ RECIENTES</h4>
            {kanbanColumns.recientes.map((order, i) => (
              <TicketCard key={order._id || i} order={order} onSelect={setSelectedOrder} color="#FF8243" />
            ))}
          </div>

          <div style={columnStyle}>
            <h4 style={labelStyle}>📅 HOY</h4>
            {kanbanColumns.hoy.map((order, i) => (
              <TicketCard key={order._id || i} order={order} onSelect={setSelectedOrder} color="var(--selva-deep)" />
            ))}
          </div>

          <div style={columnStyle}>
            <h4 style={labelStyle}>📁 ARCHIVO</h4>
            {kanbanColumns.archivo.map((order, i) => (
              <TicketCard key={order._id || i} order={order} onSelect={setSelectedOrder} color="#999" />
            ))}
          </div>
        </div>

        {/* BOTÓN DE CIERRE INFERIOR (MÉTODO TRADICIONAL) */}
        <button style={closeBtnStyle} onClick={onClose}>
          Finalizar Consulta
        </button>
      </div>

      {selectedOrder && (
        <TicketModal 
          open={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          order={selectedOrder} 
        />
      )}
    </div>
  );
}

function TicketCard({ order, onSelect, color }) {
    return (
      <div style={{ ...orderCardStyle, borderLeft: `5px solid ${color}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: "0.85rem", color: "var(--selva-deep)" }}>
            #{order._id ? order._id.toUpperCase() : "ORD-NEW"}
          </strong>
          <button style={miniPrintBtn} onClick={() => onSelect(order)}>🖨️</button>
        </div>
        <div style={{ fontSize: "0.75rem", margin: "5px 0" }}>
          {order.items?.length || 0} items | <strong>${order.total?.toFixed(2)}</strong>
        </div>
      </div>
    );
}

// --- ESTILOS ACTUALIZADOS ---
const closeXStyle = {
  position: "absolute", top: "20px", left: "20px", background: "none", border: "none",
  fontSize: "1.5rem", color: "#ccc", cursor: "pointer", zIndex: 10
};

const closeBtnStyle = {
  marginTop: "2rem", width: "100%", background: "var(--selva-deep)", color: "white",
  border: "none", borderRadius: "12px", fontWeight: "bold", padding: "15px", cursor: "pointer",
  boxShadow: "0 4px 12px rgba(13, 89, 64, 0.2)"
};

const backdropStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 4000, display: "flex", justifyContent: "flex-end", backdropFilter: "blur(3px)" };
const drawerStyle = { width: "650px", background: "white", height: "100%", padding: "3rem 2rem 2rem 2rem", display: "flex", flexDirection: "column", boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", position: "relative" };
const headerStyle = { borderBottom: "2px solid #f5f5f5", paddingBottom: "1.5rem", marginBottom: "1.5rem" };
const searchContainerStyle = { marginTop: "1rem" };
const searchInputStyle = { width: "100%", padding: "12px 15px", borderRadius: "10px", border: "2px solid #eee", fontSize: "0.9rem", outline: "none" };
const kanbanBoardStyle = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", flex: 1, overflowY: "auto" };
const columnStyle = { background: "#f4f5f7", borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "0.7rem", textAlign: "center", margin: "0 0 5px 0", color: "#5e6c84", letterSpacing: "1px" };
const orderCardStyle = { background: "white", padding: "10px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" };
const miniPrintBtn = { background: "var(--papaya-primary)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", padding: "2px 6px" };
