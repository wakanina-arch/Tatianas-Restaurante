import React, { useState } from 'react';
import EditMenuDrawer from './EditMenuDrawer';
import OrdersDrawer from './OrdersDrawer';
import OrdersLogDrawer from './OrdersLogDrawer';
import './EditMenuDrawer.css';


export default function AdminPage({ menuItems, onSaveMenu, log, addLog, pendingOrders, setPendingOrders, finishedOrders, setFinishedOrders }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  // Recibir props de pedidos globales
  // Se pasan desde App.jsx/MainApp
  // (pendingOrders, finishedOrders, setPendingOrders, setFinishedOrders)
  // Se agregan como props a OrdersDrawer

  return (
    <section className="admin-page">
      <h2>Dashboard del Restaurante</h2>
      <div className="admin-container">
        <div className="admin-card">
          <h3>Actualizar Menú del Día</h3>
          <p>Gestiona precios y platos disponibles</p>
          <button className="admin-btn" onClick={() => setDrawerOpen(true)}>Editar Menú</button>
        </div>
        <div className="admin-card">
          <h3>Ver Comandas</h3>
          <p>Visualiza pedidos en tiempo real</p>
          <button className="admin-btn" onClick={() => setOrdersOpen(true)}>Ver Pedidos</button>
        </div>
        <div className="admin-card">
          <h3>Registro de Control</h3>
          <p>Entradas y salidas de pedidos</p>
          <button className="admin-btn" onClick={() => setLogOpen(true)}>Ver Registro</button>
        </div>
        <div className="admin-card">
          <h3>Gestionar Ítems</h3>
          <p>Crear y editar platillos del restaurante</p>
          <button className="admin-btn">Gestionar</button>
        </div>
      </div>
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
    </section>
  );
}
