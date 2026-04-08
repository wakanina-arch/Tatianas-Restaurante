# 🚀 Flujo de Deployment - GitHub → Vercel

## ¿Cómo funciona?

Cuando haces un commit y push a GitHub, Vercel **automáticamente**:

1. Detecta los cambios (GitHub webhook)
2. Ejecuta el build
3. Deploy a producción
4. Tu sitio está actualizado ✅

---

## 📋 Pasos para Obtener el Resultado Esperado

### 1️⃣ **En tu máquina** (local)

```bash
# Hacer cambios en el código
git add .
git commit -m "Tu mensaje"
git push origin main
```

### 2️⃣ **En GitHub** 💻

Ves tu commit en el repo. Ya está registrado.

### 3️⃣ **En Vercel** 🚀

Se activa **automáticamente**:

- Abre: https://vercel.com/dashboard
- Selecciona tu proyecto
- Verás en **"Deployments"** que:
  - 🟠 BUILDING... (está compilando)
  - 🟢 READY (está vivo)

Puede tomar 1-3 minutos.

### 4️⃣ **Resultado Esperado** ✨

Tu frontend actualizado en: **`https://[tu-proyecto].vercel.app`**

---

## 📊 Estado Actual de tu Deployment

| Componente   | Estado              | URL                                           |
| ------------ | ------------------- | --------------------------------------------- |
| **Frontend** | ✅ EN VERCEL        | https://... (vercel.app)                      |
| **Backend**  | 🔴 (sin configurar) | Necesita Railway/Render                       |
| **GitHub**   | ✅ ACTIVO           | github.com/wakanina-arch/Tatianas-Restaurante |

---

## 🔧 Variables de Entorno en Vercel

Para que todo funcione, necesitas agregar en Vercel:

**Settings → Environment Variables**

```env
VITE_API_URL=https://tu-backend.com/api
JWT_SECRET=tu_secret
MONGODB_URI=mongodb+srv://...
```

---

## ⚡ Tips

- **Vercel es gratis** para usar (hasta 100GB/mes)
- **Cada push = auto-deploy** (no necesitas hacer nada más)
- **Logs en tiempo real**: Settings → Deployments → ver logs
- **Revertir deploy**: Click en versión anterior

---

## 🆘 Si algo no se actualiza:

1. Verifica que el push llegó a GitHub: `git log`
2. En Vercel, force a rebuild: `Deployments → Redeploy`
3. Revisa los logs: `Settings → Deployments → Logs`

---

✅ **¡Tu flujo está configurado! Solo commit + push = todo automático** 🎉
