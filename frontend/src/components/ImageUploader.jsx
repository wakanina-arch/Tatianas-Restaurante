import { useState } from 'react';

// Configuración de Cloudinary desde variables de entorno
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploader({ comercioId, categoria, onImageUploaded, compact = true }) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const validarArchivo = (file) => {
    const formatosValidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB

    if (!formatosValidos.includes(file.type)) {
      return { valido: false, error: '❌ Formato no soportado. Usa JPG, PNG, GIF o WEBP' };
    }

    if (file.size > tamanoMaximo) {
      return { valido: false, error: '❌ Archivo demasiado grande. Máximo 5MB' };
    }

    return { valido: true };
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validacion = validarArchivo(file);
    if (!validacion.valido) {
      showMessage(validacion.error, 'error');
      e.target.value = '';
      return;
    }

    try {
      setIsUploading(true);
      showMessage('⏳ Subiendo imagen a Cloudinary...', 'info');

      // Crear FormData para Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', `one_to_one/${categoria || 'general'}`);

      // Subir a Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error(data.error?.message || 'Error al subir la imagen');
      }

      // Guardar en localStorage para mantener catálogo personal
      const key = `${comercioId || 'default'}_miImagenes`;
      const imagenes = JSON.parse(localStorage.getItem(key) || '[]');
      
      const nuevaImagen = {
        id: data.public_id,
        url: data.secure_url,
        nombre: file.name.split('.')[0]
      };
      
      imagenes.push(nuevaImagen);
      localStorage.setItem(key, JSON.stringify(imagenes));
      
      showMessage(`✅ Imagen "${nuevaImagen.nombre}" subida correctamente`, 'success');
      
      // Notificar al componente padre
      if (onImageUploaded) {
        onImageUploaded(data.secure_url);
      }
      
      e.target.value = '';
    } catch (error) {
      console.error('Error subiendo a Cloudinary:', error);
      showMessage(`❌ Error: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    if (type !== 'info') {
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <>
      {compact ? (
        // Versión compacta: solo botón rojo
        <label style={styles.compactLabel}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={isUploading}
            style={styles.fileInput}
          />
          <div style={{
            ...styles.compactButton,
            opacity: isUploading ? 0.7 : 1,
            cursor: isUploading ? 'wait' : 'pointer'
          }}>
            {isUploading ? '⏳ Subiendo...' : '🖼️ Añadir Imagen'}
          </div>
          {message && messageType === 'error' && (
            <div style={styles.errorTooltip}>{message}</div>
          )}
        </label>
      ) : (
        // Versión completa
        <div style={styles.container}>
          <div style={styles.uploadSectionHeader}>
            <span style={styles.uploadSectionIcon}>☁️</span>
            <span style={styles.uploadSectionTitle}>Subir a Cloudinary</span>
          </div>
          
          <label style={styles.uploadLabel}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              disabled={isUploading}
              style={styles.fileInput}
            />
            <div style={{
              ...styles.uploadBox,
              opacity: isUploading ? 0.6 : 1,
              pointerEvents: isUploading ? 'none' : 'auto'
            }}>
              <div style={styles.uploadIcon}>
                {isUploading ? '⏳' : '☁️'}
              </div>
              <div style={styles.uploadText}>
                {isUploading ? 'Subiendo a Cloudinary...' : 'Subir nueva imagen'}
              </div>
              <div style={styles.uploadSubtext}>
                JPG, PNG, GIF, WEBP • Máximo 5MB
              </div>
            </div>
          </label>

          {message && (
            <div style={{...styles.message, ...styles[`message_${messageType}`]}}>
              <span>{message}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    marginBottom: '2rem',
    padding: '1.2rem',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '24px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  uploadSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1rem',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid rgba(255, 179, 71, 0.2)'
  },
  uploadSectionIcon: {
    fontSize: '1.2rem'
  },
  uploadSectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#01400e',
    letterSpacing: '0.3px',
    textTransform: 'uppercase'
  },
  uploadLabel: {
    display: 'block',
    cursor: 'pointer'
  },
  fileInput: {
    display: 'none'
  },
  uploadBox: {
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)',
    border: '2px dashed rgba(59, 130, 246, 0.5)',
    borderRadius: '20px',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem'
  },
  uploadIcon: {
    fontSize: '3rem',
    opacity: 0.9
  },
  uploadText: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e3a8a',
    letterSpacing: '0.3px'
  },
  uploadSubtext: {
    fontSize: '0.8rem',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '500'
  },
  message: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '16px',
    fontSize: '0.9rem',
    textAlign: 'center',
    animation: 'slideIn 0.3s ease',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  message_success: {
    background: 'rgba(76, 175, 80, 0.12)',
    color: '#1b5e20',
    border: '1px solid rgba(76, 175, 80, 0.3)',
  },
  message_error: {
    background: 'rgba(230, 57, 70, 0.12)',
    color: '#b91c1c',
    border: '1px solid rgba(230, 57, 70, 0.3)',
  },
  message_info: {
    background: 'rgba(59, 130, 246, 0.12)',
    color: '#1e40af',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
  compactLabel: {
    display: 'inline-block',
    cursor: 'pointer',
    position: 'relative'
  },
  compactButton: {
    background: '#e63946',
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    border: 'none',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    whiteSpace: 'nowrap',
    boxShadow: 'rgba(230, 57, 70, 0.2) 0px 2px 8px',
  },
  errorTooltip: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '8px',
    padding: '8px 12px',
    background: '#b91c1c',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  }
};

// Agregar animación
const styleId = 'imageUploader-cloudinary-styles';
if (!document.getElementById(styleId)) {
  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);
}