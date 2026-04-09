import React, { useState } from 'react';

export default function LoginComercio({ onLogin, onBack }) {
  const [comercioId, setComercioId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comercioId.trim()) {
      setError('Ingresa el ID del comercio');
      return;
    }
    // Intentar parsear como número si es numérico (los IDs de registro son Date.now())
    const parsed = /^\d+$/.test(comercioId.trim()) ? Number(comercioId.trim()) : comercioId.trim();
    onLogin(parsed);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🔱</span>
          <h2 style={styles.title}>Acceso Comercios</h2>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="ID del comercio (ej: 1, 2, 3...)"
            value={comercioId}
            onChange={(e) => {
              setComercioId(e.target.value);
              setError('');
            }}
            style={styles.input}
            autoFocus
          />
          {error && <p style={styles.error}>{error}</p>}
          
          <button type="submit" style={styles.button}>
            Entrar al Panel
          </button>
          <button type="button" onClick={onBack} style={styles.backButton}>
            ← Volver
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)',
    padding: '1rem',
  },
  card: {
    background: 'rgba(20, 10, 10, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255,215,0,0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  icon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  title: {
    color: '#FFD700',
    fontSize: '1.5rem',
    margin: 0,
    fontFamily: "'Cormorant Garamond', serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '30px',
    border: '1px solid rgba(255,215,0,0.3)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  error: {
    color: '#FF4500',
    fontSize: '0.8rem',
    margin: 0,
    textAlign: 'center',
  },
  button: {
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #FFD700, #FF4500)',
    border: 'none',
    borderRadius: '30px',
    color: '#1a0a0a',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  backButton: {
    padding: '0.8rem',
    background: 'transparent',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: '30px',
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
