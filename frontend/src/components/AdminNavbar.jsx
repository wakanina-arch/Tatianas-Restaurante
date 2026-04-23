import React, { useState } from 'react';
import ContratoModal from './ContratoModal';

export default function AdminNavbar({ 
  onBack, onHome, onLogout, onDelete, onView, onAction, 
  nombreComercio, hayCambios, hojaDeTrabajo 
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showContrato, setShowContrato] = useState(false);

  // Cerrar dropdown al hacer clic fuera
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };

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
        
        {/* 🚪 BOTÓN MULTISERVICIO CON DROPDOWN */}
        <div style={{ position: 'relative' }} onBlur={handleBlur} tabIndex={-1}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)} 
            style={S.iconButton} 
            title="Más opciones"
          >
            🚪
          </button>

          {showDropdown && (
            <div style={S.dropdown}>
              <button 
                onClick={() => { onLogout(); setShowDropdown(false); }} 
                style={S.dropdownItem}
              >
                🚪 Cerrar Sesión
              </button>
              <button 
                onClick={() => { 
                  setShowContrato(true);
                  setShowDropdown(false);
                }} 
                style={S.dropdownItem}
              >
                📜 Contrato de Suscripción
              </button>
              <button 
                onClick={() => setShowDropdown(false)} 
                style={S.dropdownItem}
                title="Cerrar menú"
              >
                ✕ Cerrar
              </button>
            </div>
          )}
          
        </div>
        
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
      <ContratoModal 
  open={showContrato} 
  onClose={() => setShowContrato(false)} 
/>
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
  icon: {
    fontSize: '1.1rem',
    color: '#FFD700',
    filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))',
  },
  title: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: '0.2px',
    whiteSpace: 'nowrap',
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
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
  dropdown: {
    position: 'absolute',
    top: '44px',
    right: 0,
    background: 'rgba(20, 10, 10, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '230px',
    zIndex: 200,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  },
  dropdownItem: {
    background: 'transparent',
    border: 'none',
    color: '#FFD700',
    padding: '10px 14px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
    borderRadius: '10px',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
};

// Estilos hover
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 4px 12px rgba(255, 215, 0, 0.3);
    transition: all 0.2s ease;
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  .dropdown-item:hover {
    background: rgba(255, 215, 0, 0.1) !important;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}