import React, { useState } from 'react';
import QuickCheckout from './QuickCheckout';
import EditMenuDrawer from './EditMenuDrawer';
import OrdersDrawer from './OrdersDrawer';
import OrdersLogDrawer from './OrdersLogDrawer';
import ManageItemsDrawer from './ManageItemsDrawer'; 
import './EditMenuDrawer.css';

export default function AdminPage({ menuItems, onSaveMenu, log, addLog, pendingOrders, setPendingOrders, finishedOrders, setFinishedOrders }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false); 

  const total = finishedOrders.reduce((acc, order) => acc + (order.total || 0), 0);

  // --- FUNCIÓN DE PAGO ---
  const handlePayment = (e) => {
    e.preventDefault();
    if (total === 0) return alert("No hay pedidos para cobrar");
    
    addLog({
      tipo: 'Salida',
      pedido: 'PAGO-CAJA', 
      usuario: 'Administrador',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detalle: `Cobro de caja realizado por $${total.toFixed(2)}`
    });

    setFinishedOrders([]); 
    alert("Pago registrado con éxito");
    setLogOpen(true);
  }

  // --- 📊 FUNCIÓN DE CIERRE DE JORNADA (LA QUE FALTABA) ---
  const handleCierreJornada = () => {
    const ventasTotales = log
      .filter(entry => entry.tipo === 'Entrada')
      .reduce((acc, entry) => {
        const match = entry.detalle.match(/\$(\d+\.?\d*)/);
        return acc + (match ? parseFloat(match[1]) : 0);
      }, 0);

    if (window.confirm(`📊 CIERRE DE CAJA\n------------------\nVentas Totales: $${ventasTotales.toFixed(2)}\nPedidos Procesados: ${log.length}\n\n¿Deseas descargar el reporte de auditoría?`)) {
      
      const textoReporte = log.map(e => 
        `[${e.hora}] ${e.tipo} | Pedido: ${e.pedido} | Cliente: ${e.usuario} | Info: ${e.detalle}`
      ).join('\n');

      const blob = new Blob([`*** REPORTE DE VENTAS - ONE TO ONE ***\nFecha: ${new Date().toLocaleDateString()}\nTotal Caja: $${ventasTotales.toFixed(2)}\n\nMOVIMIENTOS:\n${textoReporte}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cierre_Caja_${new Date().toISOString().slice(0,10)}.txt`;
      link.click();
    }
  };
  
  return (
    <section className="admin-page">
      <h2>Dashboard del Restaurante</h2>
      <div className="admin-container">
        {/* 1. CAJA RÁPIDA - BOTÓN Y LISTA DE PEDIDOS */}
        <div className="admin-card" style={{ minWidth: 320 }}>
          <h3>Caja Rápida</h3>
          {/* Texto eliminado para ganar espacio */}
          <button
            className="admin-btn"
            style={{
              background: finishedOrders.length > 0 ? '#28a745' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              width: '100%',
              fontWeight: 700,
              fontSize: '1.08rem',
              marginBottom: 12,
              transition: 'background 0.3s',
              boxShadow: finishedOrders.length > 0 ? '0 0 12px #28a74555' : undefined
            }}
            onClick={() => setOrdersOpen(o => !o)}
            disabled={finishedOrders.length === 0}
          >
            {finishedOrders.length === 0
              ? ''
              : `${finishedOrders.length} pendiente${finishedOrders.length > 1 ? 's' : ''}`}
          </button>
          {/* Checkout QR y manual */}
          <QuickCheckout finishedOrders={finishedOrders} setFinishedOrders={setFinishedOrders} addLog={addLog} />
          {ordersOpen && pendingOrders.length > 0 && (
            <div style={{maxHeight: 320, overflowY: 'auto', marginBottom: 8, marginTop: 8}}>
              <table style={{width:'100%', fontSize:'0.98rem', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f8f9fa'}}>
                    <th style={{textAlign:'left', padding:'6px 4px'}}>Orden</th>
                    <th style={{textAlign:'center', padding:'6px 4px'}}>Estado</th>
                    <th style={{textAlign:'center', padding:'6px 4px'}}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order, idx) => (
                    <tr key={order.id || idx} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'6px 4px'}}>#{order.numero || order.id || idx+1}</td>
                      <td style={{textAlign:'center', color:'#e67e22', fontWeight:600}}>
                        Pendiente
                      </td>
                      <td style={{textAlign:'center'}}>
                        <button className="admin-btn" style={{background:'#28a745', color:'#fff', padding:'0.3rem 0.8rem', fontSize:'0.98rem'}}
                          onClick={() => {
                            setPendingOrders(pendingOrders.filter((_, i) => i !== idx));
                            setFinishedOrders([...finishedOrders, {...order, entregado: true, horaEntrega: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]);
                          }}
                        >
                          Entrega confirmada
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Texto de registro eliminado por solicitud */}
        </div>

        {/* 2. MENÚ */}
        <div className='admin-card'>
          <h3>Actualizar Menú del Día</h3>
          <p>Gestiona precios y platos disponibles</p>
          <button className="admin-btn" onClick={() => setDrawerOpen(true)}>Editar Menú</button>
        </div>
       
        {/* 3. COMANDAS */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Ver Comandas</h3>
            {pendingOrders.length > 0 && (
              <span className="notification-badge">{pendingOrders.length}</span>
            )}
          </div>
          <p>Visualiza pedidos en tiempo real</p>
          <button className="admin-btn" onClick={() => setOrdersOpen(true)}>Ver Pedidos</button>
        </div>

        {/* 4. REGISTRO */}
        <div className="admin-card">
          <h3>Registro de Control</h3>
          <p>Entradas y salidas de pedidos</p>
          <button className="admin-btn" onClick={() => setLogOpen(true)}>Ver Registro</button>
        </div>

        {/* 5. GESTIONAR ÍTEMS */}
        <div className="admin-card">
          <h3>Gestionar Ítems</h3>
          <p>Añadir o quitar platillos del menú</p>
          <button className="admin-btn" onClick={() => setManageOpen(true)}>Gestionar</button>
        </div>

        {/* 6. CIERRE DE JORNADA (NUEVA CARD) */}
        <div className="admin-card" style={{ border: '2px dashed #ef5350', background: 'rgba(239, 83, 80, 0.05)' }}>
          <h3>Cierre de Turno</h3>
          <p>Calcula ventas y descarga el reporte</p>
          <button className="admin-btn" style={{ background: '#ef5350' }} onClick={handleCierreJornada}>
            Finalizar Día 📊
          </button>
        </div>
      </div>

      {/* RENDERIZADO DE DRAWERS */}
      <EditMenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} menuItems={menuItems} onSave={onSaveMenu} />
      
      <OrdersDrawer
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        pendingOrders={pendingOrders}
        setPendingOrders={setPendingOrders}
        finishedOrders={finishedOrders}
        setFinishedOrders={setFinishedOrders}
        addLog={addLog}
      />

      <OrdersLogDrawer open={logOpen} onClose={() => setLogOpen(false)} log={log} />

      <ManageItemsDrawer 
        open={manageOpen} 
        onClose={() => setManageOpen(false)} 
        menuItems={menuItems} 
        onSaveMenu={onSaveMenu} 
      />
    </section>
  );
}
