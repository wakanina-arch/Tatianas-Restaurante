import React, { useState } from 'react';
import EntregaPedido from './EntregaPedido';
import EditMenuDrawer from './EditMenuDrawer';
import ComandasDrawer from './ComandasDrawer';
import ArchivoDrawer from './ArchivoDrawer';
import PromosDrawer from './PromosDrawer';
import Acordeon from './components/Acordeon';

export default function AdminPage({
  menuItems,
  onSaveMenu,
  log,
  addLog,
  pendingOrders,
  setPendingOrders,
  finishedOrders,
  setFinishedOrders
}) {
  // Estados para los drawers
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [promosOpen, setPromosOpen] = useState(false);
  
  // ============================================
  // 🆕 NUEVO ESTADO PARA ARCHIVADOS
  // ============================================
  const [archivedOrders, setArchivedOrders] = useState([]);
  
  // ============================================
  // 🆕 NUEVO ESTADO PARA MODAL DE ENTREGA
  // ============================================
  const [entregaModalOpen, setEntregaModalOpen] = useState(false);

  // Calcular total de caja
  const total = finishedOrders.reduce((acc, order) => acc + (order.total || 0), 0);

  // ============================================
  // 🆕 NUEVA FUNCIÓN PARA ARCHIVAR DESPUÉS DE ENTREGA
  // ============================================
  const handleArchivarPedido = (order) => {
    setArchivedOrders(prev => [...prev, order]);
    
    addLog({
      tipo: 'Archivado',
      pedido: order.id,
      usuario: order.cliente || 'Cliente',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detalle: `Pedido #${order.id} entregado y archivado - Total: $${order.total?.toFixed(2)}`
    });
  };

  // ============================================
  // FUNCIÓN DE PAGO (sin cambios)
  // ============================================
  const handlePayment = (e) => {
    e.preventDefault();
    if (total === 0) {
      alert("❌ No hay pedidos para cobrar");
      return;
    }

    addLog({
      tipo: 'Salida',
      pedido: 'PAGO-CAJA',
      usuario: 'Administrador',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detalle: `Cobro de caja realizado por $${total.toFixed(2)}`
    });

    setFinishedOrders([]);
    alert("✅ Pago registrado con éxito");
    setLogOpen(true);
  };

  // ============================================
  // FUNCIÓN DE CIERRE DE JORNADA (actualizada para incluir archivados)
  // ============================================
  const handleCierreJornada = () => {
    const ventasTotales = log
      .filter(entry => entry.tipo === 'Entrada' || entry.tipo === 'Archivado')
      .reduce((acc, entry) => {
        const match = entry.detalle?.match(/\$(\d+\.?\d*)/);
        return acc + (match ? parseFloat(match[1]) : 0);
      }, 0);

    if (window.confirm(
      `📊 CIERRE DE CAJA\n------------------\n` +
      `Ventas Totales: $${ventasTotales.toFixed(2)}\n` +
      `Pedidos Procesados: ${log.length}\n` +
      `Pedidos Pendientes: ${pendingOrders.length}\n` +
      `Pedidos Archivados: ${archivedOrders.length}\n\n` +
      `¿Deseas descargar el reporte de auditoría?`
    )) {
      const textoReporte = log.map(e =>
        `[${e.hora}] ${e.tipo} | Pedido: ${e.pedido} | Cliente: ${e.usuario} | Info: ${e.detalle}`
      ).join('\n');

      const fecha = new Date();
      const contenido = `*** REPORTE DE VENTAS - ONE TO ONE ***
Fecha: ${fecha.toLocaleDateString()}
Hora Cierre: ${fecha.toLocaleTimeString()}
Total Caja: $${ventasTotales.toFixed(2)}
Pedidos Completados: ${log.length}
Pedidos en Espera: ${pendingOrders.length}
Pedidos Archivados: ${archivedOrders.length}

MOVIMIENTOS:
${textoReporte}`;

      const blob = new Blob([contenido], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cierre_Caja_${fecha.toISOString().slice(0, 10)}.txt`;
      link.click();

      addLog({
        tipo: 'Sistema',
        pedido: 'CIERRE',
        usuario: 'Administrador',
        hora: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detalle: `Cierre de jornada - Total: $${ventasTotales.toFixed(2)}`
      });
    }
  };

  // ============================================
  // FUNCIÓN PARA CONFIRMAR ENTREGA (ya no se usa directamente)
  // La dejamos por compatibilidad pero la reemplazaremos
  // ============================================
  const handleConfirmarEntrega = (order, index) => {
    // Esta función ahora solo moverá a archivados cuando se confirme la entrega
    setFinishedOrders(prev => prev.filter((_, i) => i !== index));
    handleArchivarPedido(order);
  };

  return (
    <section className="admin-page">
      <div className="hero" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>📊 Dashboard Administrativo</h2>
        <p style={{ color: 'var(--gris-secundario)' }}>
          Gestiona menús, pedidos y promociones de tu restaurante
        </p>
      </div>

      {/* ACORDEÓN */}
      <Acordeon
        menuItems={menuItems}
        finishedOrders={finishedOrders}
        pendingOrders={pendingOrders}
        log={log}
        total={total}
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenLog={() => setLogOpen(true)}
        onOpenPromos={() => setPromosOpen(true)}
        onCierreJornada={handleCierreJornada}
        onConfirmarEntrega={handleConfirmarEntrega}
        onPayment={handlePayment}
      />

      {/* DRAWERS */}
      <EditMenuDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        menuItems={menuItems}
        onSave={onSaveMenu}
      />

      {/* ============================================ */}
      {/* ✅ COMANDAS DRAWER ACTUALIZADO */}
      {/* ============================================ */}
      <ComandasDrawer
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        pendingOrders={pendingOrders}
        setPendingOrders={setPendingOrders}
        finishedOrders={finishedOrders}
        setFinishedOrders={setFinishedOrders}
        archivedOrders={archivedOrders}        // 👈 NUEVO
        setArchivedOrders={setArchivedOrders}  // 👈 NUEVO
        addLog={addLog}
        onOpenEntrega={() => setEntregaModalOpen(true)} // 👈 NUEVO
      />

      {/* ============================================ */}
      {/* 🆕 MODAL DE ENTREGA (ESCÁNER QR) */}
      {/* ============================================ */}
      {entregaModalOpen && (
        <div className="modal-backdrop" onClick={() => setEntregaModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setEntregaModalOpen(false)}
            >
              ×
            </button>
            <EntregaPedido
              finishedOrders={finishedOrders}
              setFinishedOrders={setFinishedOrders}
              addLog={addLog}
              onArchivarPedido={handleArchivarPedido}  // 👈 Para archivar después de entrega
              onClose={() => setEntregaModalOpen(false)}
            />
          </div>
        </div>
      )}

      <ArchivoDrawer
        open={logOpen}
        onClose={() => setLogOpen(false)}
        log={log}
      />

      <PromosDrawer
        open={promosOpen}
        onClose={() => setPromosOpen(false)}
        menuItems={menuItems}
        onSaveMenu={onSaveMenu}
      />

      {/* Estilos para el modal */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: var(--gris-secundario);
        }
        .modal-close:hover {
          color: var(--rojo-cierre);
        }
      `}</style>
    </section>
  );
}