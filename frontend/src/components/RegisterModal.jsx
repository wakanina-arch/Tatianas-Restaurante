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
      // Recargar la página para resetear el estado
      window.location.reload();
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        
        <h2 style={styles.title}>
          {modo === 'registro' ? 'REGISTRO' : 'EDITAR PERFIL'}
        </h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required={modo === 'registro'}
            style={styles.input}
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required={modo === 'registro'}
            style={styles.input}
          />
          
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            style={styles.input}
          />
          
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            style={styles.input}
          />
          
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

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modal: {
    background: 'linear-gradient(135deg, #8B4513, #492b2b)',
    padding: '2rem', borderRadius: '30px', maxWidth: '400px', width: '90%',
    position: 'relative', border: '2px solid #FFD700', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
  },
  closeBtn: {
    position: 'absolute', top: '10px', right: '10px',
    background: 'var(--rojo-cierre)', color: 'white',
    border: 'none', borderRadius: '50%', width: '30px', height: '30px',
    cursor: 'pointer', fontSize: '1rem', display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  },
  title: {
    color: '#FFD700', textAlign: 'center', marginBottom: '1.5rem',
    fontSize: '1.3rem', letterSpacing: '2px'
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: '1rem'
  },
  input: {
    padding: '0.8rem', borderRadius: '10px', border: 'none',
    background: 'rgba(255,255,255,0.9)', fontSize: '1rem'
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#492b2b', border: 'none', padding: '0.8rem',
    borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer',
    marginTop: '1rem'
  },
  logoutBtn: {
    background: 'transparent', color: '#ff4757', border: '2px solid #ff4757',
    padding: '0.8rem', borderRadius: '30px', fontWeight: 'bold',
    cursor: 'pointer', marginTop: '0.5rem'
  },
  terms: {
    color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem',
    textAlign: 'center', marginTop: '1rem'
  }
};