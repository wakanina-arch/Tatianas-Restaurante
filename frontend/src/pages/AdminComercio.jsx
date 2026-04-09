import React, { useState, useEffect } from 'react';
import AdminPage from '../AdminPage';
import BajaComercio from './BajaComercio';

export default function AdminComercio({ comercioId, onBack, menuItems: propsMenuItems, onSaveMenu: propsOnSaveMenu }) {
  const [menuItems, setMenuItems] = useState(propsMenuItems || []);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [finishedOrders, setFinishedOrders] = useState([]);
  const [log, setLog] = useState([]);
  const [mostrarBaja, setMostrarBaja] = useState(false);

  // Sincronizar menuItems cuando cambia el prop
  useEffect(() => {
    if (propsMenuItems && propsMenuItems.length > 0) {
      setMenuItems(propsMenuItems);
    } else {
      // Cargar desde localStorage si no hay props
      const menuGuardado = localStorage.getItem(`menu_comercio_${comercioId}`);
      if (menuGuardado) {
        setMenuItems(JSON.parse(menuGuardado));
      }
    }
  }, [comercioId, propsMenuItems]);

  const handleSaveMenu = (updatedMenu) => {
    setMenuItems(updatedMenu);
    localStorage.setItem(`menu_comercio_${comercioId}`, JSON.stringify(updatedMenu));
    // También sincronizar con el callback de App si existe
    if (propsOnSaveMenu) {
      propsOnSaveMenu(updatedMenu);
    }
  };

  const addLog = (entry) => {
    setLog(prev => [...prev, { ...entry, timestamp: new Date().toISOString() }]);
  };

  // Obtener nombre del comercio
  const getNombreComercio = () => {
    try {
      const registros = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
      const comercio = registros.find(r => r.id === comercioId);
      return comercio?.nombreComercio || `Comercio ${comercioId}`;
    } catch { return `Comercio ${comercioId}`; }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>← Volver</button>
        <h1 style={styles.title}>🔱 Panel de Control</h1>
        <div style={styles.headerRight}>
          <div style={styles.comercioBadge}>Comercio ID: {comercioId}</div>
          <button onClick={() => setMostrarBaja(true)} style={styles.bajaBtn}>
            Dar de baja
          </button>
        </div>
      </div>
      
      {mostrarBaja && (
        <BajaComercio
          comercioId={comercioId}
          nombreComercio={getNombreComercio()}
          onConfirmarBaja={() => onBack()}
          onCancel={() => setMostrarBaja(false)}
        />
      )}

      <AdminPage
        comercioId={comercioId}
        menuItems={menuItems}
        onSaveMenu={handleSaveMenu}
        log={log}
        addLog={addLog}
        pendingOrders={pendingOrders}
        setPendingOrders={setPendingOrders}
        finishedOrders={finishedOrders}
        setFinishedOrders={setFinishedOrders}
        onBack={onBack}
      />
    </div>
  );
}

const styles = {
  container: { 
    minHeight: '100vh', 
    background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)' 
  },
  header: { 
    padding: '1rem', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    flexWrap: 'wrap', 
    gap: '1rem', 
    background: 'rgba(20,10,10,0.75)', 
    backdropFilter: 'blur(20px)', 
    borderBottom: '1px solid rgba(255,215,0,0.2)' 
  },
  backButton: { 
    background: 'transparent', 
    border: '1px solid rgba(255,215,0,0.3)', 
    borderRadius: '30px', 
    padding: '0.5rem 1rem', 
    color: '#FFD700', 
    cursor: 'pointer' 
  },
  title: { 
    color: '#FFD700', 
    fontSize: '1.2rem', 
    margin: 0 
  },
  comercioBadge: { 
    background: 'rgba(0,0,0,0.5)', 
    padding: '0.3rem 0.8rem', 
    borderRadius: '20px', 
    color: '#aaa', 
    fontSize: '0.7rem' 
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  bajaBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,69,0,0.3)',
    borderRadius: '20px',
    padding: '0.3rem 0.8rem',
    color: '#FF4500',
    fontSize: '0.65rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};