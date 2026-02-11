# 🚀 GUÍA DE INICIO RÁPIDO - TATIANA'S

## Requisitos

- Node.js 16+ instalado
- MongoDB (local o Atlas)
- npm

## ⚡ Inicio Rápido

### 1️⃣ Configurar Backend

```bash
cd backend

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus valores:
# - MONGODB_URI: Tu conexión MongoDB
# - JWT_SECRET: Clave secreta (ej: tu_clave_secreta_123)
# - PORT: 5000 (por defecto)

# Instalar dependencias (ya hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**Backend estará en:** `http://localhost:5000`

### 2️⃣ Configurar Frontend

```bash
cd frontend

# Instalar dependencias (ya hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**Frontend estará en:** `http://localhost:5173`

---

## 📝 Variables de Entorno (.env)

### Backend

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tianas_restaurant
JWT_SECRET=tu_clave_super_secreta_12345
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 🧪 Probar API

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Registrar Usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

---

## 📚 Endpoints Disponibles

### 🔐 Autenticación

- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Iniciar sesión

### 🍽️ Ítems de Menú

- `GET /api/items` - Obtener todos
- `GET /api/items/categoria/:categoria` - Por categoría
- `POST /api/items` - Crear (admin)
- `PUT /api/items/:id` - Actualizar (admin)
- `DELETE /api/items/:id` - Eliminar (admin)

### 📅 Menús Diarios

- `GET /api/menus/today` - Menú de hoy
- `GET /api/menus/:fecha` - Menú por fecha
- `POST /api/menus` - Crear (admin)
- `PUT /api/menus/:id` - Actualizar (admin)

### 📦 Pedidos

- `POST /api/orders` - Crear pedido
- `GET /api/orders/cliente/mis-pedidos` - Mis pedidos
- `GET /api/orders/admin/todas` - Todas las comandas (admin)
- `GET /api/orders/:id` - Detalle de pedido
- `PUT /api/orders/:id/estado` - Cambiar estado (admin)
- `PUT /api/orders/:id/cancelar` - Cancelar pedido

---

## 📂 Estructura de Carpetas

```
backend/
├── src/
│   ├── middleware/       # Autenticación, validaciones
│   ├── models/          # Esquemas MongoDB
│   ├── routes/          # Rutas API
│   └── index.js         # Servidor
├── package.json
└── .env

frontend/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos
│   └── main.jsx         # Entrada
├── index.html
├── package.json
└── vite.config.js
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# En backend o frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: MongoDB connection

- Verificar MONGODB_URI en .env
- Verificar que MongoDB esté corriendo
- Si usas Atlas, verificar IP whitelist

### Puerto ya está en uso

```bash
# Cambiar puerto en .env (backend)
PORT=5001

# Cambiar puerto en vite.config.js (frontend)
port: 5174
```

---

## 🎨 Personalización

### Cambiar colores

Editar [src/App.css](frontend/src/App.css):

```css
:root {
  --primary: #667eea; /* Púrpura */
  --secondary: #764ba2; /* Púrpura oscuro */
  --accent: #f093fb; /* Rosa */
}
```

---

## 📱 Funcionalidades Principales

### ✅ Ya implementado

- Estructura MERN completa
- Modelos MongoDB (User, MenuItem, DailyMenu, Order)
- API REST con autenticación JWT
- Interfaz frontend con React + Vite
- Información nutricional y cultural
- Estilos modernos y responsivos

### ⏳ Próximas funcionalidades

- Carrito de compras avanzado
- Filtros y búsqueda
- Notificaciones en tiempo real
- Dashboard completo del admin
- Reportes y estadísticas
- App móvil nativa

---

## ✨ Tips

1. **Frontend + Backend juntos:**

   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd frontend && npm run dev
   ```

2. **Usar insomnia/Postman** para probar endpoints

3. **Ver logs en MongoDB** con MongoDB Compass

4. **Hot reload automático** en ambos servidores durante desarrollo

---

¡Listo! Tu app está lista para empezar. 🚀
