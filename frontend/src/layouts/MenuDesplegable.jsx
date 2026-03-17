import React from 'react';

export default function MenuDesplegable({ abierto, onClose, onSelectCategoria }) {
  if (!abierto) return null;

  const categorias = [
    { id: 'Primero', label: 'PRIMEROS', icono: '🍖', elemento: 'fuego' },
    { id: 'Segundo', label: 'SEGUNDOS', icono: '🥘', elemento: 'tierra' },
    { id: 'Postre', label: 'BEBIDAS', icono: '🍵', elemento: 'agua' },
    { id: 'Otras', label: 'OTRAS', icono: '🔥', elemento: 'metal' },
    { id: 'welcome', label: 'ORIGEN', icono: '✨', elemento: 'aire' },
  ];

  const getColorElemento = (elemento) => {
    switch(elemento) {
      case 'fuego': return '#FF4500';
      case 'tierra': return '#CD7F32';
      case 'agua': return '#4169E1';
      case 'metal': return '#FFD700';
      case 'aire': return '#139673';
      default: return '#FFD700';
    }
  };
  
  const handleClick = (cat) => {
    console.log('🎯 Categoría seleccionada:', cat);
    
    if (cat.id === 'welcome') {
      onSelectCategoria(null, true);
    } else {
      onSelectCategoria(cat.id, false);
    }
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.menu} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.titulo}>PALACIO INTERIOR</h3>
          <div style={styles.lineaDecorativa} />
        </div>
        
        {categorias.map(cat => (
          <button
            key={cat.id || 'todas'}
            onClick={() => handleClick(cat)}
            style={styles.boton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${cat.elemento === 'fuego' ? '255,69,0' : cat.elemento === 'agua' ? '65,105,225' : '255,215,0'}, 0.1)`;
              e.currentTarget.style.paddingLeft = "1.6rem";
              e.currentTarget.style.borderLeft = `3px solid ${getColorElemento(cat.elemento)}`;
              e.currentTarget.style.backdropFilter = 'blur(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.paddingLeft = "1.2rem";
              e.currentTarget.style.borderLeft = "3px solid transparent";
              e.currentTarget.style.backdropFilter = 'none';
            }}
          >
            <span style={{ 
              fontSize: "1.4rem",
              filter: `drop-shadow(0 2px 8px ${getColorElemento(cat.elemento)}40)`
            }}>
              {cat.icono}
            </span>
            <span style={styles.label}>{cat.label}</span>
            <span style={styles.elementoTag}>{cat.elemento}</span>
          </button>
        ))}

        <div style={styles.footer}>
          <p style={styles.frase}>"El camino se hace al andar"</p>
          <div style={styles.cincoElementos}>
            <span style={styles.elementoIcon}>🔥</span>
            <span style={styles.elementoIcon}>⛰️</span>
            <span style={styles.elementoIcon}>💧</span>
            <span style={styles.elementoIcon}>⚡</span>
            <span style={styles.elementoIcon}>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 98,
    background: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "all 0.3s ease"
  },
  menu: {
    position: "fixed",
    top: "80px",
    left: "15px",
    width: "280px",
    background: "rgba(18, 12, 12, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px", // iPhone style
    padding: "1.5rem 0.8rem",
    border: "1px solid rgba(255, 215, 0, 0.2)",
    borderTop: "2px solid rgba(255, 215, 0, 0.5)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.1) inset",
    zIndex: 999
  },
  header: {
    marginBottom: "1.2rem",
    textAlign: "center"
  },
  titulo: {
    color: "#FFD700",
    fontSize: "1rem",
    letterSpacing: "4px",
    marginBottom: "0.5rem",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "600",
    textShadow: "0 2px 4px rgba(255, 215, 0, 0.2)"
  },
  lineaDecorativa: {
    height: "1px",
    width: "60px",
    margin: "0 auto",
    background: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent)"
  },
  boton: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    padding: "0.8rem 1.2rem",
    marginBottom: "0.2rem",
    background: "transparent",
    border: "none",
    borderLeft: "3px solid transparent",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Cormorant Garamond', serif",
    borderRadius: "12px" // Unificado
  },
  label: {
    flex: 1,
    textAlign: "left",
    fontWeight: "500",
    letterSpacing: "1px"
  },
  elementoTag: {
    fontSize: "0.55rem",
    color: "rgba(255, 215, 0, 0.5)",
    fontStyle: "italic",
    marginRight: "0.3rem",
    textTransform: "uppercase"
  },
  footer: {
    marginTop: "1rem",
    textAlign: "center",
    borderTop: "1px solid rgba(255, 215, 0, 0.1)",
    paddingTop: "1rem"
  },
  frase: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: "0.7rem",
    fontStyle: "italic",
    marginBottom: "0.5rem",
    letterSpacing: "0.5px"
  },
  cincoElementos: {
    display: "flex",
    justifyContent: "center",
    gap: "0.8rem",
    fontSize: "0.9rem",
    opacity: 0.4
  },
  elementoIcon: {
    filter: "drop-shadow(0 2px 4px rgba(255, 215, 0, 0.2))",
    transition: "all 0.2s ease"
  }
};