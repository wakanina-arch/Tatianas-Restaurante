import { useState } from 'react';

export default function AltaComercioSimple({ onAlta, onBaja, comercio }) {
  const [nombre, setNombre] = useState(comercio?.nombre || '');
  const [logo, setLogo] = useState(comercio?.logo || null);
  const [loading, setLoading] = useState(false); // Para mostrar que está trabajando
  const [error, setError] = useState('');

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Solo imágenes por favor');
      return;
    }
    // Mantenemos la vista previa
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAlta = async () => {
    if (!nombre.trim() || !logo) {
      setError('Nombre y logo son obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    // 1. CREAMOS LA "LLAVE" ÚNICA (Hoja limpia)
    // Convertimos "Tatiana's Bar" en "tatianas-bar" para que sea su ID de carpeta y base de datos
    const comercioId = nombre.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    // 2. ESTRUCTURA DE DATOS PARA EL BACKEND
    const nuevoComercio = {
      comercioId: comercioId, // Esta es la clave para la "hoja limpia"
      nombre: nombre.trim(),
      logo: logo, // Aquí viajará la imagen (Base64) a Cloudinary
      fechaAlta: new Date().toISOString(),
      estado: 'activo'
    };

    try {
      // Enviamos al padre (que debería conectar con tu API de MongoDB/Cloudinary)
      await onAlta(nuevoComercio);
      alert(`¡Comercio ${nombre} creado con éxito! Ya tiene su espacio propio.`);
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(20,10,10,0.95)',
      borderRadius: 24,
      padding: 24,
      maxWidth: 340,
      margin: '40px auto',
      boxShadow: '0 4px 24px #0008',
      color: '#FFD700',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ marginBottom: 20 }}>Nuevo Comercio</h2>
      
      <input
        type="text"
        placeholder="Nombre comercial (Ej: Pizzería Luis)"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        disabled={loading}
        style={{
          width: '100%', padding: 12, borderRadius: 20, border: '1px solid #FFD700', 
          marginBottom: 16, background: '#1a0a0a', color: '#fff', boxSizing: 'border-box'
        }}
      />

      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: '0.8rem', marginBottom: 8 }}>Sube el logo de tu local:</p>
        {logo && (
          <img src={logo} alt="preview" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '2px solid #FFD700' }} />
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleLogo}
          style={{ fontSize: '0.8rem' }}
          disabled={loading}
        />
      </div>

      {error && <div style={{ color: '#FF4500', marginBottom: 12, fontSize: '0.9rem' }}>{error}</div>}

      <button 
        onClick={handleAlta} 
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#555' : 'linear-gradient(90deg,#FFD700,#FF4500)', 
          color: '#1a0a0a', fontWeight: 700, border: 'none', borderRadius: 20, 
          padding: '12px 0', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 12,
        }}
      >
        {loading ? 'Procesando...' : 'Dar de alta ahora'}
      </button>

      {comercio && (
        <button onClick={onBaja} style={{
          background: 'none', border: '1px solid #FF4500', color: '#FF4500', 
          borderRadius: 20, padding: '8px 24px', cursor: 'pointer', fontSize: '0.8rem'
        }}>
          Eliminar este comercio
        </button>
      )}
    </div>
  );
}
