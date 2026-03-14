# Backend - TATIANA'S Restaurant

API REST para gestión de menús diarios, pedidos y autenticación del restaurante Tatiana's.

## Configuración

1. **Instalar dependencias:**

```bash
npm install
```

2. **Crear archivo .env:**

```bash
cp .env.example .env
```

3. **Editar .env con tus valores:**

- `MONGODB_URI`: Tu conexión MongoDB
- `JWT_SECRET`: Clave secreta para tokens
- `PORT`: Puerto del servidor (default: 5000)

## Scripts

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar con nodemon (desarrollo)

## Estructura

```
src/
├── models/      # Esquemas MongoDB
├── routes/      # Rutas API (en desarrollo)
├── middleware/  # Autenticación, validación
└── index.js     # Punto de entrada
```

## API Endpoints (próximamente)

- `/api/auth` - Autenticación
- `/api/menus` - Menús diarios
- `/api/orders` - Gestión de pedidos
- `/api/items` - Ítems de menú
