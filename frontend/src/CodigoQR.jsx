import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function CodigoQR({ valor, tamaño = 120 }) {
  const qrRef = useRef();

  return (
    <div style={styles.container}>
      <QRCodeCanvas
        ref={qrRef}
        value={valor}
        size={tamaño}
        bgColor="#1a0a0a"        // fondo oscuro (gótico)
        fgColor="#FFD700"        // dorado místico
        level="H"
        includeMargin={true}
      />
      <div style={styles.glow} />
      <span style={styles.sigil}>🜍</span>  {/* Símbolo místico */}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    padding: '8px',
    background: 'linear-gradient(135deg, #2a0a0a, #1a0a0a)',
    borderRadius: '20px',
    boxShadow: '0 0 15px rgba(255,215,0,0.3)',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '20px',
    boxShadow: 'inset 0 0 10px rgba(255,215,0,0.2)',
    pointerEvents: 'none',
  },
  sigil: {
    position: 'absolute',
    bottom: '-12px',
    right: '-8px',
    fontSize: '1rem',
    color: '#FFD700',
    opacity: 0.6,
    fontFamily: 'serif',
    textShadow: '0 0 4px #FFD700',
  },
};