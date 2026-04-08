import { useState } from 'react';

export default function ImageUploader({ comercioId, onImageUploaded, compact = false }) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  const validarArchivo = (file) => {
    const formatosValidos = ['image/jpeg', 'image/png', 'image/webp'];
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB

    if (!formatosValidos.includes(file.type)) {
      return { valido: false, error: '❌ Formato no soportado. Usa JPG, PNG o WEBP' };
    }

    if (file.size > tamanoMaximo) {
      return { valido: false, error: '❌ Archivo demasiado grande. Máximo 5MB' };
    }

    return { valido: true };
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validacion = validarArchivo(file);
    if (!validacion.valido) {
      showMessage(validacion.error, 'error');
      e.target.value = '';
      return;
    }

    try {
      setIsUploading(true);
      showMessage('Procesando imagen...', 'info');

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        
        try {
          // Guardar en localStorage
          const key = `${comercioId}_miImágenes`;
          const imagenes = JSON.parse(localStorage.getItem(key) || '[]');
          
          const nuevaImagen = {
            id: Date.now(),
            url: base64,
            nombre: file.name.split('.')[0]
          };
          
          imagenes.push(nuevaImagen);
          localStorage.setItem(key, JSON.stringify(imagenes));
          
          showMessage(`✅ Imagen "${nuevaImagen.nombre}" guardada`, 'success');
          
          // Notificar al padre
          if (onImageUploaded) {
            onImageUploaded(nuevaImagen);
          }
          
          // Limpiar input
          e.target.value = '';
        } catch (error) {
          showMessage(`Error: ${error.message}`, 'error');
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        showMessage('Error leyendo archivo', 'error');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showMessage(`Error: ${error.message}`, 'error');
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
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading}
            style={styles.fileInput}
          />
          <div style={{
            ...styles.compactButton,
            opacity: isUploading ? 0.7 : 1
          }}>
            {isUploading ? '⏳' : '🖼️'} Añadir Imagen
          </div>
        </label>
      ) : (
        // Versión completa: con descripción y más detalles
        <div style={styles.container}>
          <div style={styles.uploadSectionHeader}>
            <span style={styles.uploadSectionIcon}>📸</span>
            <span style={styles.uploadSectionTitle}>Mis imágenes personalizadas</span>
          </div>
          
          <label style={styles.uploadLabel}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
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
                {isUploading ? '⏳' : '📤'}
              </div>
              <div style={styles.uploadText}>
                {isUploading ? 'Procesando imagen...' : 'Subir nueva imagen'}
              </div>
              <div style={styles.uploadSubtext}>
                JPG, PNG, WEBP • Máximo 5MB
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
    background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.15) 0%, rgba(255, 215, 0, 0.08) 100%)',
    border: '2px dashed rgba(255, 179, 71, 0.5)',
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
    color: '#01400e',
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
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
  },
  message_error: {
    background: 'rgba(255, 152, 0, 0.12)',
    color: '#e65100',
    border: '1px solid rgba(255, 152, 0, 0.3)',
    boxShadow: '0 2px 8px rgba(255, 152, 0, 0.1)'
  },
  message_info: {
    background: 'rgba(33, 150, 243, 0.12)',
    color: '#01579b',
    border: '1px solid rgba(33, 150, 243, 0.3)',
    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.1)'
  },
  compactLabel: {
    display: 'block',
    cursor: 'pointer'
  },
  compactButton: {
    background: '#e63946',
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(230, 57, 70, 0.2)',
    ':hover': {
      background: '#d62828',
      boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)'
    }
  }
};

// Agregar animación
const styleId = 'imageUploader-styles';
if (!document.getElementById(styleId)) {
  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes uploadPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    label {
      transition: all 0.3s ease;
    }
    
    label:has(input:hover) .uploadBox {
      border-color: rgba(255, 179, 71, 0.8) !important;
      background: linear-gradient(135deg, rgba(255, 179, 71, 0.2) 0%, rgba(255, 215, 0, 0.12) 100%) !important;
      box-shadow: 0 4px 16px rgba(255, 179, 71, 0.15) !important;
    }
    
    label:has(input:focus) .uploadBox {
      border-color: rgba(255, 179, 71, 1) !important;
      box-shadow: 0 0 0 4px rgba(255, 179, 71, 0.2) !important;
    }
    
    label:has(input:disabled) .uploadBox {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(styleSheet);
}
