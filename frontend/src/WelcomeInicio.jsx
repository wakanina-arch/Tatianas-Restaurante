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
    { id: 'Otras', label: 'OTRAS', icon: '🔥' },
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
        card.style.boxShadow = '0 20px 50px rgba(255,215,0,0.2)';
        setTimeout(() => {
          card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6)';
        }, 3000);
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      height: "100vh",
      background: "radial-gradient(circle, #8B4513, #492b2b)",      
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", overflow: "hidden"
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
          animation: girar 5s linear infinite; 
          transform-style: preserve-3d; 
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
          border: 2px solid gold; 
          color: white; 
          font-size: 2rem; 
        }
        .trasera { 
          transform: rotateY(180deg); 
          background: #8B4513; 
        }
        .frontal { 
          background: #CD5C5C; 
        }
        .categoria-btn {
          padding: 0.8rem;
          background: rgba(0,0,0,0.4);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
        }
        .categoria-btn:hover {
          background: rgba(255,215,0,0.3);
          transform: translateY(-2px);
          border-color: gold;
        }
        /* ===== ESTILO SIMPLIFICADO PARA EL ORÁCULO ===== */
        .oraculo-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 24px;
          padding: 1.5rem 1rem;
          margin: 1.5rem 0;
          box-shadow: 0 10px 25px -8px rgba(0, 0, 0, 0.5);
          transition: all 0.4s ease;
        }
        .oraculo-container:hover {
          box-shadow: 0 15px 35px -8px rgba(255, 215, 0, 0.3);
          transform: translateY(-2px);
        }
        .oraculo-iconos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 1.8rem;
          opacity: 0.9;
        }
        .oraculo-icono-principal {
          font-size: 2.2rem;
          filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
        }
        .oraculo-texto {
          margin: 0;
          font-weight: 300;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          color: white;
          font-size: 0.95rem;
          line-height: 1.6;
          letter-spacing: 0.2px;
        }
      `}</style>

      <div id="card-zensual" style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(15px)",
        borderRadius: "40px",
        padding: "2rem 1.5rem",
        maxWidth: "350px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.2)"
      }}>
        
        {/* MONEDA: TRIDENTE */}
        <div className="moneda" onClick={() => setShowRegister(true)}>
          <div className="cara frontal">🔱</div>
          <div className="cara trasera">
            {user ? user.nombre?.charAt(0).toUpperCase() : '👤'}
          </div>
        </div>
        
        <h1 style={{ 
          color: "white", 
          fontSize: "2.2rem", 
          margin: "0", 
          fontFamily: "serif", 
          letterSpacing: "2px" 
        }}>
          ONE TO ONE
        </h1>
        
        <p style={{ 
          color: "#FFD700", 
          fontSize: "0.8rem", 
          marginBottom: "1.2rem", 
          fontStyle: "italic" 
        }}>
          "El sabor de la brasa"
        </p>

        {/* ===== 🎭 ORÁCULO - VERSIÓN SIMPLIFICADA ===== */}
        <div className="oraculo-container">
          <div className="oraculo-iconos">
            
            <span className="oraculo-icono-principal">{fraseData.icono}</span>
        
          </div>
          <p className="oraculo-texto">
            "{fraseData.texto}"
          </p>
        </div>

        {/* BOTONES CATEGORÍAS */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "0.7rem", 
          marginBottom: "1.2rem" 
        }}>
          {categorias.map(cat => (
            <button 
              key={cat.id || 'todas'} 
              onClick={() => handleCategorySelect(cat.id)} 
              className="categoria-btn"
            >
              <span style={{ fontSize: "1.4rem" }}>{cat.icon}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: "bold" }}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* MENSAJE DE REGISTRO INTEGRADO */}
       {/* MENSAJE DE REGISTRO OPCIONAL */}
<p 
  onClick={() => setShowRegister(true)} 
  style={{ 
    color: "white", 
    fontSize: "0.75rem", 
    marginBottom: "1.5rem", 
    cursor: "pointer", 
    textDecoration: "underline",
    opacity: 0.8,
    transition: "opacity 0.3s ease"
  }}
  onMouseEnter={(e) => e.target.style.opacity = "1"}
  onMouseLeave={(e) => e.target.style.opacity = "0.8"}
>
  ✨ Regístrate para obtener descuentos exclusivos (opcional)
</p>

        <p style={{ 
          fontSize: "0.7rem", 
          color: "#FF4500", 
          fontWeight: "bold", 
          textTransform: "uppercase", 
          letterSpacing: "1px" 
        }}>
          🔥 EL SABOR DE LA TIERRA 🔥
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