import React, { useState } from 'react';
import EntregaPedido from './EntregaPedido';
import EditMenuDrawer from './EditMenuDrawer';
import ComandasDrawer from './ComandasDrawer';
import ArchivoDrawer from './ArchivoDrawer';
import PromosDrawer from './PromosDrawer';
import Acordeon from './components/Acordeon';

export default function AdminPage({
  comercioId,
  menuItems,
  onSaveMenu,
  log,
  addLog,
  pendingOrders,
  setPendingOrders,
  finishedOrders,
  setFinishedOrders,
  onBack
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [promosOpen, setPromosOpen] = useState(false);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [entregaModalOpen, setEntregaModalOpen] = useState(false);

  const total = finishedOrders.reduce((acc, order) => acc + (order.total || 0), 0);

  const handleArchivarPedido = (order) => {
    setArchivedOrders(prev => [...prev, order]);
    setFinishedOrders(prev => prev.filter(o => o.id !== order.id));
    
    addLog({
      tipo: 'Archivado',
      pedido: order.id,
      usuario: order.cliente || 'Cliente',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detalle: `Pedido #${order.id} entregado y archivado - Total: $${order.total?.toFixed(2)}`
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (total === 0) return alert("❌ No hay pedidos para cobrar");

    addLog({
      tipo: 'Salida',
      pedido: 'PAGO-CAJA',
      usuario: 'Administrador',
      detalle: `Cobro de caja realizado por $${total.toFixed(2)}`
    });

    setFinishedOrders([]);
    alert("✅ Pago registrado con éxito");
    setLogOpen(true);
  };

  const handleCierreJornada = () => {
    const ventasTotales = log
      .filter(entry => entry.tipo === 'Entrada' || entry.tipo === 'Archivado')
      .reduce((acc, entry) => {
        const match = entry.detalle?.match(/\$(\d+\.?\d*)/);
        return acc + (match ? parseFloat(match[1]) : 0);
      }, 0);

    if (window.confirm(`📊 CIERRE DE CAJA\nVentas Totales: $${ventasTotales.toFixed(2)}\n¿Descargar reporte?`)) {
      const fecha = new Date();
      const contenido = `REPORTE ONE TO ONE\nFecha: ${fecha.toLocaleDateString()}\nTotal: $${ventasTotales.toFixed(2)}`;
      const blob = new Blob([contenido], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cierre_${fecha.toISOString().slice(0, 10)}.txt`;
      link.click();
    }
  };

  return (
    <section className="admin-page" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0.75rem',
      paddingBottom: '0'
    }}>
      {/* HERO COMPACTO */}
      <div style={{
        marginBottom: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 69, 0, 0.03) 100%)',
        borderRadius: '40px',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '4px'
        }}>
          <span style={{ 
            fontSize: '1.8rem', 
            lineHeight: 1,
            filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.5))'
          }}>
            🔱
          </span>
          
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.3px'
          }}>
            Panel Administrativo
          </h2>
        </div>

        <p style={{
          margin: 0,
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.65rem',
          letterSpacing: '2px',
          fontWeight: '500',
          wordSpacing: '3px'
        }}>
          Gestión integral del comercio
        </p>
      </div>

      {/* ACORDEON */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '0.5rem'
      }}>
        <Acordeon
          menuItems={menuItems}
          finishedOrders={finishedOrders}
          setFinishedOrders={setFinishedOrders}
          pendingOrders={pendingOrders}
          log={log}
          addLog={addLog}
          total={total}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenOrders={() => setOrdersOpen(true)}
          onOpenLog={() => setLogOpen(true)}
          onOpenPromos={() => setPromosOpen(true)}
          onCierreJornada={handleCierreJornada}
          onPayment={handlePayment}
          isDraftMode={true}
        />
      </div>

      {/* DRAWERS Y MODALES */}
      <EditMenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} comercioId={comercioId} menuItems={menuItems} onSave={onSaveMenu} />

      <ComandasDrawer
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        pendingOrders={pendingOrders}
        setPendingOrders={setPendingOrders}
        finishedOrders={finishedOrders}
        setFinishedOrders={setFinishedOrders}
        archivedOrders={archivedOrders}
        setArchivedOrders={setArchivedOrders}
        addLog={addLog}
        onOpenEntrega={() => setEntregaModalOpen(true)}
      />

      {entregaModalOpen && (
        <div className="modal-backdrop" onClick={() => setEntregaModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEntregaModalOpen(false)}>×</button>
            <EntregaPedido
              finishedOrders={finishedOrders}
              setFinishedOrders={setFinishedOrders}
              addLog={addLog}
              onArchivarPedido={handleArchivarPedido}
              onClose={() => setEntregaModalOpen(false)}
            />
          </div>
        </div>
      )}

      <ArchivoDrawer open={logOpen} onClose={() => setLogOpen(false)} log={log} />
      <PromosDrawer open={promosOpen} onClose={() => setPromosOpen(false)} menuItems={menuItems} onSaveMenu={onSaveMenu} />

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: white;
          border-radius: 24px;
          padding: 1.5rem;
          max-width: 500px;
          width: 90%;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .modal-close {
          position: absolute;
          top: 10px; right: 10px;
          background: #f0f0f0;
          border: none;
          width: 30px; height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
        }
        @media (max-width: 480px) {
          .modal-content {
            padding: 1rem;
          }
        }
      `}</style>
    </section>
  );
}