# 🎭 Guía de Configuración - Sistema de Tickets y Oráculos

## 📋 Descripción General

Este sistema permite que los clientes:

- ✅ Reciban su ticket de pedido por **Email** y **WhatsApp**
- ✅ **Guarden y coleccionen** sus tickets (como galletas chinas)
- ✅ **Impriman o descarguen** sus tickets en cualquier momento
- ✅ Vean un **"Oráculo"** (frase inspiradora) en cada ticket

## 🚀 Pasos de Instalación

### 1️⃣ **Instalar Dependencias en Backend**

```bash
cd backend
npm install
```

Esto instalará:

- `nodemailer`: Para enviar emails
- `twilio`: Para enviar mensajes de WhatsApp

### 2️⃣ **Configurar Variables de Entorno**

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_app

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=tu_sid
TWILIO_AUTH_TOKEN=tu_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📧 Configurar EMAIL

### Opción A: Gmail (Recomendado para desarrollo)

1. **Habilitar contraseña de aplicación:**
   - Ve a [Google Account Security](https://myaccount.google.com/security)
   - Habilita "2-Step Verification"
   - En "App passwords" selecciona "Mail" y "Windows Computer"
   - Te generará una contraseña de 16 caracteres
   - Usa esa contraseña en `EMAIL_PASSWORD`

2. **En `.env`:**

```env
EMAIL_SERVICE=gmail
EMAIL_USER=tuEmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Opción B: SendGrid (Mejor para producción)

1. **Crear cuenta en [SendGrid](https://sendgrid.com)**
2. **Crear API Key**
3. **En `.env`:**

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxx
```

### Opción C: Mailtrap (Para pruebas/desarrollo)

1. **Crear cuenta en [Mailtrap](https://mailtrap.io)**
2. **Obtener credenciales SMTP**
3. **En `.env`:**

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_USER=tu_usuario
EMAIL_PASSWORD=tu_password
```

---

## 📱 Configurar WhatsApp (Twilio)

### Pasos:

1. **Crear cuenta en [Twilio](https://www.twilio.com)**
2. **Ir a "Console > Messaging > Phone Numbers"**
3. **Crear un número Twilio**
4. **Obtener credenciales:**
   - Account SID
   - Auth Token
   - Phone Number

5. **En `.env`:**

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

⚠️ **Nota:** Twilio puede requerir verificación de números. Para desarrollo, prueba con "Verified Caller IDs".

---

## 🛠️ Estructura del Sistema

### Frontend (`/frontend`)

- **TicketModal.jsx** - Modal que muestra el ticket
- **CodigoQR.jsx** - Componente del código QR
- **services/ticketService.js** - Funciones de captura, envío y guardado

### Backend (`/backend`)

- **routes/tickets.js** - Endpoints para enviar tickets
- **POST /api/tickets/send** - Envía ticket por email y WhatsApp
- **GET /api/tickets/test** - Verifica configuración de email

---

## 💾 Cómo Funciona el Guardado de Tickets

### LocalStorage (Cliente)

Los tickets se guardan en el localStorage del navegador como:

```javascript
{
  id: "TICKET-1234567890",
  orderNumber: "OTO-001",
  total: 50.00,
  items: [...],
  htmlContent: "...", // Completo para imprimir/reabrir
  savedAt: "2026-04-05T10:30:00Z",
  frase: { texto: "...", icono: "⛰️" }
}
```

### Funciones Disponibles:

```javascript
import {
  getTicketsCollection, // Obtener todos los tickets
  openTicketFromCollection, // Abrir un ticket guardado
  deleteTicketFromCollection, // Eliminar un ticket
  exportTicketsCollection, // Exportar como JSON
} from "./services/ticketService";
```

---

## 🧪 Probar el Sistema

### 1. Verificar Backend

```bash
curl http://localhost:5000/api/tickets/test
```

### 2. Enviar Ticket de Prueba

```bash
curl -X POST http://localhost:5000/api/tickets/send \
  -H "Content-Type: application/json" \
  -d '{
    "order": {"numero": "OTO-TEST", "total": 25.00, "items": []},
    "ticketHTML": "<html>...</html>",
    "userEmail": "test@example.com",
    "userPhone": "+34612345678"
  }'
```

### 3. En la Interfaz

1. Completa una compra
2. Se abre el TicketModal
3. Haz clic en el botón "📤" (Compartir)
4. Ingresa email y/o WhatsApp
5. Haz clic en "✅ Enviar Ticket"

---

## 🎨 Personalización del Oráculo

El "Oráculo" se define en localStorage:

```javascript
localStorage.setItem(
  "fraseOraculo",
  JSON.stringify({
    texto: "Tu frase inspiradora aquí",
    icono: "🌟", // Cualquier emoji
  }),
);
```

---

## 🐛 Solución de Problemas

### Email no se envía

- [ ] Verificar credenciales en `.env`
- [ ] Usar contraseña de aplicación (no contraseña de Gmail)
- [ ] Verificar que "2-Step Verification" esté habilitada

### WhatsApp no funciona

- [ ] Verificar SID y Token de Twilio
- [ ] Verificar número de teléfono con formato `+` (ejemplo: `+34612345678`)
- [ ] Número debe estar verificado en Twilio

### Ticket no se guarda

- [ ] Verificar que localStorage esté habilitado
- [ ] Abrir consola para ver errores: `F12 > Console`

---

## 📚 Variables Disponibles

Consulta `backend/src/routes/tickets.js` para ver todas las variables y opciones de configuración.

---

## 🔒 Seguridad

⚠️ **NUNCA** commits `.env` a Git. Se incluye en `.gitignore`.

Mejores prácticas:

- Usa variables de entorno
- Protege tus API keys
- En producción, usa un gestor de secrets (ej: Vault, AWS Secrets Manager)

---

## 📞 Soporte

Para más información:

- [Nodemailer Docs](https://nodemailer.com/)
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [SendGrid Docs](https://docs.sendgrid.com/)

¡Que disfrutes del sistema! 🎭🔱
