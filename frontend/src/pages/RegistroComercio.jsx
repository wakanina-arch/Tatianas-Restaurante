import { useState } from 'react';

const CATEGORIAS_COCINA = [
  'Ecuatoriana',
  'Mexicana',
  'Italiana',
  'Japonesa',
  'Peruana',
  'Española',
  'Mediterránea',
  'Comida rápida',
  'Fusión',
  'Otra',
];

const PLANES = [
  { id: 'basico', nombre: 'Básico', comision: '30%', desc: 'Ideal para empezar. Sin cuota mensual.' },
  { id: 'plus', nombre: 'Plus', comision: '25%', desc: 'Menor comisión por pedido. Sin cuota mensual.' },
  { id: 'premium', nombre: 'Premium', comision: '15–20%', desc: 'Comisión mínima + servicios de marketing.' },
];

export default function RegistroComercio({ onRegistro, onBack, onIrAlPanel }) {
  const [step, setStep] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [mostrarContrato, setMostrarContrato] = useState(false);
  const [contratoLeido, setContratoLeido] = useState(false);
  const [formData, setFormData] = useState({
    nombreComercio: '',
    propietario: '',
    nifCif: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    categoriaCocina: '',
    descripcion: '',
    horarioApertura: '08:00',
    horarioCierre: '22:00',
    plan: '',
    logo: '',
    confirmaLicencias: false,
    confirmaPreciosReales: false,
    aceptaTerminos: false,
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarStep1 = () => {
    const err = {};
    if (!formData.nombreComercio.trim()) err.nombreComercio = 'Nombre del comercio requerido';
    if (!formData.propietario.trim()) err.propietario = 'Nombre del propietario requerido';
    if (!formData.nifCif.trim()) err.nifCif = 'NIF/CIF requerido';
    if (!formData.email.trim()) {
      err.email = 'Email requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = 'Email no válido';
    }
    if (!formData.telefono.trim()) err.telefono = 'Teléfono requerido';
    if (!formData.logo) err.logo = 'Sube el logo de tu negocio';
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const validarStep2 = () => {
    const err = {};
    if (!formData.direccion.trim()) err.direccion = 'Dirección requerida';
    if (!formData.ciudad.trim()) err.ciudad = 'Ciudad requerida';
    if (!formData.categoriaCocina) err.categoriaCocina = 'Selecciona una categoría';
    if (!formData.plan) err.plan = 'Selecciona un plan';
    if (!formData.confirmaLicencias) err.confirmaLicencias = 'Debes confirmar las licencias';
    if (!formData.confirmaPreciosReales) err.confirmaPreciosReales = 'Debes confirmar la correspondencia de precios';
    if (!contratoLeido) err.aceptaTerminos = 'Debes leer el contrato antes de aceptar';
    else if (!formData.aceptaTerminos) err.aceptaTerminos = 'Debes aceptar los términos';
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validarStep1()) setStep(2);
  };

  // Comprime y recorta la imagen al aspect ratio de la card (10:7 ≈ 400×280)
  const comprimirImagen = (file, targetW = 280, targetH = 196) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');

          // Calcular crop centrado (simula object-fit: cover)
          const targetRatio = targetW / targetH;
          const imgRatio = img.width / img.height;
          let sx, sy, sw, sh;
          if (imgRatio > targetRatio) {
            // Imagen más ancha: recortar lados
            sh = img.height;
            sw = img.height * targetRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
          } else {
            // Imagen más alta: recortar arriba/abajo
            sw = img.width;
            sh = img.width / targetRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
          }

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setErrores(prev => ({ ...prev, logo: 'Solo se permiten imágenes' }));
      return;
    }
    // Validar tamaño (max 5MB original)
    if (file.size > 5 * 1024 * 1024) {
      setErrores(prev => ({ ...prev, logo: 'Máximo 5MB' }));
      return;
    }

    try {
      const base64Comprimido = await comprimirImagen(file);
      setFormData(prev => ({ ...prev, logo: base64Comprimido }));
      setLogoPreview(base64Comprimido);
      setErrores(prev => ({ ...prev, logo: '' }));
    } catch {
      setErrores(prev => ({ ...prev, logo: 'Error al procesar la imagen' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarStep2()) return;

    setEnviando(true);
    setErrorGeneral('');
    try {
      // Guardar en localStorage como registro pendiente
      const registros = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
      const nuevoRegistro = {
        ...formData,
        id: Date.now(),
        estado: 'pendiente',
        fechaRegistro: new Date().toISOString(),
      };
      registros.push(nuevoRegistro);
      localStorage.setItem('registros_comercios', JSON.stringify(registros));

      setExito(true);
      if (onRegistro) onRegistro(nuevoRegistro);
    } catch (error) {
      console.error('Error al registrar:', error);
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        setErrorGeneral('Almacenamiento lleno. Intenta con un logo más pequeño.');
      } else {
        setErrorGeneral('Error al registrar. Inténtalo de nuevo.');
      }
    } finally {
      setEnviando(false);
    }
  };

  // Pantalla de éxito
  if (exito) {
    // Obtener el ID del comercio recién registrado
    const registros = JSON.parse(localStorage.getItem('registros_comercios') || '[]');
    const ultimoRegistro = registros[registros.length - 1];
    const nuevoComercioId = ultimoRegistro?.id;

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.exitoContainer}>
            <span style={styles.exitoIcon}>🎉</span>
            <h2 style={styles.exitoTitle}>¡Registro exitoso!</h2>
            <p style={styles.exitoText}>
              <strong>{formData.nombreComercio}</strong> está listo.
              Ahora configura tu menú y empieza a recibir pedidos.
            </p>
            <button
              onClick={() => onIrAlPanel && onIrAlPanel(nuevoComercioId)}
              style={styles.button}
            >
              🚀 Configurar mi negocio
            </button>
            <button onClick={onBack} style={styles.linkButton}>
              Hacerlo después
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.icon}>🏪</span>
          <h2 style={styles.title}>Inscribir Comercio</h2>
          <p style={styles.subtitle}>
            Únete a la plataforma y empieza a recibir pedidos
          </p>
        </div>

        {/* Indicador de pasos */}
        <div style={styles.stepsBar}>
          <div style={{
            ...styles.stepDot,
            background: step >= 1 ? 'linear-gradient(135deg, #FFD700, #FF4500)' : 'rgba(255,255,255,0.15)',
            color: step >= 1 ? '#1a0a0a' : '#999',
          }}>1</div>
          <div style={{
            ...styles.stepLine,
            background: step >= 2 ? '#FFD700' : 'rgba(255,255,255,0.15)',
          }} />
          <div style={{
            ...styles.stepDot,
            background: step >= 2 ? 'linear-gradient(135deg, #FFD700, #FF4500)' : 'rgba(255,255,255,0.15)',
            color: step >= 2 ? '#1a0a0a' : '#999',
          }}>2</div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* === PASO 1: Datos básicos === */}
          {step === 1 && (
            <>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Nombre del comercio</label>
                <input
                  name="nombreComercio"
                  value={formData.nombreComercio}
                  onChange={handleChange}
                  placeholder="Ej: Restaurante El Sabor"
                  style={styles.input}
                  autoFocus
                />
                {errores.nombreComercio && <span style={styles.error}>{errores.nombreComercio}</span>}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Nombre del propietario</label>
                <input
                  name="propietario"
                  value={formData.propietario}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  style={styles.input}
                />
                {errores.propietario && <span style={styles.error}>{errores.propietario}</span>}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>NIF / CIF</label>
                <input
                  name="nifCif"
                  value={formData.nifCif}
                  onChange={handleChange}
                  placeholder="Identificación fiscal del negocio"
                  style={styles.input}
                />
                {errores.nifCif && <span style={styles.error}>{errores.nifCif}</span>}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email de contacto</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  style={styles.input}
                />
                {errores.email && <span style={styles.error}>{errores.email}</span>}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Teléfono</label>
                <input
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+593 999 999 999"
                  style={styles.input}
                />
                {errores.telefono && <span style={styles.error}>{errores.telefono}</span>}
              </div>

              {/* Logo upload */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Logo de tu negocio</label>
                <div style={styles.logoUploadArea}>
                  {logoPreview ? (
                    <div style={styles.logoPreviewWrapper}>
                      <img src={logoPreview} alt="Logo preview" style={styles.logoPreviewImg} />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setFormData(prev => ({ ...prev, logo: '' }));
                        }}
                        style={styles.logoRemoveBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label style={styles.logoDropZone}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                      />
                      <span style={styles.logoDropIcon}>📷</span>
                      <span style={styles.logoDropText}>Toca para subir tu logo</span>
                      <span style={styles.logoDropHint}>JPG, PNG · Máx 2MB</span>
                    </label>
                  )}
                </div>
                {errores.logo && <span style={styles.error}>{errores.logo}</span>}
              </div>

              <button type="button" onClick={handleNext} style={styles.button}>
                Siguiente →
              </button>
            </>
          )}

          {/* === PASO 2: Ubicación y detalles === */}
          {step === 2 && (
            <>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Dirección</label>
                <input
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle, número, referencia"
                  style={styles.input}
                />
                {errores.direccion && <span style={styles.error}>{errores.direccion}</span>}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Ciudad</label>
                <input
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ej: Quito, Guayaquil, Cuenca..."
                  style={styles.input}
                />
                {errores.ciudad && <span style={styles.error}>{errores.ciudad}</span>}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Tipo de cocina</label>
                <select
                  name="categoriaCocina"
                  value={formData.categoriaCocina}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Selecciona categoría...</option>
                  {CATEGORIAS_COCINA.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errores.categoriaCocina && <span style={styles.error}>{errores.categoriaCocina}</span>}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Descripción breve (opcional)</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre tu negocio..."
                  style={styles.textarea}
                  rows={3}
                />
              </div>

              <div style={styles.horarioRow}>
                <div style={styles.horarioField}>
                  <label style={styles.label}>Apertura</label>
                  <input
                    name="horarioApertura"
                    type="time"
                    value={formData.horarioApertura}
                    onChange={handleChange}
                    style={styles.inputTime}
                  />
                </div>
                <div style={styles.horarioField}>
                  <label style={styles.label}>Cierre</label>
                  <input
                    name="horarioCierre"
                    type="time"
                    value={formData.horarioCierre}
                    onChange={handleChange}
                    style={styles.inputTime}
                  />
                </div>
              </div>

              {/* Plan de suscripción */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Plan de suscripción</label>
                <div style={styles.planesGrid}>
                  {PLANES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, plan: p.id }));
                        if (errores.plan) setErrores(prev => ({ ...prev, plan: '' }));
                      }}
                      style={{
                        ...styles.planCard,
                        ...(formData.plan === p.id ? styles.planCardActivo : {}),
                      }}
                    >
                      <span style={styles.planNombre}>{p.nombre}</span>
                      <span style={styles.planComision}>{p.comision}</span>
                      <span style={styles.planDesc}>{p.desc}</span>
                    </button>
                  ))}
                </div>
                {errores.plan && <span style={styles.error}>{errores.plan}</span>}
              </div>

              {/* Verificación de cumplimiento */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Verificación de cumplimiento</label>
                <label style={styles.checkboxLabel}>
                  <input
                    name="confirmaLicencias"
                    type="checkbox"
                    checked={formData.confirmaLicencias}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  Confirmo que el restaurante cumple con todas las licencias de apertura y actividad
                </label>
                {errores.confirmaLicencias && <span style={styles.error}>{errores.confirmaLicencias}</span>}

                <label style={styles.checkboxLabel}>
                  <input
                    name="confirmaPreciosReales"
                    type="checkbox"
                    checked={formData.confirmaPreciosReales}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  Confirmo que los precios de la app se corresponden con los del local físico
                </label>
                {errores.confirmaPreciosReales && <span style={styles.error}>{errores.confirmaPreciosReales}</span>}
              </div>

              <label style={styles.checkboxLabel}>
                <input
                  name="aceptaTerminos"
                  type="checkbox"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  style={styles.checkbox}
                  disabled={!contratoLeido}
                />
                <span>
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setMostrarContrato(true)}
                    style={styles.contratoLink}
                  >
                    términos y condiciones
                  </button>
                  {' '}de la plataforma
                  {!contratoLeido && (
                    <span style={styles.leerObligatorio}> (lectura obligatoria)</span>
                  )}
                </span>
              </label>
              {errores.aceptaTerminos && <span style={styles.error}>{errores.aceptaTerminos}</span>}

              {/* Modal de contrato */}
              {mostrarContrato && (
                <div style={styles.contratoOverlay}>
                  <div style={styles.contratoCard}>
                    <h3 style={styles.contratoTitulo}>📜 Contrato de Uso — ONE TO ONE</h3>
                    <div
                      style={styles.contratoBody}
                      onScroll={(e) => {
                        const el = e.target;
                        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
                          setContratoLeido(true);
                        }
                      }}
                    >
                      <p style={{ textAlign: 'center', marginBottom: '0.5rem' }}><strong>CLÁUSULAS DE SUSCRIPCIÓN — ONE TO ONE</strong></p>
                      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '1rem' }}>Documento para comercios</p>

                      <p><strong>1. Definición del Servicio y Objeto del Contrato</strong></p>
                      <p>La plataforma One To One actúa como intermediario tecnológico que conecta tu restaurante con nuevos clientes en Ecuador. A través de la aplicación, los usuarios pueden descubrir tu negocio, realizar pedidos para recogida en local o entrega a domicilio, y realizar pagos de forma segura.</p>
                      <ul>
                        <li><strong>Nuestro papel:</strong> Te ofrecemos la infraestructura digital (app, pasarela de pago, sistema de gestión de pedidos) y el acceso a una base de clientes activos.</li>
                        <li><strong>Tu papel:</strong> Sigues siendo el propietario absoluto de tu negocio. Eres el único responsable de la preparación de los alimentos, su calidad, el cumplimiento de las normativas sanitarias de la ARCSA, y la experiencia del cliente en el punto de venta.</li>
                      </ul>

                      <p><strong>2. Modelo Económico: Comisiones y Transparencia</strong></p>
                      <p>El modelo de ingresos se basa en una comisión sobre el valor de cada pedido completado con éxito, que varía entre el 15% y el 30% según el plan elegido.</p>
                      <ul>
                        <li>La comisión cubre: marketing, procesamiento de pagos, soporte técnico 24/7 y logística de coordinación.</li>
                        <li>Si utilizas el servicio de reparto, puede aplicarse una tarifa adicional por entrega.</li>
                        <li>No se aplican costes ocultos. Todo gasto será comunicado y aceptado previamente.</li>
                      </ul>

                      <p><strong>3. Responsabilidades sobre Repartidores</strong></p>
                      <ul>
                        <li>Si contratas nuestro servicio de reparto, gestionamos la relación con los repartidores mediante contratos de servicios según el Código de Comercio ecuatoriano.</li>
                        <li>Si realizas envíos con personal propio, tú serás responsable de cumplir con las obligaciones laborales y de seguridad social.</li>
                      </ul>
                      <p style={{ color: '#FF4500', fontSize: '0.75rem' }}>⚠ Algunos municipios regulan la actividad de reparto mediante ordenanzas municipales. Revisa la normativa local de tu ciudad.</p>

                      <p><strong>4. Propiedad Intelectual: Tus Recetas y Tu Marca</strong></p>
                      <ul>
                        <li>Las fotografías, descripciones creativas y el diseño de tu carta digital son propiedad tuya, protegidos por la Ley de Propiedad Intelectual de Ecuador.</li>
                        <li>Al asociarte, nos concedes una licencia limitada y no exclusiva para mostrar tu negocio dentro de la app y promocionarlo en canales oficiales.</li>
                        <li>Nos comprometemos a no divulgar ni utilizar tus procesos internos para beneficio propio.</li>
                      </ul>

                      <p><strong>5. Protección de Datos y Privacidad (LOPDP)</strong></p>
                      <p>Cumplir con la Ley Orgánica de Protección de Datos Personales es prioridad:</p>
                      <ul>
                        <li>La plataforma trata los datos de clientes (nombre, dirección, historial de pedidos) exclusivamente para gestionar pedidos, cumpliendo la LOPDP.</li>
                        <li>Implementamos medidas de seguridad técnicas para garantizar confidencialidad, integridad y disponibilidad de los datos.</li>
                        <li>La plataforma obtiene el consentimiento explícito del cliente para el tratamiento de sus datos.</li>
                      </ul>

                      <p><strong>6. Duración, Renovación y Rescisión</strong></p>
                      <ul>
                        <li>Duración inicial de 12 meses con renovación automática anual.</li>
                        <li>No renovación: comunicar con al menos 30 días de antelación.</li>
                        <li>Rescisión anticipada por incumplimiento grave (ej: impago de comisiones o caída del servicio por más de 72 horas).</li>
                        <li>Sin penalizaciones por rescisión anticipada. Se liquidarán las comisiones devengadas hasta la fecha de baja.</li>
                      </ul>

                      <p><strong>7. Legislación Aplicable y Resolución de Conflictos</strong></p>
                      <ul>
                        <li>Legislación aplicable: República del Ecuador.</li>
                        <li>Resolución: mediación previa obligatoria. Si no hay acuerdo, jurisdicción de los juzgados de tu ciudad.</li>
                        <li>Este contrato electrónico tiene plena validez conforme a la Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos de Ecuador.</li>
                      </ul>

                      <p><strong>8. Cumplimiento de la Ley de Defensa del Consumidor</strong></p>
                      <ul>
                        <li>Debes proporcionar información precisa sobre precios, ingredientes, alérgenos y tiempos de entrega.</li>
                        <li>Prohibido eximir o atenuar responsabilidad por vicios de bienes o servicios.</li>
                        <li>Actuar de buena fe y evitar prácticas abusivas.</li>
                      </ul>

                      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '1.5rem', fontSize: '0.75rem' }}>
                        — Desplaza hasta el final para poder aceptar —
                      </p>
                    </div>

                    <div style={styles.contratoBotones}>
                      {contratoLeido && (
                        <span style={styles.contratoLeidoMsg}>✅ Contrato leído</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setMostrarContrato(false)}
                        style={styles.contratoCerrarBtn}
                      >
                        {contratoLeido ? 'Aceptar y cerrar' : 'Cerrar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {errorGeneral && (
                <div style={styles.errorGeneral}>{errorGeneral}</div>
              )}

              <button
                type="submit"
                disabled={enviando}
                style={{
                  ...styles.button,
                  opacity: enviando ? 0.6 : 1,
                  cursor: enviando ? 'not-allowed' : 'pointer',
                }}
              >
                {enviando ? 'Enviando...' : '🚀 Registrar comercio'}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setErrores({}); }}
                style={styles.backButton}
              >
                ← Paso anterior
              </button>
            </>
          )}

          <button type="button" onClick={onBack} style={styles.linkButton}>
            Ya tengo cuenta · Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// ESTILOS — Consistentes con LoginComercio
