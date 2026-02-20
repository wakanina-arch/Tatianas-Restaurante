// La función más simple del mundo para Vercel
export default function handler(req, res) {
  // Vercel espera que el 'req' y 'res' sean como los de Express
  console.log("🎯 ¡La función fue invocada!");
  res.status(200).json({ 
    mensaje: '¡Conexión exitosa!', 
    hora: new Date().toISOString() 
  });
}