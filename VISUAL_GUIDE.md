# 🎯 TATIANA'S RESTAURANT - GUÍA VISUAL

## 📊 Estructura del Proyecto en 30 Segundos

```
TATIANA'S RESTAURANT
│
├─ 🎨 FRONTEND (React + Vite)
│  ├─ Página de Menú → Ver platillos, info nutricional, cultural
│  ├─ Carrito → Agregar/quitar items, ver total
│  ├─ Mis Pedidos → Historial y seguimiento
│  └─ Admin Dashboard → Gestionar menú, ver comandas
│
├─ 📡 BACKEND (Node + Express)
│  ├─ Autenticación → Login/Registro con JWT
│  ├─ Gestión de Ítems → CRUD de platillos
│  ├─ Gestión de Menús → Crear menú del día
│  └─ Gestión de Pedidos → Crear, actualizar, rastrear
│
└─ 🗄️ BASE DE DATOS (MongoDB)
   ├─ Usuarios (clientes y admin)
   ├─ Ítems de Menú (con info nutricional)
   ├─ Menús Diarios (con precios)
   └─ Pedidos (con estado y seguimiento)
```

---

## 🚀 Iniciar la Aplicación

### Opción 1: Dos Terminales (Recomendado)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Verás: 🍽️ Servidor Tatiana's corriendo en puerto 5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Verás: ✓ ready in XXXms (http://localhost:5173)
```

### Opción 2: Script Automático

```bash
chmod +x start.sh
./start.sh
# Selecciona opción 3 para ambos
```

---

## 🌐 Acceder a la Aplicación

| Componente   | URL                              | Propósito                      |
| ------------ | -------------------------------- | ------------------------------ |
| Frontend     | http://localhost:5173            | App web de TATIANA'S           |
| Backend API  | http://localhost:5000/api        | API REST                       |
| Health Check | http://localhost:5000/api/health | Verificar que backend funciona |

---

## 🔑 Rutas Disponibles (Frontend)

### Cliente

```
http://localhost:5173/
├─ / → Menú del día
├─ /pedidos → Mis pedidos
└─ /login → Iniciar sesión
```

### Admin (próximamente con autenticación)

```
http://localhost:5173/admin
├─ /dashboard → Panel principal
├─ /menus → Gestionar menú del día
├─ /items → Gestionar ítems
└─ /comandas → Ver todas las comandas
```

---

## 📡 API REST - Ejemplos de Uso

### 1️⃣ Registrar un Usuario

**Request:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  }
}
```

### 2️⃣ Login

**Request:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "mensaje": "Sesión iniciada exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  }
}
```

### 3️⃣ Obtener Menú del Día

**Request:**

```bash
curl http://localhost:5000/api/menus/today
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "fecha": "2026-02-09T00:00:00.000Z",
  "platos": [
    {
      "menuItemId": {
        "_id": "507f1f77bcf86cd799439013",
        "nombre": "Arepa de Queso",
        "precio": 5.5,
        "nutricion": {
          "calorias": 380,
          "proteinas": 12
        }
      },
      "precioDelDia": 5.5,
      "destacado": true
    }
  ],
  "activo": true
}
```

### 4️⃣ Crear Pedido

**Request:**

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "menuItemId": "507f1f77bcf86cd799439013",
        "nombre": "Arepa de Queso",
        "precio": 5.50,
        "cantidad": 2
      }
    ],
    "tipoEntrega": "local",
    "metodoPago": "efectivo"
  }'
```

**Response:**

```json
{
  "mensaje": "Pedido creado exitosamente",
  "pedido": {
    "_id": "507f1f77bcf86cd799439014",
    "numeroOrden": "ORD-1707476400000-ABC123XYZ",
    "estado": "pendiente",
    "total": 11.0,
    "horaEstimadaEntrega": "2026-02-09T13:45:00.000Z"
  }
}
```

---

## 📝 Variables de Entorno (.env)

### Backend (.env)

```env
# Puerto del servidor
PORT=5000

# Conexión a MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tianas_restaurant

# Clave secreta para JWT
JWT_SECRET=tu_clave_super_secreta_12345

# Entorno
NODE_ENV=development

# CORS - URL del frontend
CORS_ORIGIN=http://localhost:5173
```

### Frontend (vite.config.js)

```javascript
// El proxy está configurado para que /api apunte a http://localhost:5000
// No necesitas variable .env, todo automático
```

---

## 🛡️ Seguridad y Autenticación

### Cómo funcionan los Tokens JWT

1. **Login/Registro** → Backend genera token JWT
2. **Guardar Token** → Frontend lo guarda en localStorage
3. **Usar Token** → Frontend lo envía en cada petición
4. **Verificar** → Backend valida el token en middleware

