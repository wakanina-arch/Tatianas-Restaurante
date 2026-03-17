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
    { id: 'Primero', label: 'PRIMEROS', icon: '🍖' },
    { id: 'Segundo', label: 'SEGUNDOS', icon: '🥘' },
    { id: 'Postre', label: 'POSTRES', icon: '🍯' },
    { id: null, label: 'VER TODO', icon: '🔥' }
  ];

  const handleCategorySelect = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId, false);
    }
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
        card.style.boxShadow = '0 20px 40px rgba(255,215,0,0.15)';
        setTimeout(() => {
          card.style.boxShadow = '0 30px 60px rgba(0,0,0,0.3)';
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
      padding: "1rem"
    }}>
      <style>{`
        @keyframes girar { 
          from { transform: rotateY(0deg); } 
          to { transform: rotateY(360deg); } 
        }
        .moneda { 
          width: 70px; 
          height: 70px; 
          cursor: pointer; 
          perspective: 1000px; 
          margin: 0 auto 15px; 
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
          border: 2px solid rgba(255, 215, 0, 0.5); 
          color: white; 
          font-size: 2rem; 
          backdropFilter: 'blur(4px)';
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)';
        }
        .trasera { 
          transform: rotateY(180deg); 
          background: rgba(139, 69, 19, 0.8); 
        }
        .frontal { 
          background: rgba(205, 92, 92, 0.8); 
        }
        .categoria-btn {
          padding: 0.8rem;
          background: rgba(0, 0, 0, 0.3);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s ease;
          backdropFilter: 'blur(8px)';
        }
        .categoria-btn:hover {
          background: rgba(255, 215, 0, 0.15);
          transform: translateY(-2px);
          border-color: rgba(255, 215, 0, 0.3);
        }
        .oraculo-container {
          background: rgba(0, 0, 0, 0.2);
          backdropFilter: 'blur(12px)';
          borderRadius: '32px';
          padding: '1.5rem 1.2rem';
          margin: '1.5rem 0';
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
          transition: 'all 0.3s ease';
          border: '1px solid rgba(255, 255, 255, 0.1)';
        }
        .oraculo-container:hover {
          boxShadow: '0 20px 40px -12px rgba(255, 215, 0, 0.2)';
          transform: 'translateY(-2px)';
          borderColor: 'rgba(255, 215, 0, 0.2)';
        }
        .oraculo-iconos {
          display: 'flex';
          alignItems: 'center';
          justifyContent: 'center';
          gap: '1rem';
          marginBottom: '1rem';
          fontSize: '1.8rem';
          opacity: 0.9;
        }
        .oraculo-icono-principal {
          fontSize: '2.4rem';
          filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.2))';
          transition: 'all 0.3s ease';
        }
        .oraculo-texto {
          margin: 0;
          fontWeight: 300;
          textShadow: '0 2px 4px rgba(0,0,0,0.3)';
          color: 'rgba(255, 255, 255, 0.95)';
          fontSize: '0.95rem';
          lineHeight: 1.6;
          letterSpacing: 0.2;
          fontStyle: 'italic';
        }
      `}</style>

      <div id="card-zensual" style={{
        background: "rgba(30, 20, 15, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "48px",
        padding: "2.5rem 1.8rem",
        maxWidth: "360px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
        border: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        
        {/* MONEDA: TRIDENTE */}
        <div className="moneda" onClick={() => setShowRegister(true)}>
          <div className="cara frontal" style={{
            background: "rgba(205, 92, 92, 0.7)",
            backdropFilter: "blur(4px)"
          }}>🔱</div>
          <div className="cara trasera" style={{
            background: "rgba(139, 69, 19, 0.7)",
            backdropFilter: "blur(4px)"
          }}>
            {user ? user.nombre?.charAt(0).toUpperCase() : '👤'}
          </div>
        </div>
        
        <h1 style={{ 
          color: "white", 
          fontSize: "2.2rem", 
          margin: "0.2rem 0 0.1rem", 
          fontFamily: "'Cormorant Garamond', serif", 
          fontWeight: "600",
          letterSpacing: "1px",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}>
          ONE TO ONE
        </h1>
        
        <p style={{ 
          color: "rgba(255, 215, 0, 0.8)", 
          fontSize: "0.8rem", 
          marginBottom: "1.5rem", 
          fontStyle: "italic",
          fontWeight: "300"
        }}>
          "El sabor de la brasa"
        </p>

        {/* ===== 🎭 ORÁCULO - VERSIÓN SIMPLIFICADA ===== */}
        <div style={{
          background: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "32px",
          padding: "1.5rem 1.2rem",
          margin: "1.5rem 0",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(255, 215, 0, 0.1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 20px 40px -12px ${getColorElemento(fraseData.elemento)}40`;
          e.currentTarget.style.borderColor = `${getColorElemento(fraseData.elemento)}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0, 0, 0, 0.5)";
          e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.1)";
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1rem",
            fontSize: "1.8rem",
            opacity: 0.9
          }}>
            <span style={{
              fontSize: "2.4rem",
              filter: `drop-shadow(0 0 12px ${getColorElemento(fraseData.elemento)}40)`,
              transition: "all 0.3s ease"
            }}>
              {fraseData.icono}
            </span>
          </div>
          <p style={{
            margin: 0,
            fontWeight: 300,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            color: "rgba(255, 255, 255, 0.95)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
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
          gap: "0.7rem", 
          marginBottom: "1.5rem" 
        }}>
          {categorias.map(cat => (
            <button 
              key={cat.id || 'todas'} 
              onClick={() => handleCategorySelect(cat.id)} 
              style={{
                padding: "0.8rem",
                background: "rgba(0, 0, 0, 0.3)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.2s ease",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 215, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <span style={{ fontSize: "1.4rem", marginBottom: "0.2rem" }}>{cat.icon}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.5px" }}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* MENSAJE DE REGISTRO OPCIONAL */}
        <p 
          onClick={() => setShowRegister(true)} 
          style={{ 
            color: "rgba(255, 255, 255, 0.6)", 
            fontSize: "0.75rem", 
            marginBottom: "1.5rem", 
            cursor: "pointer", 
            textDecoration: "none",
            borderBottom: "1px dotted rgba(255, 215, 0, 0.3)",
            paddingBottom: "0.2rem",
            display: "inline-block",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "rgba(255, 215, 0, 0.8)";
            e.target.style.borderBottomColor = "rgba(255, 215, 0, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "rgba(255, 255, 255, 0.6)";
            e.target.style.borderBottomColor = "rgba(255, 215, 0, 0.3)";
          }}
        >
          ✨ Regístrate para obtener descuentos exclusivos
        </p>

        <p style={{ 
          fontSize: "0.65rem", 
          color: "#FF4500", 
          fontWeight: "600", 
          textTransform: "uppercase", 
          letterSpacing: "2px",
          margin: 0,
          opacity: 0.8
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