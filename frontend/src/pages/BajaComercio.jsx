import { useState } from 'react';

const MOTIVOS_BAJA = [
  'Cierre temporal del negocio',
  'Cierre definitivo del negocio',
  'No cumple mis expectativas',
  'Problemas técnicos recurrentes',
  'Costos de servicio',
  'Cambio de plataforma',
  'Otro motivo',
];

export default function BajaComercio({ comercioId, nombreComercio: nombreProp, onConfirmarBaja, onCancel }) {
  // Resolver nombre real desde localStorage (evita mismatch de tipos)
  const nombreComercio = (() => {
    try {
      const registros = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
      const found = registros.find(r => String(r.id) === String(comercioId));
      return found?.nombreComercio || nombreProp || `Comercio ${comercioId}`;
    } catch { return nombreProp || `Comercio ${comercioId}`; }
  })();

  const [step, setStep] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [motivoDetalle, setMotivoDetalle] = useState('');
  const [confirmaNombre, setConfirmaNombre] = useState('');
  const [aceptaBaja, setAceptaBaja] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errores, setErrores] = useState({});

  const validarStep1 = () => {
    const err = {};
    if (!motivo) err.motivo = 'Selecciona un motivo';
    if (motivo === 'Otro motivo' && !motivoDetalle.trim()) {
      err.motivoDetalle = 'Describe tu motivo';
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const validarStep2 = () => {
    const err = {};
    if (!aceptaBaja) {
      err.aceptaBaja = 'Debes confirmar que deseas dar de baja';
    }
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validarStep2()) return;

    setProcesando(true);

    // 1. Leer registros y filtrar
    const registros = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
    const filtrados = registros.filter(r => String(r.id) !== String(comercioId));

    // 2. BORRAR todo lo asociado al comercio (removeItem NUNCA falla)
    localStorage.removeItem(`menu_comercio_${comercioId}`);
    localStorage.removeItem(`${comercioId}_miImágenes`);
    localStorage.removeItem('registros_comercios');

    // 3. Limpiar claves huérfanas
    Object.keys(localStorage).forEach(k => {
      if (k.includes(String(comercioId))) {
        localStorage.removeItem(k);
      }
    });

    // 4. Guardar lista filtrada (ya hay espacio)
    if (filtrados.length > 0) {
      localStorage.setItem('registros_comercios', JSON.stringify(filtrados));
    }

    // 5. Forzar recarga completa — evita que React re-escriba en localStorage
    window.location.href = '/';
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>⚠️</span>
          <h2 style={styles.title}>Dar de baja comercio</h2>
          <p style={styles.subtitle}>
            Esta acción eliminará <strong>{nombreComercio}</strong> de la plataforma
          </p>
        </div>

        {/* Paso 1: Motivo */}
        {step === 1 && (
          <div style={styles.form}>
            <div style={styles.advertencia}>
              <span>🔴</span>
              <p>Al darte de baja se eliminarán todos los datos de tu comercio, menú e imágenes.
              Esta acción no se puede deshacer.</p>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>¿Por qué deseas salir de la plataforma?</label>
              <div style={styles.motivosGrid}>
                {MOTIVOS_BAJA.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMotivo(m); setErrores({}); }}
                    style={{
                      ...styles.motivoBtn,
                      ...(motivo === m ? styles.motivoBtnActivo : {}),
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {errores.motivo && <span style={styles.error}>{errores.motivo}</span>}
            </div>

            {motivo === 'Otro motivo' && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Describe tu motivo</label>
                <textarea
                  value={motivoDetalle}
                  onChange={e => setMotivoDetalle(e.target.value)}
                  placeholder="Cuéntanos más..."
                  style={styles.textarea}
                  rows={3}
                />
                {errores.motivoDetalle && <span style={styles.error}>{errores.motivoDetalle}</span>}
              </div>
            )}

            <div style={styles.botones}>
              <button onClick={onCancel} style={styles.cancelBtn}>
                Cancelar
              </button>
              <button
                onClick={() => { if (validarStep1()) setStep(2); }}
                style={styles.nextBtn}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Confirmación */}
        {step === 2 && (
          <div style={styles.form}>
            <div style={styles.advertenciaFinal}>
              <span style={{ fontSize: '1.5rem' }}>🚨</span>
              <p><strong>Confirma la baja definitiva</strong></p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                Motivo: {motivo}{motivo === 'Otro motivo' ? ` — ${motivoDetalle}` : ''}
              </p>
            </div>

            <div style={styles.advertencia}>
              <span>🔴</span>
              <p>Se eliminarán permanentemente todos los datos de <strong>"{nombreComercio}"</strong>: menú, imágenes y configuración.</p>
            </div>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={aceptaBaja}
                onChange={e => { setAceptaBaja(e.target.checked); setErrores({}); }}
                style={styles.checkbox}
              />
              Confirmo que deseo dar de baja mi comercio
            </label>
            {errores.aceptaBaja && <span style={styles.error}>{errores.aceptaBaja}</span>}

            <div style={styles.botones}>
              <button onClick={() => { setStep(1); setErrores({}); }} style={styles.cancelBtn}>
                ← Volver
              </button>
              <button
                onClick={handleSubmit}
                disabled={procesando}
                style={{
                  ...styles.bajaBtn,
                  opacity: procesando ? 0.6 : 1,
                }}
              >
                {procesando ? 'Procesando...' : '🗑️ Confirmar baja definitiva'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 5000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: 'rgba(20, 10, 10, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid rgba(255,69,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  icon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  title: {
    color: '#FF4500',
    fontSize: '1.3rem',
    margin: '0 0 0.3rem',
    fontFamily: "'Cormorant Garamond', serif",
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.85rem',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  advertencia: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
    padding: '1rem',
    background: 'rgba(255,69,0,0.1)',
    border: '1px solid rgba(255,69,0,0.3)',
    borderRadius: '16px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.85rem',
    lineHeight: 1.5,
  },
  advertenciaFinal: {
    textAlign: 'center',
    padding: '1rem',
    background: 'rgba(255,0,0,0.1)',
    border: '1px solid rgba(255,0,0,0.3)',
    borderRadius: '16px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.9rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    paddingLeft: '0.5rem',
  },
  motivosGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  motivoBtn: {
    padding: '0.7rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  motivoBtnActivo: {
    background: 'rgba(255,69,0,0.2)',
    border: '1px solid rgba(255,69,0,0.5)',
    color: '#FF4500',
    fontWeight: '600',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '30px',
    border: '1px solid rgba(255,69,0,0.3)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.8rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,69,0,0.3)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  nombreReferencia: {
    color: '#FFD700',
    fontSize: '1rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0.3rem 0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    lineHeight: 1.4,
  },
  checkbox: {
    accentColor: '#FF4500',
    width: '18px',
    height: '18px',
    flexShrink: 0,
    marginTop: '2px',
  },
  error: {
    color: '#FF4500',
    fontSize: '0.75rem',
    paddingLeft: '0.5rem',
  },
  botones: {
    display: 'flex',
    gap: '0.8rem',
    marginTop: '0.5rem',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.8rem',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '30px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  nextBtn: {
    flex: 1,
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #FF4500, #cc3700)',
    border: 'none',
    borderRadius: '30px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  bajaBtn: {
    flex: 2,
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #cc0000, #880000)',
    border: 'none',
    borderRadius: '30px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};
