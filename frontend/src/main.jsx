import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
//import './index.css';
import './unified-styles.css'; // NUEVO: Estilos unificados para toda la app

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
