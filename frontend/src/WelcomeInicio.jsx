import React, { useState, useEffect } from 'react';

// FRASES DEL ORÁCULO
const FRASES_ORACULO = [
  { elemento: 'fuego', icono: '🔥', frases: ["La llama que te consume también puede iluminar tu camino."] },
  { elemento: 'agua', icono: '💧', frases: ["Como el agua, encuentra tu camino entre las piedras."] },
  { elemento: 'aire', icono: '🌬️', frases: ["El viento no retiene, solo lleva. Suelta lo que no es tuyo."] },
  { elemento: 'tierra', icono: '⛰️', frases: ["El barro espera paciente a que lo moldees."] },
  { elemento: 'espiritu', icono: '✨', frases: ["El héroe no nace, se forja en su propio fuego."] }
];

const getFraseAleatoria = () => {
  const elementoIndex = Math.floor(Math.random() * FRASES_ORACULO.length);
  const elementoData = FRASES_ORACULO[elementoIndex];
  const fraseIndex = Math.floor(Math.random() * elementoData.frases.length);
  return {
    texto: elementoData.frases[fraseIndex],
    elemento: elementoData.elemento,
    icono: elementoData.icono
  };
};

const COMERCIOS_FIJOS = [
  { id: 1, nombre: "En su punto", imagen: "/casas/en_su_punto.JPG" },
  { id: 2, nombre: "Ceremoniales", imagen: "/casas/Ceremoniales.JPG" },
  { id: 3, nombre: "Como en casa", imagen: "/casas/Como_en_casa.JPG" },
  { id: 4, nombre: "Gusto", imagen: "/casas/IMG_4552.JPG" },
  { id: 5, nombre: "Candela Obscura", imagen: "/casas/IMG_4555.JPG" },
  { id: 6, nombre: "Kattapa", imagen: "/casas/Kattapa.JPG" },
  { id: 7, nombre: "Llap Grill", imagen: "/casas/Llap_Grill.JPG" },
  { id: 8, nombre: "Pollo a la leña", imagen: "/casas/Pollo_a_la_leña.JPG" },
  { id: 9, nombre: "Tradicional", imagen: "/casas/Tradicional.JPG" },
];