// ============================================
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
    maxWidth: '440px',
    border: '1px solid rgba(255,215,0,0.2)',
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
    color: '#FFD700',
    fontSize: '1.5rem',
    margin: '0 0 0.3rem',
    fontFamily: "'Cormorant Garamond', serif",
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.85rem',
    margin: 0,
  },
  stepsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
    marginBottom: '1.5rem',
  },
  stepDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
    transition: 'all 0.3s ease',
  },
  stepLine: {
    width: '60px',
    height: '3px',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    paddingLeft: '0.5rem',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '30px',
    border: '1px solid rgba(255,215,0,0.3)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    padding: '0.8rem 1rem',
    borderRadius: '30px',
    border: '1px solid rgba(255,215,0,0.3)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23FFD700\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem',
  },
  textarea: {
    padding: '0.8rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,215,0,0.3)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  horarioRow: {
    display: 'flex',
    gap: '1rem',
  },
  horarioField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  inputTime: {
    padding: '0.8rem 1rem',
    borderRadius: '30px',
    border: '1px solid rgba(255,215,0,0.3)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#FFD700',
    width: '18px',
    height: '18px',
    flexShrink: 0,
  },
  error: {
    color: '#FF4500',
    fontSize: '0.75rem',
    paddingLeft: '0.5rem',
  },
  errorGeneral: {
    background: 'rgba(255,69,0,0.15)',
    border: '1px solid rgba(255,69,0,0.4)',
    color: '#FF4500',
    padding: '0.8rem 1rem',
    borderRadius: '16px',
    fontSize: '0.85rem',
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #FFD700, #FF4500)',
    border: 'none',
    borderRadius: '30px',
    color: '#1a0a0a',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
  linkButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,215,0,0.6)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '0.5rem',
  },
  exitoContainer: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 0',
  },
  exitoIcon: {
    fontSize: '3rem',
  },
  exitoTitle: {
    color: '#FFD700',
    fontSize: '1.5rem',
    margin: 0,
    fontFamily: "'Cormorant Garamond', serif",
  },
  exitoText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    margin: 0,
  },
  logoUploadArea: {
    marginTop: '0.3rem',
  },
  logoPreviewWrapper: {
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: '0 auto',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '2px solid rgba(255,215,0,0.4)',
  },
  logoPreviewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  logoRemoveBtn: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255,59,48,0.9)',
    color: 'white',
    border: 'none',
    fontSize: '0.7rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '1.2rem',
    borderRadius: '20px',
    border: '2px dashed rgba(255,215,0,0.3)',
    background: 'rgba(255,215,0,0.04)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  logoDropIcon: {
    fontSize: '1.8rem',
  },
  logoDropText: {
    color: '#FFD700',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  logoDropHint: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.7rem',
  },
  contratoLink: {
    background: 'none',
    border: 'none',
    color: '#FFD700',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontWeight: '600',
    padding: 0,
  },
  leerObligatorio: {
    color: '#FF4500',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  planesGrid: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.3rem',
  },
  planCard: {
    flex: 1,
    padding: '0.7rem 0.5rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,215,0,0.15)',
    borderRadius: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    transition: 'all 0.2s ease',
  },
  planCardActivo: {
    background: 'rgba(255,215,0,0.1)',
    border: '1px solid rgba(255,215,0,0.6)',
    boxShadow: '0 0 12px rgba(255,215,0,0.15)',
  },
  planNombre: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: '0.85rem',
  },
  planComision: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '800',
  },
  planDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.6rem',
    lineHeight: 1.3,
  },
  contratoOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 5000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  contratoCard: {
    background: 'rgba(20, 10, 10, 0.95)',
    borderRadius: '24px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255,215,0,0.3)',
  },
  contratoTitulo: {
    color: '#FFD700',
    fontSize: '1.1rem',
    margin: '0 0 1rem',
    textAlign: 'center',
    fontFamily: "'Cormorant Garamond', serif",
  },
  contratoBody: {
    flex: 1,
    overflowY: 'auto',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.8rem',
    lineHeight: 1.7,
    paddingRight: '0.5rem',
    maxHeight: '55vh',
  },
  contratoBotones: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1rem',
    gap: '1rem',
  },
  contratoLeidoMsg: {
    color: '#4CAF50',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  contratoCerrarBtn: {
    padding: '0.7rem 1.5rem',
    background: 'linear-gradient(135deg, #FFD700, #FF4500)',
    border: 'none',
    borderRadius: '30px',
    color: '#1a0a0a',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
};
