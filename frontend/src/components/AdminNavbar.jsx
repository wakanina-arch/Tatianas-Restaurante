import React from 'react';

export default function AdminNavbar({ 
  onBack, onHome, onLogout, onDelete, onView, onAction, 
  nombreComercio, hayCambios, hojaDeTrabajo 
}) {
  return (
    <div style={S.navbar}>
      {/* 1. LADO IZQUIERDO: ← Volver */}
      <button onClick={onBack} style={S.backButton} title="Volver">
        ← <span className="hide-on-mobile">
          {hojaDeTrabajo === 'preview' ? 'Admin' : 'Panel'}
        </span>
      </button>

      {/* 2. CENTRO: 🔱 Comercio */}
      <div style={S.titleContainer} onClick={onHome}>
        <span style={S.icon}>🔱</span>
        <span style={S.title}>
          {hojaDeTrabajo === 'editor' ? 'Editor' : nombreComercio?.substring(0, 12)}
        </span>
      </div>

      {/* 3. LADO DERECHO: BOTONES FIJOS */}
      <div style={S.actionsContainer}>
        {/* 🚪 Cerrar Sesión */}
        <button onClick={onLogout} style={S.iconButton} title="Cerrar Sesión">
          🚪
        </button>
        
        {/* 🗑️ Descartar */}
        <button 
          onClick={onDelete} 
          style={{
            ...S.iconButton,
            opacity: hayCambios ? 1 : 0.5,
            cursor: hayCambios ? 'pointer' : 'not-allowed',
            border: hayCambios ? '1px solid rgba(230, 57, 70, 0.5)' : '1px solid rgba(255, 215, 0, 0.2)',
            color: hayCambios ? '#ff6b6b' : '#FFD700',
          }} 
          title={hayCambios ? "Descartar cambios" : "Sin cambios pendientes"}
          disabled={!hayCambios}
        >
          🗑️
        </button>

        {/* 👁️ Vista Previa (FIJO) */}
        <button onClick={onView} style={S.iconButton} title="Vista Previa">
          👁️
        </button>

        {/* 🚀 Publicar (FIJO) */}
        <button onClick={onAction} style={S.iconButton} title="Publicar">
          🚀
        </button>
      </div>

      <style>{`
        .show-on-mobile { display: none; }
        @media (max-width: 480px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: inline !important; }
        }
      `}</style>
    </div>
  );
}

const S = {
  navbar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '56px',
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(20, 10, 10, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
    zIndex: 100,
  },
  backButton: {
    background: 'transparent',
    border: '1px solid rgba(255, 215, 0, 0.25)',
    borderRadius: '24px',
    padding: '0.3rem 0.8rem',
    color: '#FFD700',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    transition: 'all 0.15s ease',
    minWidth: '64px',
    justifyContent: 'center',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
    padding: '0 4px',
  },
  icon: { fontSize: '1.1rem', color: '#FFD700', filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))' },
  title: { fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '0.2px', whiteSpace: 'nowrap' },
  actionsContainer: { display: 'flex', alignItems: 'center', gap: '4px' },
  iconButton: {
    background: 'transparent',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '24px',
    width: '34px', height: '34px', padding: 0,
    color: '#FFD700',
    cursor: 'pointer',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); border-color: rgba(255, 215, 0, 0.4) !important; background: rgba(255, 215, 0, 0.05) !important; }
  button:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
`;
if (typeof document !== 'undefined') document.head.appendChild(styleSheet);