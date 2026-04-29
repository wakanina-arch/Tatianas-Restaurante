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

// ✅ SOLO LAS 3 DEMOS ACTIVAS (ids 1,2,3)
const DEMOS_ACTIVAS = [
  { id: 1, nombre: "ONO TO ONE", imagen: "/casas/en_su_punto.JPG" },
  { id: 2, nombre: "Sabores del Origen", imagen: "/casas/Ceremoniales.JPG" },
  { id: 3, nombre: "Sierra y Fuego", imagen: "/casas/Como_en_casa.JPG" },
];

// ✅ COMERCIOS PUBLICITARIOS (ids 4-9) - Solo muestran modal
const COMERCIOS_PUBLICITARIOS = [
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
      // Filtrar para no duplicar ids que ya están en demos o publicitarios
      const idsFijos = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const registrosSinFijos = registros.filter(r => !idsFijos.includes(r.id));
      setComerciosRegistrados(registrosSinFijos);
    } catch (e) {
      console.error('Error cargando comercios registrados:', e);
    }
  }, [currentPage]);

  // Combinar: demos activas + publicitarios + comercios registrados
  const todosLosComercios = [
    ...DEMOS_ACTIVAS,
    ...COMERCIOS_PUBLICITARIOS,
    ...comerciosRegistrados.map(r => ({
      id: r.id,
      nombre: r.nombre,
      imagen: r.imagen || r.logo || '/img/default-restaurante.png',
    }))
  ];

  const handleComercioClick = (comercio) => {
    console.log("🔥 Click en comercio:", comercio.id, comercio.nombre);
    
    // IDs 1, 2, 3 = DEMOS ACTIVAS → Abrir menú
    if (comercio.id === 1 || comercio.id === 2 || comercio.id === 3) {
      console.log("✅ Demo activa, abriendo:", comercio.nombre);
      onSelectCategory('Picoteo', comercio.id);
      return;
    }
    
    // IDs 4-9 = COMERCIOS PUBLICITARIOS → Modal "Próximamente"
    const mensajes = [
      `🏪 ¡Este local está buscando dueño!\n\n"${comercio.nombre}" podría ser tu próximo gran éxito.\n\nPróximamente disponible en ONE TO ONE.`,
      `🍳 ¡Aquí huele a oportunidad!\n\n"${comercio.nombre}" está esperando a que alguien como tú le dé vida.\n\nMuy pronto en nuestra plataforma.`,
      `🔥 ¡Alerta de negocio vacante!\n\n"${comercio.nombre}" necesita un chef como tú.\n\nEspacio reservado para futuros socios.`
    ];
    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
    setModalComercio({ nombre: comercio.nombre, mensaje });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div
          className="tridente"
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
        {todosLosComercios.map((comercio) => (
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
                e.target.src = 'https://via.placeholder.com/400x280/2a0a0a/FFD700?text=' + encodeURIComponent(comercio.nombre || 'Comercio');
              }}
            />
            {comercio.id >= 4 && (
              <div style={styles.disponibleBadge}>
                🔜 Próximamente
              </div>
            )}
          </div>
        ))}
      </div>

      {onRegistroComercio && (
        <div style={styles.registroBtnContainer}>
          <button onClick={onRegistroComercio} style={styles.registroBtn}>
            🏪 Inscribir mi comercio
          </button>
        </div>
      )}

      {modalComercio && (
        <div style={styles.modalOverlay} onClick={() => setModalComercio(null)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.modalIcon}>🔱</div>
            <h3 style={styles.modalTitulo}>{modalComercio.nombre}</h3>
            <p style={styles.modalMensaje}>{modalComercio.mensaje}</p>
            <div style={styles.modalBadge}>
              <span style={styles.badgeDot}>●</span>
              Próximamente disponible
            </div>
            <button onClick={() => setModalComercio(null)} style={styles.modalBtn}>
              ← Volver al inicio
            </button>
          </div>
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
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,215,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
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
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 5000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modalCard: {
    background: 'rgba(20, 10, 10, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    padding: '2rem 1.5rem',
    maxWidth: '340px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  },
  modalIcon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  modalTitulo: { color: '#FFD700', fontSize: '1.2rem', marginBottom: '0.5rem' },
  modalMensaje: { color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem', whiteSpace: 'pre-line' },
  modalBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,200,5,0.1)', border: '1px solid rgba(0,200,5,0.3)', padding: '4px 12px', borderRadius: '20px', color: '#00c805', fontSize: '0.7rem', marginBottom: '1rem' },
  badgeDot: { fontSize: '0.5rem', animation: 'pulse 2s infinite' },
  modalBtn: { width: '100%', padding: '0.7rem', background: 'transparent', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '30px', color: '#FFD700', cursor: 'pointer' }
};