### Ejemplo: Petición con Token

```bash
curl http://localhost:5000/api/orders/cliente/mis-pedidos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🎨 Colores y Temas

### Paleta Principal

```css
Primary:    #667eea    (Púrpura vibrante)
Secondary:  #764ba2    (Púrpura oscuro)
Accent:     #f093fb    (Rosa)
Light:      #f5f5f5    (Gris muy claro)
Dark:       #222       (Gris oscuro)
```

### Estados

```css
Success:    #4caf50    (Verde)
Warning:    #ff9800    (Naranja)
Danger:     #f44336    (Rojo)
```

---

## 🧪 Testing de Endpoints

### Con Postman/Insomnia:

1. Descarga Postman: https://www.postman.com/downloads/
2. Importa requests desde colección
3. Configura environment variables
4. Prueba cada endpoint

### Con cURL (Línea de comandos):

```bash
# Health check
curl http://localhost:5000/api/health

# Obtener items
curl http://localhost:5000/api/items

# Crear usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","password":"123"}'
```

---

## 📱 Interfaz de Usuario (Screenshot mental)

```
┌─────────────────────────────────────────┐
│  🍽️ TATIANA'S    [Menú] [Pedidos] [Admin]  │
├─────────────────────────────────────────┤
│                                         │
│  Bienvenido a TATIANA'S 🎉              │
│  Descubre nuestros menús diarios...     │
│                                         │
├─────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────┐ │
│ │ Arepa Queso │ │ Ceviche     │ │Ensad│ │
│ │ $5.50       │ │ $8.00       │ │$4.50│ │
│ │ 380 cal     │ │ 250 cal     │ │220  │ │
│ │ 🥗 12g      │ │ 🍖 32g      │ │8g   │ │
│ │ 🌾 Gluten   │ │ 🦐 Marisco  │ │🌱 V │ │
│ │ [Agregar]   │ │ [Agregar]   │ │[Agr]│ │
│ └─────────────┘ └─────────────┘ └─────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting Rápido

### "Cannot connect to MongoDB"

```bash
# Verificar que MongoDB esté corriendo
# O usar MongoDB Atlas en .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### "Port already in use"

```bash
# Cambiar puerto en backend/.env
PORT=5001

# O matar proceso en puerto
lsof -ti:5000 | xargs kill -9
```

### "CORS Error"

```bash
# Verificar CORS_ORIGIN en backend/.env
CORS_ORIGIN=http://localhost:5173
```

---

## 📚 Archivos de Documentación

| Archivo                            | Contenido                      |
| ---------------------------------- | ------------------------------ |
| [README.md](README.md)             | Overview completo del proyecto |
| [QUICKSTART.md](QUICKSTART.md)     | Guía paso a paso para iniciar  |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Diagrama técnico y modelos     |
| [ROADMAP.md](ROADMAP.md)           | Planes para futuras fases      |
| [SAMPLE_DATA.js](SAMPLE_DATA.js)   | Ejemplos de datos para MongoDB |

---

## 🎓 Stack Tecnológico en Resumen

```
Frontend:
  React 18           → Componentes interactivos
  Vite               → Build ultra-rápido
  CSS3 + Gradientes  → Diseño moderno
  Axios              → Llamadas HTTP (próximamente)

Backend:
  Node.js            → Runtime
  Express            → Framework web
  MongoDB            → Base de datos
  Mongoose           → ODM
  JWT                → Autenticación
  Bcrypt             → Encriptación

Desarrollo:
  npm                → Gestor de paquetes
  nodemon            → Auto-reload
  Git                → Control de versiones
```

---

## 🚀 Próximos Pasos Recomendados

1. **Instalar MongoDB** (local o usar Atlas cloud)
2. **Configurar .env** con MONGODB_URI y JWT_SECRET
3. **Crear usuario admin** para pruebas
4. **Crear ítems de menú** de ejemplo
5. **Crear menú del día** con esos ítems
6. **Probar flujo completo**: Registrar → Login → Ver menú → Crear pedido
7. **Conectar frontend con backend** (próxima fase)

---

## 📞 Recursos Útiles

- [Documentación React](https://react.dev)
- [Documentación Express](https://expressjs.com)
- [Documentación MongoDB](https://docs.mongodb.com)
- [JWT Explicado](https://jwt.io)
- [REST API Best Practices](https://restfulapi.net)

---

**Versión:** 1.0.0  
**Última actualización:** 9 de febrero de 2026  
**Estado:** ✅ Estructura base completada y lista para desarrollo
