import React from 'react';

export default function MenuDesplegable({ abierto, onClose, onSelectCategoria }) {
  if (!abierto) return null;

  const categorias = [
    { id: 'primero', label: 'PRIMEROS', icono: '🍖', elemento: 'fuego' },
    { id: 'segundo', label: 'SEGUNDOS', icono: '🥘', elemento: 'tierra' },
    { id: 'postres', label: 'BEBIDAS', icono: '🍵', elemento: 'agua' },
    { id: 'otras', label: 'OTRAS', icono: '🔥', elemento: 'metal' },
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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.menu} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.titulo}>PALACIO INTERIOR</h3>
          <div style={styles.lineaDecorativa} />
        </div>
        
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => { 
              onSelectCategoria(cat.id);
              onClose(); 
            }}
            style={styles.boton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${cat.elemento === 'fuego' ? '255,69,0' : cat.elemento === 'agua' ? '65,105,225' : '255,215,0'}, 0.15)`;
              e.currentTarget.style.paddingLeft = "1.8rem";
              e.currentTarget.style.borderLeft = `3px solid ${getColorElemento(cat.elemento)}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.paddingLeft = "1.2rem";
              e.currentTarget.style.borderLeft = "3px solid transparent";
            }}
          >
            <span style={{ 
              fontSize: "1.5rem",
              filter: `drop-shadow(0 0 5px ${getColorElemento(cat.elemento)})`
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
            <span>🔥</span><span>⛰️</span><span>💧</span><span>⚡</span><span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 98, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)"
  },
  menu: {
    position: "fixed", top: "80px", left: "15px", width: "280px",
    background: "rgba(18, 12, 12, 0.98)", backdropFilter: "blur(20px)",
    borderRadius: "0 25px 25px 25px", padding: "1.5rem 0.8rem",
    border: "2px solid rgba(255,215,0,0.3)", borderTop: "4px solid #FFD700",
    boxShadow: "15px 15px 30px rgba(0,0,0,0.6)", zIndex: 999
  },
  header: { marginBottom: "1.5rem", textAlign: "center" },
  titulo: {
    color: "#FFD700", fontSize: "1rem", letterSpacing: "3px",
    marginBottom: "0.5rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: "600"
  },
  lineaDecorativa: {
    height: "2px", width: "80px", margin: "0 auto",
    background: "linear-gradient(90deg, transparent, #FFD700, transparent)"
  },
  boton: {
    display: "flex", alignItems: "center", gap: "1rem", width: "100%",
    padding: "0.9rem 1.2rem", marginBottom: "0.3rem", background: "transparent",
    border: "none", borderLeft: "3px solid transparent", color: "white",
    fontSize: "1rem", cursor: "pointer", transition: "all 0.3s ease",
    fontFamily: "'Cormorant Garamond', serif"
  },
  label: { flex: 1, textAlign: "left", fontWeight: "500", letterSpacing: "1px" },
  elementoTag: {
    fontSize: "0.55rem", color: "rgba(255,215,0,0.6)",
    fontStyle: "italic", marginRight: "0.5rem"
  },
  // ⚡ Estilo del nuevo botón de salida
  botonSalida: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    width: "100%", padding: "1rem", marginTop: "1rem", background: "rgba(255,215,0,0.05)",
    border: "none", borderRadius: "15px", color: "rgba(255,215,0,0.8)",
    fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "700", letterSpacing: "2px", transition: "all 0.3s ease"
  },
  footer: {
    marginTop: "1rem", textAlign: "center",
    borderTop: "1px solid rgba(255,215,0,0.1)", paddingTop: "1rem"
  },
  frase: {
    color: "rgba(255,255,255,0.4)", fontSize: "0.7rem",
    fontStyle: "italic", marginBottom: "0.5rem"
  },
  cincoElementos: {
    display: "flex", justifyContent: "center", gap: "0.8rem",
    fontSize: "1rem", opacity: 0.5
  }
};
