#!/bin/bash
# 🚀 Script de Instalación - Tatianas Restaurante

echo "════════════════════════════════════════════════════"
echo "🎭 TATIANA'S RESTAURANTE - Sistema de Tickets"
echo "════════════════════════════════════════════════════"
echo ""

# ==========================================
# 1. Instalar dependencias del BACKEND
# ==========================================
echo "📦 Instalando dependencias del BACKEND..."
cd backend

# Verificar si package-lock.json existe (npm) o yarn.lock (yarn)
if [ -f "yarn.lock" ]; then
    echo "🧵 Detectado Yarn, usando Yarn..."
    yarn install
else
    echo "📦 Detectado npm, usando npm..."
    npm install
fi

echo "✅ Backend instalado"
echo ""

# ==========================================
# 2. Verficar archivo .env
# ==========================================
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "📋 Creando .env desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo "⚠️  IMPORTANTE: Edita .env con tus credenciales"
    echo ""
else
    echo "✅ Archivo .env ya existe"
fi

echo ""

# ==========================================
# 3. Instalar dependencias del FRONTEND
# ==========================================
cd ../frontend
echo "📦 Instalando dependencias del FRONTEND..."

if [ -f "yarn.lock" ]; then
    echo "🧵 Detectado Yarn, usando Yarn..."
    yarn install
else
    echo "📦 Detectado npm, usando npm..."
    npm install
fi

echo "✅ Frontend instalado"
echo ""

# ==========================================
# 4. Resumen
# ==========================================
echo "════════════════════════════════════════════════════"
echo "✅ ¡Instalación completada!"
echo "════════════════════════════════════════════════════"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1️⃣  Edita el archivo backend/.env con tus credenciales:"
echo "    - EMAIL_USER y EMAIL_PASSWORD"
echo "    - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER"
echo ""
echo "2️⃣  Inicia el BACKEND:"
echo "    cd backend"
echo "    npm run dev"
echo ""
echo "3️⃣  En otra terminal, inicia el FRONTEND:"
echo "    cd frontend"
echo "    npm run dev"
echo ""
echo "4️⃣  Abre http://localhost:5173 en tu navegador"
echo ""
echo "📚 Para más información: Ver TICKETS_SETUP_GUIDE.md"
echo ""
echo "🎭 ¡Que disfrutes! 🔱"
