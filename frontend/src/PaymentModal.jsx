import React, { useState } from 'react';
import { useCart } from './CartContext';

// 1. Añadimos setPendingOrders a las props recibidas
export default function PaymentModal({ open, onClose, total, addLog, setPendingOrders }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    tarjeta: '',
    vencimiento: '',
    cvv: '',
    metodo: 'tarjeta', // tarjeta, bimo, payphone, deuna
  });
  const [qr, setQr] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { cartItems, clearCart, addOrder } = useCart();

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cambia el método de pago y limpia campos específicos
  const handleMetodoChange = (e) => {
    setForm(f => ({
      ...f,
      metodo: e.target.value,
      tarjeta: '',
      vencimiento: '',
      cvv: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de pagar.');
      return;
    }
    
    // Simulación de pago
    setTimeout(() => {
      const generatedId = `ORD-${Math.floor(Math.random() * 900) + 100}`;
      
      // Registro en el Log (Dashboard)
      if (addLog) {
        addLog({
          tipo: 'Entrada', 
          pedido: generatedId,
          usuario: form.nombre,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          detalle: `Pago con Tarjeta aprobado - Total: $${total}`
        });
      }

      setOrderId(generatedId);
      // Cambia la URL base por la de tu frontend real si es necesario
      const orderUrl = `https://one-to-one.app/orden/${generatedId}`;
      setQr(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(orderUrl)}&size=200x200`);
      
      const newOrder = {
        id: generatedId,
        cliente: form.nombre,
        mesa: Math.floor(Math.random()*10)+1,
        estado: 'En preparación',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: cartItems.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio })),
        total: parseFloat(total),
      };

      // 2. IMPORTANTE: Enviamos la orden al Administrador y al Contexto
      addOrder(newOrder); 
      if (setPendingOrders) {
        setPendingOrders(prev => [...prev, newOrder]);
      }

      setStep(2);
    }, 1200);
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer" style={{maxWidth: 420}}>
        {/* Solo mostramos la X de cerrar si no estamos en el ticket final (opcional) */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {step === 1 && (
          <>
            <h2>Pago</h2>
            <form onSubmit={handleSubmit} className="payment-form">
              <label>Nombre Completo
                <input name="nombre" value={form.nombre} onChange={handleChange} required />
              </label>
              <label>Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>Método de pago
                <select name="metodo" value={form.metodo} onChange={handleMetodoChange} style={{marginLeft:'0.5rem', fontWeight:600}}>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="bimo">BIMO</option>
                  <option value="payphone">PayPhone</option>
                  <option value="deuna">Deuna</option>
                </select>
              </label>
              {/* Input dinámico según método */}
              {form.metodo === 'tarjeta' && (
                <label style={{width:'100%'}}>Número de Tarjeta
                  <div style={{position:'relative', width:'100%'}}>
                    <input
                      name="tarjeta"
                      type="text"
                      value={form.tarjeta}
                      onChange={handleChange}
                      required
                      maxLength={16}
                      placeholder="VISA/mastercard/Diners"
                      style={{
                        width:'100%',
                        paddingRight:'2.2rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500,
                        letterSpacing: '0.03em',
                        fontSize: '0.92rem',
                        color: '#2d3436',
                        background: '#fff',
                        height: '2.1rem',
                      }}
                    />
                    {/* Icono dinámico según número */}
                    {form.tarjeta && (
                      <span style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', fontSize:'1.3rem', opacity:0.85}}>
                        {/* Visa */}
                        {/^4/.test(form.tarjeta) && <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{height:'1.2rem'}} />}
                        {/* Mastercard */}
                        {/^(5[1-5])/.test(form.tarjeta) && <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" style={{height:'1.2rem'}} />}
                        {/* Diners */}
                        {/^(36|38|30[0-5])/.test(form.tarjeta) && <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Diners_Club_Logo3.png" alt="Diners" style={{height:'1.2rem'}} />}
                      </span>
                    )}
                  </div>
                </label>
              )}
              {form.metodo === 'bimo' && (
                <label style={{width:'100%'}}>Celular BIMO
                  <div style={{position:'relative', width:'100%'}}>
                    <input
                      name="tarjeta"
                      type="text"
                      value={form.tarjeta}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      placeholder="Número de celular BIMO"
                      style={{
                        width:'100%',
                        paddingRight:'2.2rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.92rem',
                        color: '#2d3436',
                        background: '#fff',
                        height: '2.1rem',
                      }}
                    />
                    <span style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)'}}>
                      <img src="/img/paymethods/bimo.svg" alt="BIMO" style={{height:'1.5rem'}} />
                    </span>
                  </div>
                </label>
              )}
              {form.metodo === 'payphone' && (
                <label style={{width:'100%'}}>Celular PayPhone
                  <div style={{position:'relative', width:'100%'}}>
                    <input
                      name="tarjeta"
                      type="text"
                      value={form.tarjeta}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      placeholder="Número de celular PayPhone"
                      style={{
                        width:'100%',
                        paddingRight:'2.2rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.92rem',
                        color: '#2d3436',
                        background: '#fff',
                        height: '2.1rem',
                      }}
                    />
                    <span style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)'}}>
                      <img src="/img/paymethods/payphone.svg" alt="PayPhone" style={{height:'1.5rem'}} />
                    </span>
                  </div>
                </label>
              )}
              {form.metodo === 'deuna' && (
                <label style={{width:'100%'}}>Celular Deuna
                  <div style={{position:'relative', width:'100%'}}>
                    <input
                      name="tarjeta"
                      type="text"
                      value={form.tarjeta}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      placeholder="Número de celular Deuna"
                      style={{
                        width:'100%',
                        paddingRight:'2.2rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.92rem',
                        color: '#2d3436',
                        background: '#fff',
                        height: '2.1rem',
                      }}
                    />
                    <span style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)'}}>
                      <img src="/img/paymethods/deuna.svg" alt="Deuna" style={{height:'1.5rem'}} />
                    </span>
                  </div>
                </label>
              )}
              {/* Solo para tarjeta: vencimiento y cvv */}
              {form.metodo === 'tarjeta' && (
                <div style={{display:'flex', gap:'1rem'}}>
                  <label>Vencimiento
                    <input name="vencimiento" type="text" value={form.vencimiento} onChange={handleChange} required placeholder="MM/AA" maxLength={5} />
                  </label>
                  <label>CVV
                    <input name="cvv" type="password" value={form.cvv} onChange={handleChange} required maxLength={4} />
                  </label>
                </div>
              )}
              <div className="payment-total">Total a pagar: <b>${total}</b></div>
              <button className="save-btn" type="submit">Pagar</button>
            </form>
          </>
        )}

   {step === 2 && (
  <div style={{ padding: '0.5rem 0' }}>
    {/* Botón de Impresión */}
    <div style={{ textAlign: 'right', marginBottom: '10px' }}>
      <button 
        onClick={() => window.print()} 
        style={{ background: '#f0f0f0', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
      >
        🖨️ Imprimir Ticket
      </button>
    </div>

    {/* Detalle de la compra - Compacto para dar espacio al logo */}
    <div style={{marginBottom:'1rem', border:'1px solid #ececff', borderRadius:12, padding:'0.7rem 1rem', background:'#fafaff'}}>
      <h3 style={{margin:'0 0 0.5rem 0', fontSize:'1rem', color:'#764ba2'}}>Resumen de Compra</h3>
      <ul style={{listStyle:'none', padding:0, margin:0, maxHeight: '100px', overflowY: 'auto'}}>
        {cartItems.map((item, i) => (
          <li key={i} style={{padding:'0.2rem 0', borderBottom:'1px solid #eee', fontSize:'0.9rem'}}>
            {item.cantidad} x {item.nombre} <span style={{float:'right'}}>${(item.precio * item.cantidad).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div style={{textAlign:'right', fontSize:'1rem', color:'#667eea', fontWeight:'bold', marginTop: '8px'}}>
        Total: ${total}
      </div>
    </div>

    {/* SECCIÓN DE IDENTIDAD (LOGO Y QR) */}
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      padding: '1rem', background: '#fff', borderRadius: '15px',
      animation: 'bounceIn 0.8s ease'
    }}>
      <div style={{
        background: '#fff',
        padding: '12px',
        borderRadius: '25px',
        boxShadow: '0 8px 20px rgba(102,126,234,0.2)', // Corregido espacio en rgba
        marginBottom: '1rem'
      }}>
        <img src="/img/The-One.png" alt="Logo" style={{ width: '130px', height: 'auto' }} />
      </div>

      <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#764ba2', fontFamily: 'cursive' }}>
        ¡Gracias por elegirnos!
      </h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Tu pedido está en manos expertas 👨‍🍳</p>
      
      {/* Elementos de Validación */}
      <img src={qr} alt="QR" style={{width: '150px', borderRadius:10, border: '4px solid #f0f0f0'}} />
      <div style={{marginTop: '10px', textAlign: 'center'}}>
        <span style={{fontSize:'1rem', color:'#764ba2', fontWeight:600}}>N° de pedido:</span>
        <div style={{fontSize:'1.5rem', color:'#333', fontWeight: 'bold'}}>{orderId}</div>
      </div>
    </div>

    <button 
      className="save-btn" 
      style={{ marginTop: '1rem', width: '100%', padding: '1rem' }} 
      onClick={() => { clearCart(); onClose(); setStep(1); }}
    >
      Finalizar y Cerrar
    </button>
  </div>
        )}
      </div>
    </div>
  );
}
