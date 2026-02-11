# 🏗️ Arquitectura TATIANA'S Restaurant

## 📊 Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    🍽️ TATIANA'S Restaurant                  │
│              Modern Web App for Daily Menus                  │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   🎨 Frontend         📡 API Gateway      📊 Admin
   (React+Vite)       (Node+Express)    (Dashboard)
   Port: 5173         Port: 5000        Port: 5000
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │  🗄️ MongoDB Database    │
            │  (tianas_restaurant)    │
            └──────────────────────────┘
```

## 📁 Estructura de Carpetas

```
Tatiana's Restaurante/
│
├── 📁 frontend/                    # React + Vite
│   ├── 📁 src/
│   │   ├── App.jsx                 # Componente principal
│   │   ├── App.css                 # Estilos
│   │   ├── index.css               # Estilos globales
│   │   └── main.jsx                # Punto de entrada
│   ├── index.html                  # HTML
│   ├── vite.config.js              # Config Vite
│   ├── package.json                # Dependencias
│   └── README.md
│
├── 📁 backend/                     # Node.js + Express
│   ├── 📁 src/
│   │   ├── 📁 middleware/
│   │   │   └── auth.js             # JWT, roles
│   │   ├── 📁 models/
│   │   │   ├── User.js             # Usuarios
│   │   │   ├── MenuItem.js         # Platillos
│   │   │   ├── DailyMenu.js        # Menú del día
│   │   │   └── Order.js            # Pedidos
│   │   ├── 📁 routes/
│   │   │   ├── auth.js             # Autenticación
│   │   │   ├── items.js            # Gestión de ítems
│   │   │   ├── menus.js            # Gestión de menús
│   │   │   └── orders.js           # Gestión de pedidos
│   │   └── index.js                # Servidor principal
│   ├── .env.example                # Variables de entorno
│   ├── package.json                # Dependencias
│   └── README.md
│
├── README.md                        # Documentación principal
├── QUICKSTART.md                    # Guía de inicio rápido
├── start.sh                         # Script para iniciar
└── .github/
    └── copilot-instructions.md      # Instrucciones del proyecto
```

## 🗄️ Modelos de Base de Datos

### User

```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String (unique),
  password: String (encrypted),
  rol: 'cliente' | 'admin_restaurante',
  telefonoContacto: String,
  direccionEntrega: String,
  preferenciasAlergias: [String],
  createdAt: Date
}
```

### MenuItem

```javascript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria: 'entrada' | 'plato_fuerte' | 'acompañamiento' | 'bebida' | 'postre',
  disponible: Boolean,

  // 📖 Información Cultural
  regionOrigen: String,
  historiaIngredientes: String,
  ingredientePrincipal: String,

  // 🥗 Información Nutricional (por porción)
  nutricion: {
    calorias: Number,
    proteinas: Number,
    grasas: Number,
    carbohidratos: Number,
    fibra: Number,
    sodio: Number
  },

  // ⚠️ Alérgenos
  contiene: [String],        // ['gluten', 'lactosa', 'mariscos']
  esVegetariano: Boolean,
  esVegano: Boolean,

  imagen: String,
  fechaCreacion: Date
}
```

### DailyMenu

```javascript
{
  _id: ObjectId,
  fecha: Date (unique),
  platos: [{
    menuItemId: ObjectId (ref: MenuItem),
    precioDelDia: Number,
    destacado: Boolean
  }],
  activo: Boolean,
  notas: String,
  creadoPor: ObjectId (ref: User),
  creadoEn: Date
}
```

### Order

```javascript
{
  _id: ObjectId,
  numeroOrden: String (unique),
  cliente: ObjectId (ref: User),
  items: [{
    menuItemId: ObjectId (ref: MenuItem),
    nombre: String,
    precio: Number,
    cantidad: Number,
    notas: String
  }],
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado',
  total: Number,
  tipoEntrega: 'local' | 'domicilio',
  direccionEntrega: String,
  telefonoContacto: String,
  notasEspeciales: String,
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia',
  horaEstimadaEntrega: Date,
  fechaPedido: Date,
  fechaActualizacion: Date
}
```

## 🔌 API REST Endpoints

### 🔐 Authentication

```
POST   /api/auth/register      - Registrar usuario
POST   /api/auth/login         - Iniciar sesión
```

### 🍽️ Items del Menú

```
GET    /api/items              - Obtener todos los ítems
GET    /api/items/categoria/:categoria - Por categoría
POST   /api/items              - Crear ítem (admin)
PUT    /api/items/:id          - Actualizar ítem (admin)
DELETE /api/items/:id          - Eliminar ítem (admin)
```

### 📅 Menús Diarios

```
GET    /api/menus/today        - Menú del día
GET    /api/menus/:fecha       - Menú por fecha específica
POST   /api/menus              - Crear menú del día (admin)
PUT    /api/menus/:id          - Actualizar menú (admin)
```

### 📦 Pedidos

```
POST   /api/orders                    - Crear nuevo pedido
GET    /api/orders/cliente/mis-pedidos - Mis pedidos
GET    /api/orders/admin/todas        - Todas las comandas (admin)
GET    /api/orders/:id                - Detalle de pedido
PUT    /api/orders/:id/estado         - Cambiar estado (admin)
PUT    /api/orders/:id/cancelar       - Cancelar pedido (cliente)
```

## 🎯 Flujo de Datos

### 1️⃣ Cliente haciendo un pedido

```
Cliente (Frontend)
    │
    ├─ Ver menú del día
    │  └─ GET /api/menus/today → Obtiene DailyMenu + Items
    │
    ├─ Seleccionar platillos
    │  └─ Agrega al carrito (local state)
    │
    ├─ Crear pedido
    │  └─ POST /api/orders → Crea Order en BD
    │
    └─ Seguimiento
       └─ GET /api/orders/cliente/mis-pedidos → Ver estado
