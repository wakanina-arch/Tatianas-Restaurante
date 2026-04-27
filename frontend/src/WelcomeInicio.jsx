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
  { id: 1, nombre: "ONO TO ONE", imagen: "/casas/en_su_punto.JPG" },
  { id: 2, nombre: "Sabores del Origen", imagen: "/casas/Ceremoniales.JPG" },
  { id: 3, nombre: "Sierra y Fuego", imagen: "/casas/Como_en_casa.JPG" },
  { id: 4, nombre: "En su punto", imagen: "/casas/IMG_4552.JPG" },
  { id: 5, nombre: "Candela Obscura", imagen: "/casas/IMG_4555.JPG" },
  { id: 6, nombre: "Kattapa", imagen: "/casas/Kattapa.JPG" },
  { id: 7, nombre: "Llap Grill", imagen: "/casas/Llap_Grill.JPG" },
  { id: 8, nombre: "Pollo a la leña", imagen: "/casas/Pollo_a_la_leña.JPG" },
  { id: 9, nombre: "Tradicional", imagen: "/casas/Tradicional.JPG" },
];

export default function WelcomeInicio({ onSelectCategory, onAccesoComercio, onRegistroComercio, currentPage, comercioSimple }) {
  const [fraseData] = useState(() => getFraseAleatoria());
  const [comerciosRegistrados, setComerciosRegistrados] = useState([]);
  const [modalComercio, setModalComercio] = useState(null);

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

  const todosLosComerciosRaw = [
    ...COMERCIOS_FIJOS.map(c => ({ ...c, tipo: 'fijo' })),
    ...comerciosRegistrados.map(r => ({
      id: r.id,
      nombre: r.nombre,
      imagen: r.imagen || r.logo,
      tipo: 'registrado'
    })),
    ...(comercioSimple ? [{ ...comercioSimple, tipo: 'simple' }] : []),
  ];

  // FILTRAR DUPLICADOS POR ID
  const todosLosComercios = todosLosComerciosRaw.filter((comercio, index, self) =>
    index === self.findIndex((t) => t.id === comercio.id)
  );

  const handleComercioClick = (comercio) => {
    // IDs 1, 2, 3 = Demos activas → Abrir normalmente
    if (comercio.id === 1 || comercio.id === 2 || comercio.id === 3) {
      onSelectCategory('Picoteo', comercio.id);
      return;
    }
    
    // IDs 4+ = Comercios no disponibles → Modal personalizado
    const mensajes = [
      `🏪 ¡Este local está buscando dueño!\n\n"${comercio.nombre}" podría ser tu próximo gran éxito.\n\nPróximamente disponible en ONE TO ONE.`,
      `🍳 ¡Aquí huele a oportunidad!\n\n"${comercio.nombre}" está esperando a que alguien como tú le dé vida.\n\nMuy pronto en nuestra plataforma.`,
      `🔥 ¡Alerta de negocio vacante!\n\n"${comercio.nombre}" necesita un chef como tú.\n\nEspacio reservado para futuros socios.`
    ];
    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
    setModalComercio({ nombre: comercio.nombre, mensaje });
  };

  return (
    <div style={S.container}>
      <div style={S.hero}>
        <div
          style={S.moneda}
          onClick={() => onAccesoComercio && onAccesoComercio()}
          title="Acceso a comercios"
        >
          🔱
        </div>

        <h1 style={S.titulo}>
          <span style={S.one}>ONE</span>{' '}
          <span style={S.to}>TO</span>{' '}
          <span style={S.oneEnd}>ONE</span>
        </h1>

        <div style={S.fraseContainer}>
          <span style={S.fraseIcono}>{fraseData.icono}</span>
          <p style={S.fraseTexto}>"{fraseData.texto}"</p>
        </div>
      </div>

      <div style={S.comerciosContainer}>
        {todosLosComercios.map((comercio) => {
          // Usamos el id como key ya que ahora son únicos
          return (
            <div
              key={`${comercio.tipo}-${comercio.id}`}
              style={S.comercioCard}
              onClick={() => handleComercioClick(comercio)}
            >
              <img
                src={comercio.imagen}
                alt={comercio.nombre}
                style={S.comercioImagen}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x280/2a0a0a/FFD700?text=' + encodeURIComponent(comercio.nombre || 'Comercio');
                }}
              />
              {/* Badge para comercios no disponibles */}
              {comercio.id >= 4 && (
                <div style={S.disponibleBadge}>
                  🔜 Próximamente
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onRegistroComercio && (
        <div style={S.registroBtnContainer}>
          <button onClick={onRegistroComercio} style={S.registroBtn}>
            🏪 Inscribir mi comercio
          </button>
        </div>
      )}

      {/* MODAL PERSONALIZADO */}
      {modalComercio && (
        <div style={S.modalOverlay} onClick={() => setModalComercio(null)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <div style={S.modalIcon}>🔱</div>
            <h3 style={S.modalTitulo}>{modalComercio.nombre}</h3>
            <p style={S.modalMensaje}>{modalComercio.mensaje}</p>
            <div style={S.modalBadge}>
              <span style={S.badgeDot}>●</span>
              Próximamente disponible
            </div>
            <button onClick={() => setModalComercio(null)} style={S.modalBtn}>
              ← Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
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
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,215,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
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
  disponibleBadge: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.6)',
    color: '#FFD700',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '0.6rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(4px)',
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
  // Modal personalizado
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 5000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    animation: 'fadeIn 0.3s ease',
  },
  modalCard: {
    background: 'rgba(20, 10, 10, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    padding: '2rem 1.5rem',
    maxWidth: '360px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(255, 215, 0, 0.25)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.1) inset',
    animation: 'slideUp 0.4s ease',
  },
  modalIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '0.8rem',
    animation: 'float 3s ease-in-out infinite',
  },
  modalTitulo: {
    color: '#FFD700',
    fontSize: '1.2rem',
    fontWeight: '700',
    margin: '0 0 0.8rem 0',
    fontFamily: "'Cormorant Garamond', serif",
  },
  modalMensaje: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    margin: '0 0 1.2rem 0',
    whiteSpace: 'pre-line',
  },
  modalBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0, 200, 5, 0.1)',
    border: '1px solid rgba(0, 200, 5, 0.3)',
    padding: '6px 14px',
    borderRadius: '20px',
    color: '#00c805',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginBottom: '1.2rem',
  },
  badgeDot: {
    fontSize: '0.5rem',
    animation: 'pulse 2s infinite',
  },
  modalBtn: {
    width: '100%',
    padding: '0.8rem',
    background: 'transparent',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '30px',
    color: '#FFD700',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// Animaciones unificadas
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
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}