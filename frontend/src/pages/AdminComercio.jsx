import React from 'react';
import EditMenuDrawer from '../EditMenuDrawer';

export default function AdminComercio({ comercioId, menuItems, onSaveMenu, onBack }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>← Volver</button>
        <h1 style={styles.title}>🔱 Panel de Control</h1>
        <div style={styles.comercioBadge}>Comercio ID: {comercioId}</div>
      </div>
      <EditMenuDrawer
        open={true}
        onClose={onBack}
        menuItems={menuItems}
        onSave={onSaveMenu}
      />
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)' },
  header: { padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'rgba(20,10,10,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,215,0,0.2)' },
  backButton: { background: 'transparent', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '30px', padding: '0.5rem 1rem', color: '#FFD700', cursor: 'pointer' },
  title: { color: '#FFD700', fontSize: '1.2rem', margin: 0 },
  comercioBadge: { background: 'rgba(0,0,0,0.5)', padding: '0.3rem 0.8rem', borderRadius: '20px', color: '#aaa', fontSize: '0.7rem' },
};