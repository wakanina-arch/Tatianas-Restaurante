// src/components/MediaCarousel.jsx
import React, { useState, useEffect } from 'react';

// ============================================
// MEDIA CAROUSEL - Carrusel de imágenes/videos
// Integrado con el sistema de estilos One To One
// ============================================

export default function MediaCarousel({ items, autoPlay = true, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    let timer;
    if (isPlaying && items.length > 1) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, items.length, interval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const currentItem = items[currentIndex];

  if (!items || items.length === 0) return null;

  return (
    <div className="media-carousel" style={styles.carousel}>
      <div className="carousel-container" style={styles.container}>
        {currentItem.tipo === 'video' ? (
          <video 
            key={currentItem.url}
            src={currentItem.url} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="carousel-media"
            style={styles.media}
          />
        ) : (
          <img 
            key={currentItem.url}
            src={currentItem.url} 
            alt={`Slide ${currentIndex}`}
            className="carousel-media"
            style={styles.media}
          />
        )}
      </div>

      {items.length > 1 && (
        <>
          <button 
            className="carousel-arrow prev" 
            onClick={goToPrev}
            style={styles.arrow}
          >
            ‹
          </button>
          <button 
            className="carousel-arrow next" 
            onClick={goToNext}
            style={styles.arrow}
          >
            ›
          </button>

          <div className="carousel-dots" style={styles.dots}>
            {items.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                style={{
                  ...styles.dot,
                  ...(index === currentIndex ? styles.dotActive : {})
                }}
              />
            ))}
          </div>

          <button 
            className="carousel-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            style={styles.playBtn}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </>
      )}
    </div>
  );
}

// ============================================
// ESTILOS
// ============================================
const styles = {
  carousel: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)'
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block'
  },
  arrow: {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(232, 97, 8, 0.9)',
  color: 'white',
  border: '2px solid white',        // ← Borde blanco para destacar
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  fontSize: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 9999,                     // ← Altísimo
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  opacity: 0.9
},
  dots: {
  position: 'absolute',
  bottom: '15px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 1000                           // ← MUY ALTO
},
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  dotActive: {
    background: 'var(--verde-fluo)',
    width: '20px',
    borderRadius: '10px'
  },
  playBtn: {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  background: 'rgba(0, 0, 0, 0.7)',       // ← Más opaco
  color: 'white',
  border: 'none',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  fontSize: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,                           // ← MUY ALTO
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
},
};

// ============================================
// ESTILOS DINÁMICOS
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .carousel-arrow:hover {
    background: var(--naranja-papaya) !important;
    transform: translateY(-50%) scale(1.1) !important;
  }

  .carousel-arrow.prev {
    left: 10px;
  }

  .carousel-arrow.next {
    right: 10px;
  }

  .dot:hover {
    background: white !important;
    transform: scale(1.2);
  }

  .carousel-play-btn:hover {
    background: var(--naranja-papaya) !important;
    transform: scale(1.1);
  }

  .carousel-media {
    transition: transform 0.3s ease;
  }

  .carousel-media:hover {
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);