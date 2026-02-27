/**
 * ARCHIVO PRINCIPAL - ONE TO ONE RESTAURANT
 * Punto de entrada de la aplicación
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
// En main.jsx
import './unified-styles.css';


// Componente principal
import App from './App.jsx';

// Estilos globales unificados
import './unified-styles.css';

// ============================================
// CONFIGURACIÓN DEL ENTORNO
// ============================================

// Validación del elemento root
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '❌ Error crítico: No se encontró el elemento "root" en el DOM. ' +
    'Verifica que exista un div con id="root" en tu archivo HTML.'
  );
}

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

/**
 * Crea y renderiza la aplicación React en el DOM
 * Utiliza React StrictMode para mejores prácticas de desarrollo
 */
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ============================================
// REGISTRO DE INFORMACIÓN (SOLO EN DESARROLLO)
// ============================================

if (import.meta.env?.MODE === 'development' || process.env.NODE_ENV === 'development') {
  console.log(
    '%c🚀 One To One Restaurant - Versión 1.0.0',
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold;'
  );
  console.log('%c📦 Aplicación iniciada correctamente', 'color: #28a745; font-weight: bold;');
}

// ============================================
// MANEJO DE ERRORES GLOBALES (OPCIONAL)
// ============================================

/**
 * Captura errores no manejados en la aplicación
 * Útil para debugging en producción
 */
window.addEventListener('error', (event) => {
  console.error('❌ Error global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('⚠️ Promesa rechazada no manejada:', event.reason);
});