export default function WelcomeInicio({ onSelectCategory, onAccesoComercio, onRegistroComercio, currentPage, comercioSimple }) {
  const [fraseData] = useState(() => getFraseAleatoria());
  const [comerciosRegistrados, setComerciosRegistrados] = useState([]);

  useEffect(() => {
    localStorage.setItem('fraseOraculo', JSON.stringify({
      texto: fraseData.texto,
      elemento: fraseData.elemento,
      icono: fraseData.icono
    }));
  }, [fraseData]);

  useEffect(() => {
    try {
      const registros = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
      setComerciosRegistrados(registros);
    } catch (e) {
      console.error('Error cargando comercios registrados:', e);
    }
  }, [currentPage]);

  // Combinar comercios con keys ÚNICAS garantizadas
  const todosLosComercios = [
    ...COMERCIOS_FIJOS.map(c => ({ ...c, tipo: 'fijo' })),
    ...comerciosRegistrados.map(r => ({
      id: r.id,
      nombre: r.nombre,
      imagen: r.imagen || r.logo,
      tipo: 'registrado'
    })),
    ...(comercioSimple ? [{ ...comercioSimple, tipo: 'simple' }] : []),
  ];

  const handleComercioClick = (comercio) => {
    console.log('Comercio seleccionado:', comercio.nombre);
    onSelectCategory('Picoteo', comercio.id);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div 
          style={styles.moneda} 
          onClick={() => onAccesoComercio && onAccesoComercio()}
          title="Acceso a comercios"
        >
          🔱
        </div>

        <h1 style={styles.titulo}>
          <span style={styles.one}>ONE</span>{' '}
          <span style={styles.to}>TO</span>{' '}
          <span style={styles.oneEnd}>ONE</span>
        </h1>

        <div style={styles.fraseContainer}>
          <span style={styles.fraseIcono}>{fraseData.icono}</span>
          <p style={styles.fraseTexto}>"{fraseData.texto}"</p>
        </div>
      </div>

      <div style={styles.comerciosContainer}>
        {todosLosComercios.map((comercio, index) => {
          // ✅ KEY ÚNICA GARANTIZADA
          const uniqueKey = `${comercio.tipo}-${comercio.id}-${index}`;
          
          return (
            <div
              key={uniqueKey}
              style={styles.comercioCard}
              onClick={() => handleComercioClick(comercio)}
            >
              <img
                src={comercio.imagen}
                alt={comercio.nombre}
                style={styles.comercioImagen}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x280/2a0a0a/FFD700?text=' + encodeURIComponent(comercio.nombre || 'Comercio');
                }}
              />
              
            </div>
          );
        })}
      </div>

      {onRegistroComercio && (
        <div style={styles.registroBtnContainer}>
          <button onClick={onRegistroComercio} style={styles.registroBtn}>
            🏪 Inscribir mi comercio
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)',
    overflowY: 'auto',
    position: 'relative',
  },
  hero: {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: 'rgba(20, 10, 10, 0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  padding: '12px 16px',        // ← Reducido de 20px 16px
  borderBottom: '1px solid rgba(255,215,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',                  // ← Reducido de 12px
},
  moneda: {
    fontSize: '1.7rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'flotar 3s ease-in-out infinite, pulso 2s ease-in-out infinite',
    textShadow: '0 0 5px rgba(255,215,0,0.5)',
    display: 'inline-block',
  },
  titulo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    margin: 0,
  },
  one: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#B22222',
    textShadow: '0 0 5px rgba(178,34,34,0.5)',
    animation: 'brilloRojo 2.5s infinite alternate',
  },
  to: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a3b1a',
    textShadow: '0 0 5px rgba(26,59,26,0.5)',
    animation: 'brilloVerde 2.5s infinite alternate',
  },
  oneEnd: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#FFD700',
    textShadow: '0 0 5px rgba(255,215,0,0.5)',
    animation: 'brilloDorado 2.5s infinite alternate',
  },
  fraseContainer: {
    textAlign: 'center',
    padding: '0 15px',
  },
  fraseIcono: {
    fontSize: '1rem',
    display: 'block',
    marginBottom: '2px',
  },
  fraseTexto: {
    color: '#FFD700',
    fontSize: '0.65rem',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.3,
  },
  comerciosContainer: {
    padding: '16px 12px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  comercioCard: {
    position: 'relative',
    width: '100%',
    height: '240px',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s ease',
  },
  comercioImagen: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  registroBtnContainer: {
    padding: '0 16px 2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  registroBtn: {
    padding: '0.7rem 1.8rem',
    background: 'transparent',
    border: '1px solid rgba(255,215,0,0.4)',
    borderRadius: '30px',
    color: '#FFD700',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes flotar {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0px); }
  }
  @keyframes pulso {
    0%, 100% { text-shadow: 0 0 0px rgba(255,215,0,0); }
    50% { text-shadow: 0 0 12px rgba(255,215,0,0.8); }
  }
  @keyframes brilloRojo {
    0% { text-shadow: 0 0 2px rgba(178,34,34,0.3); }
    100% { text-shadow: 0 0 12px rgba(178,34,34,0.8); }
  }
  @keyframes brilloVerde {
    0% { text-shadow: 0 0 2px rgba(26,59,26,0.3); }
    100% { text-shadow: 0 0 12px rgba(26,59,26,0.8); }
  }
  @keyframes brilloDorado {
    0% { text-shadow: 0 0 2px rgba(255,215,0,0.3); }
    100% { text-shadow: 0 0 12px rgba(255,215,0,0.8); }
  }
  .comercio-card:hover {
    transform: scale(1.02);
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}