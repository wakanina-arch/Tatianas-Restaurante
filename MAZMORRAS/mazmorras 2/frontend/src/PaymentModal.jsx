import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function PaymentModal({ open, onClose, total }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    tarjeta: '',
    vencimiento: '',
    cvv: '',
  });
  const [qr, setQr] = useState(null);
  const { cartItems, clearCart, addOrder } = useCart();

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de pago
    setTimeout(() => {
      setStep(2);
      // Generar QR simulado
      setQr(`https://api.qrserver.com/v1/create-qr-code/?data=TICKET-${form.nombre}-${form.email}-${total}&size=200x200`);
      // Crear nueva orden
      const newOrder = {
        id: `ORD-${Math.floor(Math.random()*900)+100}`,
        cliente: form.nombre,
        mesa: Math.floor(Math.random()*10)+1,
        estado: 'En preparación',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: cartItems.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio })),
        total: parseFloat(total),
      };
      addOrder(newOrder);
      clearCart();
    }, 1200);
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer" style={{maxWidth: 420}}>
        <button className="close-btn" onClick={onClose}>Cerrar</button>
        {step === 1 && (
          <>
            <h2>Pago con Tarjeta</h2>
            <form onSubmit={handleSubmit} className="payment-form">
              <label>Nombre Completo
                <input name="nombre" value={form.nombre} onChange={handleChange} required />
              </label>
              <label>Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>Número de Tarjeta
                <input name="tarjeta" type="text" value={form.tarjeta} onChange={handleChange} required maxLength={16} />
              </label>
              <div style={{display:'flex', gap:'1rem'}}>
                <label>Vencimiento
                  <input name="vencimiento" type="text" value={form.vencimiento} onChange={handleChange} required placeholder="MM/AA" maxLength={5} />
                </label>
                <label>CVV
                  <input name="cvv" type="password" value={form.cvv} onChange={handleChange} required maxLength={4} />
                </label>
              </div>
              <div className="payment-total">Total a pagar: <b>${total}</b></div>
              <button className="save-btn" type="submit">Pagar</button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2>¡Pago realizado!</h2>
            <p>Gracias por tu compra, {form.nombre}. Escanea el QR para tu tiquet:</p>
            <div style={{display:'flex', justifyContent:'center', margin:'1rem 0'}}>
              <img src={qr} alt="QR Ticket" style={{borderRadius:8, boxShadow:'0 2px 8px #667eea33'}} />
            </div>
            <div className="payment-total">Total pagado: <b>${total}</b></div>
            <button className="save-btn" onClick={onClose}>Cerrar</button>
          </>
        )}
      </div>
    </div>
  );
}
