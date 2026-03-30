import React, { useState, useEffect } from 'react';
import RegisterModal from './components/RegisterModal';

// FRASES DEL ORÁCULO - Basadas en los 4 Elementos y Arquetipos
const FRASES_ORACULO = [
  // 🔥 FUEGO - Transformación, pasión, triunfo, energía vital
  {
    elemento: 'fuego',
    icono: '🔥',
    frases: [
      "La llama que te consume también puede iluminar tu camino.",
      "El fuego interior no pide permiso para arder, solo combustible.",
      "Triunfarás cuando tus cenizas se conviertan en nuevo abono.",
      "La pasión es el dragón que domas cada mañana.",
      "El hambre de éxito quema más que cualquier fogata.",
      "Tu espíritu es brasa que espera viento para avivarse.",
      "El fuego no pregunta, transforma. Así será tu victoria.",
      "Si quieres ver el conjunto, tendrás que reconstruirme tú mismo, afirma ella"
    ]
  },
  
  // 💧 AGUA - Fluidez, emociones, adaptabilidad, inconsciente
  {
    elemento: 'agua',
    icono: '💧',
    frases: [
      "Como el agua, encuentra tu camino entre las piedras.",
      "Las lágrimas no siembran, pero riegan lo que ya está plantado.",
      "La fluidez es la inteligencia del que no resiste.",
      "El mar que llevas dentro tiene mareas que ni tú comprendes.",
      "El hambre emocional solo se sacia en aguas profundas.",
      "El agua recuerda, el viento olvida. Tú decides qué ser.",
      "La gota no compite con la roca, la rodea.",
      "muchas obras de los antiguos se han convertido en fragmentos. muchas obras contemporáneas son fragmentos desde el momento en que se escriben."
    ]
  },
  
  // 🌬️ AIRE - Pensamiento, libertad, ideas, espíritu
  {
    elemento: 'aire',
    icono: '🌬️',
    frases: [
      "El viento no retiene, solo lleva. Suelta lo que no es tuyo.",
      "Las ideas vuelan cuando las jaulas están abiertas.",
      "El hambre de conocimiento pesa menos que la ignorancia.",
      "Respira hondo: el universo cabe en un suspiro.",
      "Tu mente es cielo despejado, no permitas nubes ajenas.",
      "El silencio del viento enseña más que cualquier grito.",
      "Libre como el aire, pero con dirección de flecha.",
      "Aquellos que vagan atrapados en un laberinto, no saben como encontrar la salida."
    ]
  },
  
  // ⛰️ TIERRA - Estabilidad, cuerpo, arraigo, paciencia
  {
    elemento: 'tierra',
    icono: '⛰️',
    frases: [
      "El barro espera paciente a que lo moldees.",
      "Las raíces profundas no temen a la tormenta.",
      "El hambre de tierra es hambre de origen.",
      "La montaña no busca cumbres, ella es cumbre.",
      "Todo fruto necesita tierra, tiempo y silencio.",
      "La paciencia es el ingrediente que el tiempo no puede comprar.",
      "Como el barro en el torno, tu destino se moldea con tus manos.",
      "En el balaústre mas alto de una gran escalera vi una mano gigantesca enfundada en su armadura."
    ]
  },
  
  // ⚡ ÉXTRA - Arquetipos del triunfo y la sombra (Jung)
  {
    elemento: 'espiritu',
    icono: '✨',
    frases: [
      "El héroe no nace, se forja en su propio fuego.",
      "La sombra que ignoras crece en los rincones que no iluminas.",
      "El hambre es lobo que aúlla en la caverna del alma.",
      "El guerrero sabe que la batalla externa es espejo de la interna.",
      "Tu mayor enemigo duerme en tu misma cama: es tu miedo.",
      "El triunfo no es meta, es camino de quien se atreve.",
      "El inconsciente colectivo susurra: tú eres todos los que fueron.",
      "Apacibles, consideradas y alegres danzas en los bosques durante la noche."
    ]
  }
];

// Funciones helper FUERA del componente (NO son hooks)
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

