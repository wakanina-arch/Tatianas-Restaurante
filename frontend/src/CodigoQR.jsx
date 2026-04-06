import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function CodigoQR({ valor, tamaño = 130 }) {
  return (
    <div style={styles.container}>
      <QRCodeCanvas
        value={valor}
        size={tamaño}
        bgColor="#250e0e"
fgColor="#F5F5F5"
        level="H"
        includeMargin={true}
      />
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    padding: '8px',
    //background: 'linear-gradient(135deg, rgba(26, 10, 10, 0.7), rgba(26, 10, 10, 0.9))',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    //borderRadius: '24px',
    boxShadow: '0 0 15px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.15) inset',
  },
  smoke: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '24px',
    background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none',
  },
};