import React, { useState } from 'react';
import EntregaPedido from './EntregaPedido';      
import EditMenuDrawer from './EditMenuDrawer';
import ComandasDrawer from './ComandasDrawer';    
import ArchivoDrawer from './ArchivoDrawer';      
import PromosDrawer from './PromosDrawer';

// ============================================
// ADMIN PAGE - DASHBOARD DEL RESTAURANTE
// Integrado con el sistema de estilos One To One
// ============================================

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
  const [showPendingList, setShowPendingList] = useState(false);

  // Calcular total de caja
  const total = finishedOrders.reduce((acc, order) => acc + (order.total || 0), 0);

  // ============================================
  // FUNCIÓN DE PAGO
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
  // FUNCIÓN DE CIERRE DE JORNADA
  // ============================================
  const handleCierreJornada = () => {
    const ventasTotales = log
      .filter(entry => entry.tipo === 'Entrada')
      .reduce((acc, entry) => {
        const match = entry.detalle?.match(/\$(\d+\.?\d*)/);
        return acc + (match ? parseFloat(match[1]) : 0);
      }, 0);

    if (window.confirm(
      `📊 CIERRE DE CAJA\n------------------\n` +
      `Ventas Totales: $${ventasTotales.toFixed(2)}\n` +
      `Pedidos Procesados: ${log.length}\n` +
      `Pedidos Pendientes: ${pendingOrders.length}\n\n` +
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
  // FUNCIÓN PARA CONFIRMAR ENTREGA
  // ============================================
  const handleConfirmarEntrega = (order, index) => {
    setPendingOrders(pendingOrders.filter((_, i) => i !== index));
    setFinishedOrders([...finishedOrders, {
      ...order,
      entregado: true,
      horaEntrega: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    addLog({
      tipo: 'Entrada',
      pedido: order.numero || order.id || `ORD-${index + 1}`,
      usuario: order.cliente || 'Cliente',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detalle: `Pedido entregado - Total: $${order.total?.toFixed(2) || 0}`
    });
  };

  return (
    <section className="admin-page">
      <div className="hero" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>📊 Dashboard Administrativo</h2>
        <p style={{ color: 'var(--gris-secundario)' }}>
          Gestiona menús, pedidos y promociones de tu restaurante
        </p>
      </div>

      <div className="admin-container">
        {/* ======================================== */}
        {/* TARJETA 1: CAJA RÁPIDA */}
        {/* ======================================== */}
        <div className="admin-card" style={styles.cajaCard}>
          <div style={styles.cardHeader}>
            <h3>💰 Caja Rápida</h3>
            {finishedOrders.length > 0 && (
              <span style={styles.badgeCounter}>{finishedOrders.length}</span>
            )}
          </div>
          
          <div style={styles.totalDisplay}>
            <span style={styles.totalLabel}>Total en caja:</span>
            <span style={styles.totalAmount}>${total.toFixed(2)}</span>
          </div>

          <EntregaPedido 
            finishedOrders={finishedOrders} 
            setFinishedOrders={setFinishedOrders} 
            addLog={addLog} 
          />

          <button
            className="admin-btn"
            style={{
              ...styles.pedidosBtn,
              opacity: finishedOrders.length === 0 ? 0.5 : 1,
              cursor: finishedOrders.length === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={() => setShowPendingList(!showPendingList)}
            disabled={finishedOrders.length === 0}
          >
            <span>📋 Pedidos por cobrar ({finishedOrders.length})</span>
            <span style={styles.chevron}>{showPendingList ? '▼' : '▶'}</span>
          </button>

          {showPendingList && finishedOrders.length > 0 && (
            <div style={styles.pendingList}>
              {finishedOrders.map((order, idx) => (
                <div key={order.id || idx} style={styles.pendingItem}>
                  <div style={styles.pendingInfo}>
                    <span style={styles.pendingNumber}>#{order.numero || order.id || idx + 1}</span>
                    <span style={styles.pendingTotal}>${order.total?.toFixed(2)}</span>
                  </div>
                  <button
                    className="add-btn-small"
                    style={styles.cobrarBtn}
                    onClick={() => {
                      const fakeEvent = { preventDefault: () => {} };
                      handlePayment(fakeEvent);
                    }}
                  >
                    Cobrar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* TARJETA 2: ACTUALIZAR MENÚ */}
        {/* ======================================== */}
        <div className="admin-card" style={styles.menuCard}>
          <div style={styles.cardHeader}>
            <h3>📝 Menú del Día</h3>
            <span style={styles.itemCount}>{menuItems.length} platos</span>
          </div>
          <p style={styles.cardDescription}>Gestiona precios, opciones y disponibilidad</p>
          <button 
            className="admin-btn" 
            onClick={() => setDrawerOpen(true)}
            style={styles.actionBtn}
          >
            ✏️ Editar Menú
          </button>
        </div>

        {/* ======================================== */}
        {/* TARJETA 3: PROMOCIONES */}
        {/* ======================================== */}
        <div className="admin-card" style={styles.promosCard}>
          <div style={styles.cardHeader}>
            <h3>🏷️ Promociones</h3>
            {menuItems.filter(i => i.enOferta).length > 0 && (
              <span style={styles.promoBadge}>
                {menuItems.filter(i => i.enOferta).length} activas
              </span>
            )}
          </div>
          <p style={styles.cardDescription}>Configura ofertas y descuentos especiales</p>
          <button 
            className="admin-btn" 
            onClick={() => setPromosOpen(true)}
            style={styles.actionBtn}
          >
            🚀 Gestionar Promos
          </button>
        </div>

        {/* ======================================== */}
        {/* TARJETA 4: COMANDAS EN VIVO */}
        {/* ======================================== */}
        <div className="admin-card" style={styles.ordersCard}>
          <div style={styles.cardHeader}>
            <h3>👨‍🍳 Comandas</h3>
            {pendingOrders.length > 0 && (
              <span className="notification-badge">{pendingOrders.length}</span>
            )}
          </div>
          <p style={styles.cardDescription}>Visualiza y gestiona pedidos en tiempo real</p>
          
          {pendingOrders.length > 0 && (
            <div style={styles.previewOrders}>
              {pendingOrders.slice(0, 2).map((order, idx) => (
                <div key={order.id || idx} style={styles.previewItem}>
                  <span>#{order.numero || order.id || idx + 1}</span>
                  <span style={styles.previewStatus}>⏳ Pendiente</span>
                </div>
              ))}
              {pendingOrders.length > 2 && (
                <span style={styles.moreItems}>+{pendingOrders.length - 2} más</span>
              )}
            </div>
          )}

          <button 
            className="admin-btn" 
            onClick={() => setOrdersOpen(true)}
            style={styles.actionBtn}
          >
            📋 Ver Comandas
          </button>
        </div>

        {/* ======================================== */}
        {/* TARJETA 5: REGISTRO DE CONTROL */}
        {/* ======================================== */}
        <div className="admin-card" style={styles.logCard}>
          <div style={styles.cardHeader}>
            <h3>📊 Registro</h3>
            <span style={styles.logCount}>{log.length} movimientos</span>
          </div>
          <p style={styles.cardDescription}>Auditoría de entradas y salidas</p>
          <button 
            className="admin-btn" 
            onClick={() => setLogOpen(true)}
            style={styles.actionBtn}
          >
            📜 Ver Registro
          </button>
        </div>

        {/* ======================================== */}
        {/* TARJETA 6: CIERRE DE JORNADA */}
        {/* ======================================== */}
        <div className="admin-card" style={styles.cierreCard}>
          <div style={styles.cardHeader}>
            <h3>⏰ Cierre de Turno</h3>
            <span style={styles.cierreIcon}>📊</span>
          </div>
          <p style={styles.cardDescription}>Calcula ventas y genera reporte</p>
          <div style={styles.resumenVentas}>
            <span>Ventas hoy:</span>
            <strong style={styles.ventasTotal}>
              ${log
                .filter(entry => entry.tipo === 'Entrada')
                .reduce((acc, entry) => {
                  const match = entry.detalle?.match(/\$(\d+\.?\d*)/);
                  return acc + (match ? parseFloat(match[1]) : 0);
                }, 0).toFixed(2)}
            </strong>
          </div>
          <button 
            className="admin-btn" 
            style={styles.cierreBtn}
            onClick={handleCierreJornada}
          >
            📥 Finalizar Día
          </button>
        </div>
      </div>

      {/* ======================================== */}
      {/* RENDERIZADO DE DRAWERS */}
      {/* ======================================== */}
      
      {/* Drawer de edición de menú */}
      <EditMenuDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        menuItems={menuItems} 
        onSave={onSaveMenu} 
      />

      {/* Drawer de pedidos */}
      <ComandasDrawer
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        pendingOrders={pendingOrders}
        setPendingOrders={setPendingOrders}
        finishedOrders={finishedOrders}
        setFinishedOrders={setFinishedOrders}
        addLog={addLog}
        onConfirmarEntrega={handleConfirmarEntrega}
      />

      {/* Drawer de registro de logs */}
      <ArchivoDrawer 
        open={logOpen} 
        onClose={() => setLogOpen(false)} 
        log={log} 
      />

      {/* Drawer de promociones */}
      <PromosDrawer 
        open={promosOpen} 
        onClose={() => setPromosOpen(false)} 
        menuItems={menuItems} 
        onSaveMenu={onSaveMenu} 
      />
    </section>
  );
}

// ============================================
// ESTILOS INTEGRADOS (Usando variables del CSS)
// ============================================
const styles = {
  // Cards base
  cajaCard: {
    border: '2px solid var(--verde-selva)',
    background: 'linear-gradient(135deg, rgba(1, 64, 14, 0.05) 0%, rgba(255, 179, 71, 0.05) 100%)'
  },
  menuCard: {
    border: '2px solid var(--morado-primario)'
  },
  promosCard: {
    border: '2px solid var(--mango)'
  },
  ordersCard: {
    border: '2px solid var(--maracuya)'
  },
  logCard: {
    border: '2px solid var(--gris-secundario)'
  },
  cierreCard: {
    border: '2px dashed var(--rojo-cierre)',
    background: 'rgba(239, 83, 80, 0.05)'
  },

  // Elementos comunes
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  cardDescription: {
    color: 'var(--gris-secundario)',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    lineHeight: 1.4
  },
  actionBtn: {
    width: '100%',
    marginTop: '0.5rem'
  },

  // Caja rápida
  totalDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    marginBottom: '1rem',
    border: '2px solid var(--borde-tropical)'
  },
  totalLabel: {
    color: 'var(--gris-texto)',
    fontWeight: '600'
  },
  totalAmount: {
    color: 'var(--verde-selva)',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  badgeCounter: {
    background: 'var(--verde-selva)',
    color: 'white',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  pedidosBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--crema-tropical)',
    color: 'var(--verde-selva)',
    border: '2px solid var(--borde-tropical)',
    marginTop: '1rem'
  },
  chevron: {
    fontSize: '0.8rem'
  },
  pendingList: {
    marginTop: '1rem',
    maxHeight: '200px',
    overflowY: 'auto',
    borderRadius: '8px',
    border: '1px solid var(--borde-tropical)'
  },
  pendingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem',
    borderBottom: '1px solid var(--borde-tropical)',
    background: 'white'
  },
  pendingInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  pendingNumber: {
    fontWeight: 'bold',
    color: 'var(--verde-selva)'
  },
  pendingTotal: {
    color: 'var(--maracuya)',
    fontWeight: '600'
  },
  cobrarBtn: {
    padding: '0.3rem 1rem',
    fontSize: '0.85rem'
  },

  // Contadores
  itemCount: {
    background: 'var(--morado-primario)',
    color: 'white',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  promoBadge: {
    background: 'var(--mango)',
    color: 'var(--verde-selva)',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  logCount: {
    color: 'var(--gris-secundario)',
    fontSize: '0.85rem',
    fontWeight: '600'
  },

  // Preview de pedidos
  previewOrders: {
    margin: '1rem 0',
    padding: '0.5rem',
    background: 'rgba(255, 107, 53, 0.05)',
    borderRadius: '8px'
  },
  previewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.3rem 0',
    fontSize: '0.9rem'
  },
  previewStatus: {
    color: 'var(--maracuya)',
    fontWeight: '600'
  },
  moreItems: {
    display: 'block',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'var(--gris-secundario)',
    marginTop: '0.3rem'
  },

  // Cierre de jornada
  resumenVentas: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid var(--borde-tropical)'
  },
  ventasTotal: {
    color: 'var(--rojo-cierre)',
    fontSize: '1.1rem'
  },
  cierreIcon: {
    fontSize: '1.3rem'
  },
  cierreBtn: {
    background: 'var(--rojo-cierre)',
    color: 'white',
    width: '100%',
    '&:hover': {
      background: 'var(--rojo-hover)'
    }
  }
};

// Estilos dinámicos para hover
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .admin-card {
    transition: all 0.3s ease;
  }
  
  .admin-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .pending-item:hover {
    background: var(--crema-tropical);
  }
  
  .cobrar-btn:hover {
    background: var(--verde-selva) !important;
    color: var(--mango) !important;
  }
`;
document.head.appendChild(styleSheet);
