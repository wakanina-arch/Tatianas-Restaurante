// Configuración según entorno
const isDevelopment = import.meta.env.DEV;

const PROD_BACKEND_URL = 'https://one-to-one-gotico-backend.vercel.app';

const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000'
  : PROD_BACKEND_URL;

export { BACKEND_URL };
