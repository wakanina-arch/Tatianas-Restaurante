import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function CodigoQR({ valor, tamaño = 120 }) {
  return (
    <QRCodeCanvas
      value={valor}
      size={tamaño}
      bgColor="#FFFFFF"
      fgColor="#000000"
      level="H"
      includeMargin={true}
    />
  );
}
