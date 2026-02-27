import React, { useState, useEffect } from 'react';

// Modal simple de registro/beneficios
const UserBenefitsModal = ({ onClose, onRegister }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        textAlign: 'center'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#666'
        }}>×</button>

        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #ffb347, #ff6b35)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem'
        }}>
          🎁
        </div>

        <h2 style={{ color: '#01400e', marginBottom: '1rem' }}>
          ¿Registrarte? ¡Es opcional!
        </h2>

        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Pero si lo haces, obtienes beneficios exclusivos:
        </p>

        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎂</span>
            <div>
              <strong style={{ color: '#01400e' }}>Descuento de cumpleaños</strong>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>15% off en tu mes</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏷️</span>
            <div>
              <strong style={{ color: '#01400e' }}>Promociones exclusivas</strong>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Ofertas solo para miembros</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <div>
              <strong style={{ color: '#01400e' }}>Pedidos más rápido</strong>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Tus datos guardados</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => {
            alert('¡Pronto podrás registrarte! Por ahora, sigue como invitado ✨');
            onClose();
          }} style={{
            flex: 1,
            padding: '1rem',
            background: 'linear-gradient(135deg, #ffb347, #ff6b35)',
            border: 'none',
            borderRadius: '30px',
            color: '#01400e',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Registrarme
          </button>
          
          <button onClick={onClose} style={{
            flex: 1,
            padding: '1rem',
            background: 'white',
            border: '2px solid #01400e',
            borderRadius: '30px',
            color: '#01400e',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Seguir como invitado
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '1rem' }}>
          El registro es completamente gratuito
        </p>
      </div>
    </div>
  );
};

