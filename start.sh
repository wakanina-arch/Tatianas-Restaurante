#!/bin/bash

# Script para iniciar el proyecto Tatiana's Restaurant

echo "🍽️  TATIANA'S Restaurant - Dev Server"
echo "======================================"
echo ""

# Preguntar qué quiere iniciar
echo "¿Qué deseas iniciar?"
echo "1) Backend (Node.js + Express)"
echo "2) Frontend (React + Vite)"
echo "3) Ambos (en terminales separadas)"
echo ""
read -p "Selecciona una opción (1-3): " option

case $option in
  1)
    echo "Iniciando Backend..."
    cd backend
    npm run dev
    ;;
  2)
    echo "Iniciando Frontend..."
    cd frontend
    npm run dev
    ;;
  3)
    echo "Iniciando ambos servidores..."
    echo "Backend en http://localhost:5000"
    echo "Frontend en http://localhost:5173"
    echo ""
    
    # Backend en background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    
    # Frontend
    cd ../frontend
    npm run dev
    
    # Limpiar
    kill $BACKEND_PID
    ;;
  *)
    echo "Opción inválida"
    ;;
esac