```

### 2️⃣ Admin actualizando menú

```
Admin (Backend)
    │
    ├─ Autenticarse
    │  └─ POST /api/auth/login → JWT Token
    │
    ├─ Crear ítems de menú
    │  └─ POST /api/items → Crea MenuItem
    │
    ├─ Crear menú del día
    │  └─ POST /api/menus → Crea DailyMenu con precios
    │
    ├─ Ver comandas
    │  └─ GET /api/orders/admin/todas
    │
    └─ Actualizar estado
       └─ PUT /api/orders/:id/estado → Cambia estado
```

## 🛡️ Seguridad

- **Contraseñas**: Encriptadas con bcrypt
- **Autenticación**: JWT (JSON Web Tokens)
- **Autorización**: Roles (cliente, admin_restaurante)
- **CORS**: Configurado para frontend específico
- **Variables sensibles**: En archivo .env (no versionado)

## 🌈 Stack Tecnológico

### Frontend

- **React 18**: UI library moderna
- **Vite**: Build tool ultra-rápido con HMR
- **CSS3**: Estilos responsivos con gradientes
- **Axios**: Cliente HTTP (próximo)

### Backend

- **Node.js**: Runtime de JavaScript
- **Express**: Framework web minimalista
- **MongoDB**: Base de datos NoSQL flexible
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación stateless
- **Bcrypt**: Encriptación de contraseñas
- **CORS**: Control de origen cruzado

### Desarrollo

- **npm**: Gestor de dependencias
- **nodemon**: Auto-reload en desarrollo
- **Git**: Control de versiones

## 📱 Interfaz de Usuario (Frontend)

### Componentes Implementados

1. **Navbar** - Navegación y logo
2. **HomePage** - Visualización de menú del día
3. **MenuItem** - Tarjeta de platillo con:
   - Nombre y precio
   - Información cultural
   - Valores nutricionales
   - Advertencias de alérgenos
   - Etiquetas (vegano, sin gluten)
   - Botón "Agregar al Carrito"
4. **OrdersPage** - Mis pedidos
5. **AdminPage** - Dashboard del restaurante

### Colores y Estilo

```css
Primary:    #667eea (Púrpura)
Secondary:  #764ba2 (Púrpura oscuro)
Accent:     #f093fb (Rosa)
Light:      #f5f5f5 (Gris claro)
Dark:       #222 (Gris oscuro)
```

## 🚀 Próximas Características

- [ ] Carrito de compras completo
- [ ] Sistema de búsqueda y filtros avanzados
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Dashboard completo del admin
- [ ] Reportes y estadísticas
- [ ] Integración de pasarela de pago
- [ ] Dark mode
- [ ] Soporte multiidioma
- [ ] App móvil nativa (React Native)
- [ ] Autenticación con redes sociales

---

**Documentación actualizada:** 9 de febrero de 2026
