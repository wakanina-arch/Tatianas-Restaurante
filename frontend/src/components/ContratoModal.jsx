import React from 'react';

export default function ContratoModal({ open, onClose, onAccept }) {
  if (!open) return null;

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.card} onClick={e => e.stopPropagation()}>
  {/* CABECERA CENTRADA */}
  <div style={S.header}>
    <span style={S.tridente}>🔱</span>
    <span style={S.marca}>ONE TO ONE</span>
        </div>
        <div style={{ height: '18px' }} />
  
  <h3 style={S.titulo}>📜 Contrato de Suscripción</h3>
  
  <p style={S.subtitulo}>
    <strong>CLÁUSULAS DE SUSCRIPCIÓN</strong>
  </p>
  
  <div style={S.body}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '1rem' }}>
            Documento para comercios
          </p>

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
            — Fin del contrato —
          </p>
        </div>

        <div style={S.actions}>
          <button onClick={onClose} style={S.closeBtn}>
            Cerrar
          </button>
          {onAccept && (
            <button onClick={onAccept} style={S.acceptBtn}>
              ✅ Aceptar Contrato
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  zIndex: 6000,
  display: 'flex',
  alignItems: 'center',      // ← Centrado vertical
  justifyContent: 'center',   // ← Centrado horizontal
  padding: '1rem',
},
  card: {
  background: 'rgba(20, 10, 10, 0.95)',
  borderRadius: '24px',
  padding: '1.5rem',
  width: '100%',
  maxWidth: '500px',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255, 215, 0, 0.3)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  margin: 'auto',             // ← Centrado adicional
  alignSelf: 'center',        // ← Forzar centrado
},
  titulo: {
    color: '#FFD700',
    fontSize: '1.1rem',
    margin: '0 0 1rem',
    textAlign: 'center',
    fontFamily: "'Cormorant Garamond', serif",
  },
  body: {
  flex: 1,
  overflowY: 'auto',
  color: 'rgba(255, 255, 255, 0.75)',
  fontSize: '0.9rem',
  lineHeight: 1.7,
  paddingRight: '0.5rem',
  maxHeight: '55vh',
  textAlign: 'justify',        // ← Texto justificado
  hyphens: 'auto',             // ← Guiones automáticos (mejor legibilidad)
  wordBreak: 'break-word',     // ← Evita desbordamientos
},
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    padding: '0.7rem 1.5rem',
    background: 'transparent',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '30px',
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  acceptBtn: {
    padding: '0.7rem 1.5rem',
    background: 'linear-gradient(135deg, #FFD700, #FF4500)',
    border: 'none',
    borderRadius: '30px',
    color: '#1a0a0a',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  header: {
    textAlign: 'center',
    marginTop: '1.5rem',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
},
tridente: {
  fontSize: '1.8rem',
  color: '#FFD700',
  filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
},
marca: {
  fontSize: '1.4rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #FF4500, #FFD700)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontFamily: "'Cormorant Garamond', serif",
},
subtitulo: {
  textAlign: 'left',
  marginBottom: '1rem',
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '0.7rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
},
};