export default function WelcomeScreen({ onSelectCategory, onUserLogin }) {
  const [showUserModal, setShowUserModal] = useState(false);
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('oneToOneUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (onUserLogin) onUserLogin(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('oneToOneUser');
    setUser(null);
    if (onUserLogin) onUserLogin(null);
  };

  const buttonBaseStyle = {
  width: '100%',
  padding: '0.1rem 1.1rem',           // ← Padding generoso
  border: '2px solid rgba(255, 248, 220, 0.6)', // ← Borde color cuero claro
  borderRadius: '8px',               // ← CASI cuadrado (solo un toque)
  background: 'rgba(245, 222, 179, 0.25)', // ← Trigo/beige transparente
  color: '#3d2b1a',                  // ← Marrón oscuro (como cuero viejo)
  fontSize: '1.7rem',
  fontWeight: 600,
  fontFamily: "'Courier New', 'Westminster', 'Impact', monospace", // ← Letra western
  textTransform: 'uppercase',
  letterSpacing: '4px',              // ← Espaciado como cartel de frontera
  textShadow: '2px 2px 0 rgba(139, 69, 19, 0.2)', // ← Sombra terrosa
  boxShadow: '4px 4px 10px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255, 248, 220, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(2px)',        // ← Cristal pero sutil
  borderImage: 'repeating-linear-gradient(45deg, #8B4513, #D2B48C, #8B4513) 30', // ← Efecto madera
  borderImageSlice: 2,                // ← Para el efecto madera
  position: 'relative',
  overflow: 'hidden'
};

// Efecto hover para que parezca madera vieja que se ilumina
const buttonHoverStyle = {
  transform: 'translateY(-3px)',
  background: 'rgba(210, 180, 140, 0.35)', // ← Más claro al hover
  boxShadow: '6px 6px 15px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255, 248, 220, 0.5)',
  borderColor: 'rgba(139, 69, 19, 0.8)',
  letterSpacing: '6px'                 // ← Más espaciado al hover
};

  return (
    <div 
      className="welcome-screen"
      style={{
        backgroundImage: imgError 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          : 'url(/img/frente1.JPG)',
        backgroundSize: '100%',  // ← Ajustado como pediste
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#ea8b06',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Imagen oculta para detectar error */}
      <img 
        src="/img/frente1.JPG" 
        alt="" 
        style={{ display: 'none' }}
        onError={() => setImgError(true)}
      />

      {/* Capa semitransparente muy sutil para legibilidad */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 1
      }}></div>

      {/* ===== TEXTO SUPERIOR ===== */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        padding: '2rem 1rem 0',
        textAlign: 'center'
      }}>
        {/* OneToOne */}
        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          color: '#01400e',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-1px',
          textShadow: '2px 2px 0 rgba(255,255,255,0.5)',
          fontFamily: "'Segoe UI', 'Arial Black', sans-serif"
        }}>
          OneToOne
        </h1>

        {/* RESTAURANTE - ancho completo */}
        <div style={{
          marginTop: '8.5rem',
          width: '100%'
        }}>
          <p style={{
            fontSize: '6.2rem',
            fontWeight: 800,
            color: 'rgba(77, 67, 67, 0.9',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '8px',
            //borderTop: '2px solid rgba(1, 64, 14, 0.3)',
            //borderBottom: '2px solid rgba(1, 64, 14, 0.3)',
            padding: '0.5rem 0',
            width: '100%',
            fontFamily: "'Segoe UI', 'Impact', sans-serif"
          }}>
            RESTAURANTE
          </p>
        </div>
      </div>

      {/* Contenedor principal para el contenido (botones) */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '1rem',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        //justifyContent: 'flex-end',
        marginTop: '18rem',
        flex: 1
      }}>
        
    

        {/* Botones de categorías */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => onSelectCategory('Primero')}
            style={{
              ...buttonBaseStyle,
              background: 'rgba(77, 67, 67, 0.9)',
              color: '#01400e',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}
          >
            primeros
          </button>

          <button 
            onClick={() => onSelectCategory('Segundo')}
            style={{
              ...buttonBaseStyle,
              background: 'rgba(77, 67, 67, 0.9)',
              color: '#01400e',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}
          >
            segundos
          </button>

          <button 
            onClick={() => onSelectCategory('Postre')}
            style={{
              ...buttonBaseStyle,
              background: 'rgba(77, 67, 67, 0.9)',
              color: '#01400e',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}
          >
            postres y bebidas
          </button>
        </div>

        {/* Icono de usuario */}
       {/* Icono de usuario - AHORA MÁS ARRIBA */}
{/* Icono de usuario - TOTALMENTE LIBRE PARA AJUSTAR */}
<div style={{ 
  position: 'absolute', 
  top: '-43rem',           // ← CAMBIA ESTE VALOR (subir/bajar)
  right: '-4rem',         // ← CAMBIA ESTE VALOR (izquierda/derecha)
  zIndex: 3
}}>
  <button 
    onClick={() => setShowUserModal(true)}
    style={{
      width: '45px',        // ← Tamaño del icono
      height: '45px',       // ← Tamaño del icono
      borderRadius: '50%',
      background: '#01400e',
      border: '3px solid #ffb347',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      fontSize: '1.3rem',
      padding: 0,
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}
  >
    {user ? (
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        {user.nombre?.charAt(0) || 'U'}
      </span>
    ) : (
      <span style={{ fontSize: '1.3rem' }}>👤</span>
    )}
  </button>
</div>

        {/* Dropdown de usuario */}
        {user && (
          <div style={{
            position: 'absolute',
            top: '5rem',
            right: '1.5rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            padding: '0.5rem',
            minWidth: '150px',
            zIndex: 20
          }}>
            <span style={{
              display: 'block',
              padding: '0.5rem',
              color: '#01400e',
              fontWeight: 600,
              borderBottom: '1px solid #ffe6d5'
            }}>
              {user.nombre}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#c33',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Modal de beneficios */}
      {showUserModal && !user && (
        <UserBenefitsModal 
          onClose={() => setShowUserModal(false)}
        />
      )}
    </div>
  );
}