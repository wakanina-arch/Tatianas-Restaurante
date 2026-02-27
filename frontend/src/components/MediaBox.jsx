// src/components/MediaBox.jsx
import React, { useState } from 'react';

// ============================================
// MEDIA BOX - Caja multimedia individual
// Integrado con el sistema de estilos One To One
// ============================================

export default function MediaBox({ imagen, video, nombre }) {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  // Si hay video y no hay error
  if (video && !error) {
    return (
      <div className="media-box" style={styles.mediaBox}>
        <video 
          src={video}
          controls={false}
          autoPlay
          loop
          muted
          playsInline
          onError={handleError}
          style={styles.mediaVideo}
        />
      </div>
    );
  }

  // Si hay imagen y no hay error
  if (imagen && !error) {
    return (
      <div className="media-box" style={styles.mediaBox}>
        <img 
          src={imagen} 
          alt={nombre}
          onError={handleError}
          style={styles.mediaImage}
        />
      </div>
    );
  }

  // Placeholder (cuando no hay media o hubo error)
  return (
    <div className="media-box" style={styles.mediaBox}>
      <div style={styles.mediaPlaceholder}>
        <span style={styles.placeholderIcon}>🍽️</span>
        <span style={styles.placeholderText}>{nombre || 'Plato'}</span>
      </div>
    </div>
  );
}

// ============================================
// ESTILOS
// ============================================
const styles = {
  mediaBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'var(--crema-tropical)'
  },
  mediaVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
    color: 'var(--verde-selva)',
    gap: '0.5rem'
  },
  placeholderIcon: {
    fontSize: '2rem'
  },
  placeholderText: {
    fontSize: '0.9rem',
    fontWeight: '600'
  }
};