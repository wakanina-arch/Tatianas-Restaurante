// WelcomeInicio.jsx - Versión con oráculo simplificado
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
      "El fuego no pregunta, transforma. Así será tu victoria."
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
      "La gota no compite con la roca, la rodea."
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
      "Libre como el aire, pero con dirección de flecha."
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
      "Como el barro en el torno, tu destino se moldea con tus manos."
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
      "El inconsciente colectivo susurra: tú eres todos los que fueron."
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

export default function WelcomeInicio({ onSelectCategory }) {
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  
  // ✅ Frase aleatoria que se genera una sola vez
  const [fraseData] = useState(() => {
    return getFraseAleatoria();
  });

  const categorias = [
  { id: 'Primero', label: 'COMPLEMENTOS', icon: '🍟' },
  { id: 'Segundo', label: 'ENSALADAS', icon: '🥗' },
  { id: 'Postre', label: 'BEBIDAS', icon: '🥤' },
  { id: 'Otras', label: 'PIZZAS', icon: '🍕' }
];


  const handleCategorySelect = (categoryId) => {
  console.log('🔵 Welcome enviando:', categoryId); // <-- Debe mostrar 'Primero'
  onSelectCategory(categoryId, false);
};

  // Cargar usuario guardado
  useEffect(() => {
    const savedUser = localStorage.getItem('oneToOneUser');
    if (savedUser) {
      try { 
        setUser(JSON.parse(savedUser)); 
      } catch (e) { 
        console.log(e); 
      }
    }
  }, []);

  // Guardar en localStorage para el ticket
  useEffect(() => {
    localStorage.setItem('fraseOraculo', JSON.stringify({
      texto: fraseData.texto,
      elemento: fraseData.elemento,
      icono: fraseData.icono
    }));
  }, [fraseData]);

  // Efecto para la respiración visual (ritmo natural)
  useEffect(() => {
    const interval = setInterval(() => {
      const card = document.getElementById('card-zensual');
      if (card) {
        card.style.transition = 'box-shadow 3s ease-in-out';
        card.style.boxShadow = '0 15px 30px rgba(255,215,0,0.1)';
        setTimeout(() => {
          card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        }, 3000);
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  // Determinar color del elemento para el oráculo
  const getColorElemento = (elemento) => {
    switch(elemento) {
      case 'fuego': return '#FF4500';
      case 'tierra': return '#CD7F32';
      case 'agua': return '#4169E1';
      case 'aire': return '#87CEEB';
      case 'espiritu': return '#FFD700';
      default: return '#FFD700';
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 30% 30%, #8B4513, #2C1810)",      
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "2rem" // Más padding alrededor
    }}>
      <style>{`
        @keyframes girar { 
          from { transform: rotateY(0deg); } 
          to { transform: rotateY(360deg); } 
        }
        .moneda { 
          width: 60px; /* Más pequeña */
          height: 60px; 
          cursor: pointer; 
          perspective: 1000px; 
          margin: 0 auto 12px; /* Menos margen */
          animation: girar 8s linear infinite; 
          transform-style: preserve-3d; 
          transition: all 0.3s ease;
        }
        .moneda:hover {
          transform: scale(1.05);
          animation-play-state: paused;
        }
        .cara { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          backface-visibility: hidden; 
          border: 2px solid rgba(255, 215, 0, 0.4); /* Borde más sutil */
          color: white; 
          font-size: 1.8rem; /* Texto más pequeño */
          backdropFilter: 'blur(4px)';
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)';
        }
        .trasera { 
          transform: rotateY(180deg); 
          background: rgba(139, 69, 19, 0.7); 
        }
        .frontal { 
          background: rgba(205, 92, 92, 0.7); 
        }
        .categoria-btn {
          padding: 0.7rem;
          background: rgba(0, 0, 0, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s ease;
          backdropFilter: 'blur(8px)';
        }
        .categoria-btn:hover {
          background: rgba(255, 215, 0, 0.1);
          transform: translateY(-2px);
          border-color: rgba(255, 215, 0, 0.2);
        }
      `}</style>

      <div id="card-zensual" style={{
        background: "rgba(30, 20, 15, 0.5)", // Más transparente
        backdropFilter: "blur(10px)", // Menos blur
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "40px", // Un poco menos
        padding: "2rem 1.5rem", // Menos padding
        maxWidth: "320px", // Más estrecho
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)", // Sombra más suave
        border: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        
        {/* MONEDA: TRIDENTE */}
        <div className="moneda" onClick={() => setShowRegister(true)}>
          <div className="cara frontal" style={{
            background: "rgba(205, 92, 92, 0.6)",
            backdropFilter: "blur(4px)"
          }}>🔱</div>
          <div className="cara trasera" style={{
            background: "rgba(139, 69, 19, 0.6)",
            backdropFilter: "blur(4px)"
          }}>
            {user ? user.nombre?.charAt(0).toUpperCase() : '👤'}
          </div>
        </div>
        
        <h1 style={{ 
          color: "white", 
          fontSize: "2rem", // Más pequeño
          margin: "0.2rem 0 0.1rem", 
          fontFamily: "'Cormorant Garamond', serif", 
          fontWeight: "600",
          letterSpacing: "0.5px", // Menos espaciado
          textShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          ONE TO ONE
        </h1>
        
        <div style={{ 
  color: "rgba(255, 215, 0, 0.7)",
  fontSize: "0.75rem",
  marginBottom: "1.2rem",
  fontStyle: "italic",
  fontWeight: "300"
}}>
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontFamily: "'Segoe UI', sans-serif",
    marginTop: "-0.8rem",
    marginBottom: "1rem",
    //width: "100%"
  }}>
    <span style={{
    fontSize: "0.8rem",
    color: "#FF4500", 
    fontWeight: "600", 
    letterSpacing: "1px",
    margin: 0,
    opacity: 0.7,
    textShadow: "0 0 5px rgba(255, 69, 0, 0.3)" // Brillo naranja sutil
    }}>Rapi</span>
    
   <svg width="70" height="30" viewBox="0 0 70 30">
  
  <defs>
    <linearGradient id="aceroBrillante" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#4A4A4A" />
      <stop offset="30%" stopColor="#9E9E9E" />
      <stop offset="50%" stopColor="#FFFFFF" />
      <stop offset="70%" stopColor="#9E9E9E" />
      <stop offset="100%" stopColor="#4A4A4A" />
    </linearGradient>
    
    <filter id="destello">
      <feGaussianBlur stdDeviation="1.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  {/* CAPA 1: Base sólida oscura (garantiza que se vea) */}
  <line 
     x1="20" y1="15" x2="45" y2="15" 
    stroke="#3f3e3e" 
    strokeWidth="4" 
    strokeLinecap="round"
  />
  
  {/* CAPA 2: Arte con brillo (el efecto bonito) */}
  <line 
    x1="20" y1="15" x2="45" y2="15" 
    stroke="url(#aceroBrillante)" 
    strokeWidth="3.5" 
    strokeLinecap="round"
    filter="url(#destello)"
  />
  
  {/* Punta: base oscura */}
  <polygon 
    points="58,10 65,15 58,20" 
    fill="#333333"
  />
  
  {/* Punta: arte brillante */}
  <polygon 
    points="58,10 65,15 58,20" 
    fill="url(#aceroBrillante)"
    filter="url(#destello)"
  />
  
  {/* Círculo decorativo */}
  <circle cx="8" cy="15" r="3" fill="url(#aceroBrillante)" filter="url(#destello)" />
  
</svg>
    
    <span style={{
    fontSize: "0.8rem",
    color: "#FF4500", 
    fontWeight: "600", 
    letterSpacing: "1px",
    margin: 0,
    opacity: 0.7,
    textShadow: "0 0 5px rgba(255, 69, 0, 0.3)" // Brillo naranja sutil
    }}>Servi</span>
  </div>
</div>

        {/* ===== 🎭 ORÁCULO - VERSIÓN SIMPLIFICADA ===== */}
        <div style={{
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "28px",
          padding: "1.2rem 1rem",
          margin: "1.2rem 0",
          boxShadow: "0 8px 20px -8px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(255, 215, 0, 0.1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 15px 30px -12px ${getColorElemento(fraseData.elemento)}30`;
          e.currentTarget.style.borderColor = `${getColorElemento(fraseData.elemento)}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 20px -8px rgba(0, 0, 0, 0.3)";
          e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.1)";
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.8rem",
            marginBottom: "0.8rem",
            fontSize: "1.5rem",
            opacity: 0.8
          }}>
            <span style={{
              fontSize: "2rem",
              filter: `drop-shadow(0 0 8px ${getColorElemento(fraseData.elemento)}30)`,
              transition: "all 0.3s ease"
            }}>
              {fraseData.icono}
            </span>
          </div>
          <p style={{
            margin: 0,
            fontWeight: 300,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "0.85rem", // Más pequeño
            lineHeight: 1.5,
            letterSpacing: "0.2px",
            fontStyle: "italic"
          }}>
            "{fraseData.texto}"
          </p>
        </div>

        {/* BOTONES CATEGORÍAS */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "0.6rem", // Menos gap
          marginBottom: "1.2rem" // Menos margen
        }}>
          {categorias.map(cat => (
            <button 
              key={cat.id || 'todas'} 
              onClick={() => onSelectCategory(cat.id)} 
              style={{
                padding: "0.7rem",
                background: "rgba(0, 0, 0, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.2s ease",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-1px)"; // Menos elevación
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <span style={{ fontSize: "1.2rem", marginBottom: "0.1rem" }}>{cat.icon}</span>
              <span style={{ fontSize: "0.65rem", fontWeight: "600", letterSpacing: "0.5px" }}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* MENSAJE DE REGISTRO OPCIONAL */}
        <p 
          onClick={() => setShowRegister(true)} 
          style={{
  display: "inline-block",
  color: "rgba(255, 255, 255, 0.5)", 
  fontSize: "0.7rem", 
  marginBottom: "1.2rem", 
  paddingBottom: "0.1rem",
  textDecoration: "none",
  borderBottom: "1px dotted rgba(255, 215, 0, 0.2)",
  transition: "all 0.2s ease",
  /* --- CARPINTERÍA PARA IPHONE --- */
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent", 
  touchAction: "manipulation"
}}

          onMouseEnter={(e) => {
            e.target.style.color = "rgba(255, 215, 0, 0.6)";
            e.target.style.borderBottomColor = "rgba(255, 215, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "rgba(255, 255, 255, 0.5)";
            e.target.style.borderBottomColor = "rgba(255, 215, 0, 0.2)";
          }}
        >
          ✨ Regístrate para obtener descuentos exclusivos
        </p>

        <p style={{ 
          fontSize: "0.6rem", // Más pequeño
          color: "#FF4500", 
          fontWeight: "600", 
          textTransform: "uppercase", 
          letterSpacing: "1px", // Menos espaciado
          margin: 0,
          opacity: 0.7
        }}>
          EL SABOR DE LA TIERRA
        </p>
      </div>

      <RegisterModal 
        open={showRegister} 
        onClose={() => setShowRegister(false)} 
        onRegister={(u) => { 
          localStorage.setItem('oneToOneUser', JSON.stringify(u)); 
          setUser(u); 
          setShowRegister(false); 
        }} 
      />
    </div>
  );
}