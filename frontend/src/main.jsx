/**
 * ARCHIVO PRINCIPAL - ONE TO ONE RESTAURANT
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './unified-styles.css';  // ← UNA SOLA VEZ
import App from './App.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('❌ No se encontró el elemento "root"');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Debug en desarrollo
if (import.meta.env?.MODE === 'development') {
  console.log('%c🍽️ One To One Restaurant - Modo Desarrollo', 'color: #01400e; font-size: 16px; font-weight: bold;');
  console.log('Versión: 1.0.0', 'color: #ff6b35; font-size: 12px;');
}

// Manejo de errores
window.addEventListener('error', (event) => {
  console.error('Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('⚠️ Promesa rechazada:', event.reason);
});