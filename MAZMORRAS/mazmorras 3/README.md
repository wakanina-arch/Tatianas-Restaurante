# 🍽️ TATIANA'S Restaurant - App de Menús Diarios

Aplicación web moderna para que **TATIANA'S** gestione menús diarios, reciba pedidos y ofrezca a los estudiantes universitarios una experiencia gastronómica con información cultural y nutricional.

## 🎯 Características Principales

### 👨‍💼 Para el Restaurante

- ✅ Dashboard para actualizar precios diarios
- ✅ Recepción y gestión de comandas en tiempo real
- ✅ Crear y editar platillos con información detallada
- ✅ Ver estado de pedidos (pendiente → en preparación → listo → entregado)

### 🎓 Para los Clientes (Estudiantes)

- ✅ Visualizar menú del día con precios actualizados
- ✅ Hacer pedidos sin obstáculos (interfaz intuitiva)
- ✅ **Ver información cultural** de cada plato (origen regional, historia de ingredientes)
- ✅ **Valores nutricionales** (calorías, proteínas, carbohidratos, grasas, sodio, fibra)
- ✅ **Advertencias de alérgenos** (gluten, lactosa, mariscos, frutos secos, etc.)
- ✅ Filtros por preferencias (vegetariano, vegano, sin gluten)
- ✅ Historial de pedidos y seguimiento

## 🛠️ Stack Tecnológico

### Frontend

- **React 18** - Interfaz de usuario moderna
- **Vite** - Build tool ultra-rápido con HMR
- **CSS3** - Diseño responsivo y animaciones modernas
- **Axios** - Cliente HTTP para API

### Backend

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **MongoDB** - Base de datos flexible NoSQL
- **JWT** - Autenticación segura
- **Bcrypt** - Encriptación de contraseñas

### Características Culturales & Nutricionales

```javascript
{
  nombre: "Arepa de Queso",
  regionOrigen: "Andes",
  historiaIngredientes: "Plato tradicional andino...",
  ingredientePrincipal: "Maíz blanco",

  // Información Nutricional (por porción)
  nutricion: {
    calorias: 380,
    proteinas: 12,      // gramos
    grasas: 15,         // gramos
    carbohidratos: 48,  // gramos
    fibra: 2,           // gramos
    sodio: 450          // mg
  },

  // Alérgenos
  contiene: ['gluten', 'lactosa'],
  esVegetariano: true,
  esVegano: false
}
```

## 📁 Estructura del Proyecto

```
Tatiana's Restaurante/
├── frontend/                    # Aplicación React + Vite
│   ├── src/
│   │   ├── components/         # Componentes (próximamente)
│   │   ├── pages/              # Páginas (próximamente)
│   │   ├── App.jsx             # Componente principal
│   │   ├── App.css             # Estilos
│   │   └── main.jsx            # Entrada
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                     # API Node.js + Express
│   ├── src/
│   │   ├── models/             # Esquemas MongoDB
│   │   │   ├── User.js         # Usuarios (cliente/admin)
│   │   │   ├── MenuItem.js     # Ítems del menú
│   │   │   ├── DailyMenu.js    # Menú del día
│   │   │   └── Order.js        # Pedidos
│   │   ├── routes/             # Rutas API (próximamente)
│   │   ├── middleware/         # Autenticación, validaciones
│   │   └── index.js            # Servidor
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── README.md                    # Este archivo
└── .github/
    └── copilot-instructions.md
```

## 🚀 Inicio Rápido

### Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tu MongoDB URI y JWT_SECRET
npm install
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔌 API Endpoints (Próximamente)

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Menús

- `GET /api/menus/today` - Menú del día
- `POST /api/menus` - Crear menú (admin)
- `PUT /api/menus/:id` - Actualizar menú (admin)

### Ítems

- `GET /api/items` - Listar todos los ítems
- `POST /api/items` - Crear ítem (admin)
- `PUT /api/items/:id` - Actualizar ítem (admin)
- `DELETE /api/items/:id` - Eliminar ítem (admin)

### Pedidos

- `GET /api/orders` - Mis pedidos (cliente)
- `POST /api/orders` - Crear pedido (cliente)
- `GET /api/orders/:id` - Detalles del pedido
- `PUT /api/orders/:id` - Actualizar estado (admin)
- `GET /api/orders/admin/todas` - Todos los pedidos (admin)

## 📱 Características por Rol

### 🎓 Cliente (Estudiante)

1. Ver menú del día con precios
2. Leer información cultural de platillos
3. Consultar valores nutricionales
4. Verificar alérgenos
5. Hacer pedidos
6. Seguimiento en tiempo real
7. Historial de pedidos

### 👨‍💼 Admin (Restaurante)

1. Actualizar menú diario y precios
2. Ver todas las comandas
3. Cambiar estado de pedidos
4. Gestionar ítems del menú
5. Agregar información cultural/nutricional
6. Reportes (próximamente)

## 🎨 Diseño

- **Colores:** Gradientes modernos (Púrpura → Rosa)
- **Tipografía:** Clean, legible, responsive
- **Animaciones:** Suaves, no invasivas
- **Accesibilidad:** Cumple WCAG 2.1

## 📝 Próximas Características

- [ ] Carrito de compras avanzado
- [ ] Sistema de búsqueda y filtros
- [ ] Valoraciones y comentarios
- [ ] Programa de puntos/lealtad
- [ ] Notificaciones en tiempo real
- [ ] Dark mode
- [ ] Soporte para múltiples idiomas
- [ ] Integración de pagos
- [ ] App móvil nativa
- [ ] Análisis y reportes

## 🔐 Seguridad

- Contraseñas encriptadas con Bcrypt
- Tokens JWT para autenticación
- CORS configurado
- Validación de entrada (próximamente)
- Rate limiting (próximamente)

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)

## 📄 Licencia

Este proyecto es propiedad de TATIANA'S Restaurant.

---

**¿Preguntas o sugerencias?** Contacta al equipo de desarrollo. 🚀
