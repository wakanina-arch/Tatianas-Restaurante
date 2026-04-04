import React, { useState, useEffect } from 'react';
import RegisterModal from './components/RegisterModal';

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

// COMERCIOS desde la carpeta /casas
const COMERCIOS = [
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

export default function WelcomeInicio({ onSelectCategory, usuario, onAbrirRegistro }) {
  const [showRegister, setShowRegister] = useState(false);
  const [fraseData] = useState(() => getFraseAleatoria());

  useEffect(() => {
    localStorage.setItem('fraseOraculo', JSON.stringify({
      texto: fraseData.texto,
      elemento: fraseData.elemento,
      icono: fraseData.icono
    }));
  }, [fraseData]);

  const handleComercioClick = (comercio) => {
  console.log('Comercio seleccionado:', comercio.nombre);
  onSelectCategory('Primero', comercio.id);  // ← pasamos el id del comercio
};

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.headerRow}>
          <span style={styles.suscripcionTexto}>Suscripción</span>
            <div style={styles.moneda} onClick={() => setShowRegister(true)}>
              🔱
            </div>
            <span style={styles.opcionalTexto}>Opcional</span>
          </div>
        <h1 style={styles.titulo}>
          <div style={{
  textAlign: 'center',
  fontSize: '1.6rem',
  margin: '0 0 8px 0',
  fontFamily: "'Cormorant Garamond', serif",
  letterSpacing: '4px',
  fontWeight: 300,
}}>
  <span style={{
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#B22222',  // rojo místico
    textShadow: '0 0 5px rgba(178,34,34,0.5), 0 0 10px rgba(178,34,34,0.3)',
    animation: 'brilloRojo 2.5s infinite alternate',
  }}>ONE</span>{' '}
  <span style={{
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1a3b1a',  // verde selva
    textShadow: '0 0 5px rgba(26,59,26,0.5), 0 0 10px rgba(26,59,26,0.3)',
    animation: 'brilloVerde 2.5s infinite alternate',
  }}>TO</span>{' '}
  <span style={{
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#FFD700',  // dorado
    textShadow: '0 0 5px rgba(255,215,0,0.5), 0 0 10px rgba(255,215,0,0.3)',
    animation: 'brilloDorado 2.5s infinite alternate',
  }}>ONE</span>
</div>
        </h1>
        <div style={styles.fraseContainer}>
          <span style={styles.fraseIcono}>{fraseData.icono}</span>
          <p style={styles.fraseTexto}>"{fraseData.texto}"</p>
        </div>
      </div>

      <div style={styles.comerciosContainer}>
        {COMERCIOS.map((comercio) => (
          <div
            key={comercio.id}
            style={styles.comercioCard}
            onClick={() => handleComercioClick(comercio)}
          >
            <img
              src={comercio.imagen}
              alt={comercio.nombre}
              style={styles.comercioImagen}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x280?text=Comercio';
              }}
            />
          </div>
        ))}
      </div>

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={(u) => {
          localStorage.setItem('oneToOneUser', JSON.stringify(u));
          window.location.reload();
        }}
      />
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
    padding: '15px 20px',
    borderBottom: '1px solid rgba(255,215,0,0.2)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  suscripcionTexto: {
    color: '#FFD700',
    fontSize: '0.7rem',
    fontWeight: '500',
    opacity: 0.8,
    textAlign: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  moneda: {
  fontSize: '2rem',           // ← un poco más grande
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: 'flotar 3s ease-in-out infinite, pulso 2s ease-in-out infinite',
  textShadow: '0 0 5px rgba(255,215,0,0.5)',
  '&:hover': {
    transform: 'scale(1.1)',
    textShadow: '0 0 15px rgba(255,215,0,0.8)',
  }
},
  opcionalTexto: {
    color: '#FFD700',
    fontSize: '0.65rem',
    opacity: 0.6,
    textAlign: 'center',
  },
  titulo: {
    textAlign: 'center',
    fontSize: '1.4rem',
    margin: '0 0 8px 0',
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: '3px',
    fontWeight: 300,
  },
  fraseContainer: {
    textAlign: 'center',
    padding: '0 15px',
  },
  fraseIcono: {
    fontSize: '1.3rem',
    display: 'block',
    marginBottom: '4px',
  },
  fraseTexto: {
    color: '#FFD700',
    fontSize: '0.7rem',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.4,
  },
  comerciosContainer: {
    padding: '20px 16px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  comercioCard: {
    width: '100%',
    height: '280px',
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
};

// Añadir animación
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes flotar {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0px); }
  }
  .comercio-card:hover {
    transform: scale(1.02);
  }
    @keyframes pulso {
  0%, 100% { text-shadow: 0 0 0px rgba(255,215,0,0); }
  50% { text-shadow: 0 0 12px rgba(255,215,0,0.8); }
}
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}