export default function WelcomeInicio({ onSelectCategory, usuario, onAbrirRegistro, onDashboard }) {
  const [showRegister, setShowRegister] = useState(false);
  
  // ✅ CORREGIDO: useState con función para generar frase UNA SOLA VEZ
  const [fraseData] = useState(() => {
    return getFraseAleatoria();
  });

  // ✅ Guardar en localStorage para el ticket
  useEffect(() => {
    localStorage.setItem('fraseOraculo', JSON.stringify({
      texto: fraseData.texto,
      elemento: fraseData.elemento,
      icono: fraseData.icono
    }));
  }, [fraseData]);

  // 🌟 Efecto para la respiración visual (ritmo natural)
  useEffect(() => {
    const interval = setInterval(() => {
      const card = document.getElementById('card-zensual');
      if (card) {
        card.style.transition = 'box-shadow 3s ease-in-out';
        card.style.boxShadow = '0 20px 50px rgba(255,215,0,0.2)';
        setTimeout(() => {
          card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6)';
        }, 3000);
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes girarMoneda { 
          0% { transform: rotateY(0deg); } 
          100% { transform: rotateY(360deg); } 
        }
        @keyframes respirar {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes flotar {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        @keyframes brilloElemental {
          0% { filter: drop-shadow(0 0 2px #FFD700); }
          50% { filter: drop-shadow(0 0 8px #FF4500); }
          100% { filter: drop-shadow(0 0 2px #FFD700); }
        }
        .moneda-container { 
          width: 80px; height: 80px; cursor: pointer; 
          perspective: 1000px; margin: 0 auto 1rem;
          animation: flotar 4s ease-in-out infinite;
        }
        .moneda-giratoria { 
          width: 100%; height: 100%; position: relative; 
          transform-style: preserve-3d; 
          animation: girarMoneda 12s linear infinite;
        }
        .cara-moneda { 
          position: absolute; width: 100%; height: 100%; 
          border-radius: 50%; display: flex; align-items: center; 
          justify-content: center; backface-visibility: hidden; 
          border: 2px solid #FFD700; 
        }
        .cara-frontal { 
          background: linear-gradient(145deg, #B22222, #8B0000); 
          color: #FFD700; 
          font-size: 2rem;
          animation: brilloElemental 4s ease-in-out infinite;
        }
        .cara-trasera { 
          background: #FFD700; 
          color: #8B0000; 
          font-size: 1.8rem; 
          font-weight: bold; 
          transform: rotateY(180deg);
          border: 2px solid #8B0000;
        }
        .elemento-tierra {
          transition: all 0.3s ease;
        }
        .elemento-tierra:hover {
          border-color: #CD7F32;
          transform: translateY(-2px);
        }
        button {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
      `}} />

      <div id="card-zensual" style={styles.card}>
        {/* 🌞 ELEMENTO METAL - La moneda */}
        <div className="moneda-container" onClick={() => setShowRegister(true)}>
          <div className="moneda-giratoria">
            <div className="cara-moneda cara-frontal">🔱</div>
            <div className="cara-moneda cara-trasera">
              {usuario ? usuario.nombre?.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
        </div>

        {/* 🔥 ELEMENTO FUEGO - Título */}
        <h1 style={styles.titulo}>
          <span style={{color: '#FF4500'}}>ONE</span> TO{' '}
          <span style={{color: '#FFD700'}}>ONE</span>
        </h1>
        
        {/* 🌬️ ELEMENTO AIRE - Frase (con el icono del elemento) */}
        <div style={styles.fraseContenedor}>
          <span style={styles.elementoIcono}>{fraseData.icono}</span>
          <p style={styles.fraseTexto}>"{fraseData.texto}"</p>
        </div>

        {/* 🌱 ELEMENTO MADERA - Categorías */}
        <div style={styles.gridCategorias}>
          {[
            {id:'Primero', l:'PRIMEROS', i:'🍖', elemento: 'FUEGO'},
            {id:'Segundo', l:'SEGUNDOS', i:'🥘', elemento: 'TIERRA'}, 
            {id:'Bebidas', l:'BEBIDAS', i:'🍵', elemento: 'AGUA'},
            {id:'Pizzas', l:'PIZZAS', i:'🍕', elemento: 'METAL'}
          ].map(cat => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat.id)} 
              style={styles.btnCat}
              className="elemento-tierra"
            >
              <span style={{
                fontSize: "1.6rem",
                filter: cat.elemento === 'FUEGO' ? 'drop-shadow(0 0 5px #FF4500)' :
                        cat.elemento === 'AGUA' ? 'drop-shadow(0 0 5px #4169E1)' :
                        cat.elemento === 'TIERRA' ? 'drop-shadow(0 0 5px #8B4513)' :
                        'drop-shadow(0 0 5px #FFD700)'
              }}>
                {cat.i}
              </span>
              <span style={{
                fontSize: "0.7rem", 
                marginTop: "4px",
                color: cat.elemento === 'FUEGO' ? '#FF4500' :
                       cat.elemento === 'AGUA' ? '#87CEEB' :
                       cat.elemento === 'TIERRA' ? '#CD7F32' :
                       '#FFD700'
              }}>
                {cat.l}
              </span>
              <span style={{
                fontSize: "0.5rem",
                opacity: 0.6,
                marginTop: "2px",
                color: '#aaa'
              }}>
                {cat.elemento}
              </span>
            </button>
          ))}
        </div>

        {/* 💧 ELEMENTO AGUA - Footer */}
        <p style={styles.footer}>— DESDE EL BARRO —</p>
   
        {/* 🛡️ DASHBOARD - Botón para administradores */}
        <button 
          onClick={onDashboard} 
          style={styles.btnDashboard}
        >
          🛡️ DASHBOARD ADMIN
        </button>
        
        {/* 🌑 Elemento VACÍO */}
        <div style={{
          width: '50px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
          margin: '8px auto 0'
        }} />
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
    height: "100dvh",
    width: "100vw",
    background: "radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0
  },
  card: { 
    padding: "1.5rem 1rem", 
    borderRadius: "32px", 
    width: "83%",
    maxWidth: "350px",
    height: "auto",
    maxHeight: "83dvh",
    textAlign: "center", 
    background: "rgba(20, 10, 10, 0.65)", 
    backdropFilter: "blur(20px)", 
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,215,0,0.2)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "box-shadow 0.5s ease"
  },
  titulo: { 
    color: "#fff", 
    fontSize: "1.6rem", 
    margin: "0.2rem 0 0.5rem", 
    fontFamily: "'Cormorant Garamond', serif", 
    letterSpacing: '4px',
    textTransform: "uppercase",
    fontWeight: 300,
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
  },
  fraseContenedor: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column",
    alignItems: "center", 
    justifyContent: "center", 
    margin: "0.8rem 0",
    padding: "0 15px",
    minHeight: "100px",
    borderLeft: "2px solid rgba(255,215,0,0.2)",
    borderRight: "2px solid rgba(255,215,0,0.2)",
  },
  elementoIcono: {
    fontSize: "2rem",
    marginBottom: "5px"
  },
  fraseTexto: { 
    color: "#FFD700", 
    fontSize: "0.85rem", 
    fontStyle: "italic", 
    lineHeight: "1.5",
    margin: 0,
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
  },
  gridCategorias: { 
    display: "grid", 
    gridTemplateColumns: "repeat(2, 1fr)", 
    gap: "0.8rem",
    marginTop: "0.8rem"
  },
  btnCat: { 
    padding: "0.8rem 0.2rem", 
    background: "rgba(0,0,0,0.4)", 
    color: "white", 
    border: "1px solid rgba(255,215,0,0.15)", 
    borderRadius: "20px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    gap: "2px",
    backdropFilter: "blur(5px)",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  },
  footer: { 
    marginTop: "1.2rem", 
    fontSize: "0.55rem", 
    color: "#FFD700", 
    letterSpacing: "4px", 
    opacity: 0.5,
    fontFamily: "'Cormorant Garamond', serif"
  },
  btnDashboard: {
    background: "linear-gradient(135deg, #FFD700, #FF4500)",
    border: "none",
    padding: "8px 16px",
    borderRadius: "30px",
    color: "#1a0a0a",
    fontWeight: "bold",
    fontSize: "0.8rem",
    cursor: "pointer",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(255,215,0,0.3)"
  }
};