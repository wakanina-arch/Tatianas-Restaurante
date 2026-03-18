// components/RegisterModal.jsx
import React, { useState, useEffect } from 'react';

export default function RegisterModal({ open, onClose, onRegister, modo = 'registro', usuario = null }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  // Cargar datos del usuario si estamos en modo edición
  useEffect(() => {
    if (modo === 'editar' && usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || ''
      });
    }
  }, [modo, usuario]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData, modo);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('oneToOneUser');
      onRegister(null, 'logout');
      onClose();
      window.location.reload();
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        
        <h2 style={styles.title}>
          {modo === 'registro' ? '✨ REGISTRO' : '👤 EDITAR PERFIL'}
        </h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required={modo === 'registro'}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              required={modo === 'registro'}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              placeholder="09XXXXXXXX"
              value={formData.telefono}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Dirección</label>
            <input
              type="text"
              name="direccion"
              placeholder="Calle, número, ciudad"
              value={formData.direccion}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          
          <button type="submit" style={styles.submitBtn}>
            {modo === 'registro' ? 'REGISTRARSE' : 'GUARDAR CAMBIOS'}
          </button>
          
          {modo === 'editar' && (
            <button 
              type="button" 
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              CERRAR SESIÓN
            </button>
          )}
        </form>
        
        {modo === 'registro' && (
          <p style={styles.terms}>
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// ESTILOS IPHONE 16
// ============================================
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  modal: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '2rem',
    borderRadius: '32px',
    maxWidth: '400px',
    width: '90%',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0, 0, 0, 0.05)',
    border: 'none',
    borderRadius: '20px',
    width: '36px',
    height: '36px',
    color: '#666',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  title: {
    color: 'var(--verde-selva)',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.3rem',
    fontWeight: '600',
    letterSpacing: '1px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--gris-texto)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginLeft: '0.5rem'
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.95rem',
    background: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease'
  },
  submitBtn: {
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #2a6b2f 100%)',
    color: 'white',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(1, 64, 14, 0.2)'
  },
  logoutBtn: {
    background: 'transparent',
    color: '#ff3b30',
    border: '1px solid rgba(255, 59, 48, 0.3)',
    padding: '0.8rem',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.2s ease'
  },
  terms: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: '0.7rem',
    textAlign: 'center',
    marginTop: '1rem',
    fontStyle: 'italic'
  }
};

// Estilos hover (se pueden agregar como clases o con eventos)
const hoverStyles = `
  .close-btn:hover {
    background: rgba(0, 0, 0, 0.1) !important;
  }
  
  input:focus {
    border-color: var(--maracuya) !important;
    box-shadow: 0 0 0 3px rgba(255, 179, 71, 0.1) !important;
    outline: none;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(1, 64, 14, 0.3) !important;
  }
  
  .logout-btn:hover {
    background: rgba(255, 59, 48, 0.05) !important;
    border-color: #ff3b30 !important;
  }
`;