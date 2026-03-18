import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function PaymentModal({ open, onClose, total, addLog, setPendingOrders }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    tarjeta: '',
    vencimiento: '',
    cvv: '',
    metodo: 'tarjeta',
  });
  const [qr, setQr] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { cartItems, clearCart, addOrder } = useCart();

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    
    setTimeout(() => {
      const generatedId = `ORD-${Math.floor(Math.random() * 900) + 100}`;
      
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

      addOrder(newOrder); 
      if (setPendingOrders) {
        setPendingOrders(prev => [...prev, newOrder]);
      }

      setStep(2);
    }, 1200);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header con botón de cierre */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {step === 1 ? (
              <>
                <span style={styles.titleIcon}>💳</span>
                Pago Seguro
              </>
            ) : (
              <>
                <span style={styles.titleIcon}>✅</span>
                Pago Exitoso
              </>
            )}
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Nombre */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre Completo</label>
              <input 
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                required 
                style={styles.input}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                style={styles.input}
                placeholder="ejemplo@correo.com"
              />
            </div>

            {/* Método de pago */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Método de pago</label>
              <select 
                name="metodo" 
                value={form.metodo} 
                onChange={handleMetodoChange} 
                style={styles.select}
              >
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="bimo">📱 BIMO</option>
                <option value="payphone">📲 PayPhone</option>
                <option value="deuna">🪙 Deuna</option>
              </select>
            </div>

            {/* Campos dinámicos según método */}
            {form.metodo === 'tarjeta' && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Número de Tarjeta</label>
                  <div style={styles.inputWithIcon}>
                    <input
                      name="tarjeta"
                      type="text"
                      value={form.tarjeta}
                      onChange={handleChange}
                      required
                      maxLength={16}
                      placeholder="1234 5678 9012 3456"
                      style={styles.input}
                    />
                    <span style={styles.cardIcon}>
                      {/^4/.test(form.tarjeta) && '💳 Visa'}
                      {/^(5[1-5])/.test(form.tarjeta) && '💳 Mastercard'}
                      {/^(36|38|30[0-5])/.test(form.tarjeta) && '💳 Diners'}
                    </span>
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={{...styles.inputGroup, flex: 1}}>
                    <label style={styles.label}>Vencimiento</label>
                    <input 
                      name="vencimiento" 
                      type="text" 
                      value={form.vencimiento} 
                      onChange={handleChange} 
                      required 
                      placeholder="MM/AA" 
                      maxLength={5} 
                      style={styles.input}
                    />
                  </div>
                  <div style={{...styles.inputGroup, flex: 1}}>
                    <label style={styles.label}>CVV</label>
                    <input 
                      name="cvv" 
                      type="password" 
                      value={form.cvv} 
                      onChange={handleChange} 
                      required 
                      maxLength={4} 
                      placeholder="123" 
                      style={styles.input}
                    />
                  </div>
                </div>
              </>
            )}

            {(form.metodo === 'bimo' || form.metodo === 'payphone' || form.metodo === 'deuna') && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  {form.metodo === 'bimo' && 'Número BIMO'}
                  {form.metodo === 'payphone' && 'Número PayPhone'}
                  {form.metodo === 'deuna' && 'Número Deuna'}
                </label>
                <input
                  name="tarjeta"
                  type="text"
                  value={form.tarjeta}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  placeholder="09XXXXXXXX"
                  style={styles.input}
                />
              </div>
            )}

            {/* Total y botón de pago */}
            <div style={styles.totalContainer}>
              <span style={styles.totalLabel}>Total a pagar:</span>
              <span style={styles.totalAmount}>${total}</span>
            </div>

            <button type="submit" style={styles.payBtn}>
              <span style={styles.payBtnIcon}>🔒</span>
              Pagar Ahora
            </button>
          </form>
        )}

        {step === 2 && (
          <div style={styles.successContainer}>
            {/* Resumen de compra */}
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Resumen de Compra</h3>
              <ul style={styles.itemList}>
                {cartItems.map((item, i) => (
                  <li key={i} style={styles.itemRow}>
                    <span style={styles.itemName}>
                      {item.cantidad} x {item.nombre}
                    </span>
                    <span style={styles.itemPrice}>
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div style={styles.summaryTotal}>
                <span>Total:</span>
                <span style={styles.totalHighlight}>${total}</span>
              </div>
            </div>

            {/* Logo y QR */}
            <div style={styles.successContent}>
              <div style={styles.logoContainer}>
                <img src="/img/The-One.png" alt="Logo" style={styles.logo} />
              </div>

              <h2 style={styles.successTitle}>¡Gracias por elegirnos!</h2>
              <p style={styles.successMessage}>Tu pedido está en manos expertas 👨‍🍳</p>
              
              {qr && (
                <div style={styles.qrContainer}>
                  <img src={qr} alt="QR" style={styles.qrImage} />
                </div>
              )}
              
              <div style={styles.orderInfo}>
                <span style={styles.orderLabel}>N° de pedido:</span>
                <span style={styles.orderNumber}>{orderId}</span>
              </div>
            </div>

            {/* Botón de impresión y finalizar */}
            <div style={styles.successFooter}>
              <button 
                onClick={() => window.print()} 
                style={styles.printBtn}
              >
                <span style={styles.printIcon}>🖨️</span>
                Imprimir Ticket
              </button>

              <button 
                style={styles.finishBtn}
                onClick={() => { clearCart(); onClose(); setStep(1); }}
              >
                Finalizar y Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ESTILOS IPHONE 16
// ============================================
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  modal: {
    width: '100%',
    maxWidth: 480,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 32,
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    overflow: 'hidden'
  },
  header: {
    padding: '1.2rem 1.5rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.5)'
  },
  title: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: '600',
    color: 'var(--verde-selva)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  titleIcon: {
    fontSize: '1.5rem'
  },
  closeBtn: {
    background: 'rgba(0, 0, 0, 0.05)',
    border: 'none',
    width: 36,
    height: 36,
    borderRadius: 18,
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s ease'
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--gris-texto)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: 20,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.95rem',
    background: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease',
    width: '100%'
  },
  select: {
    padding: '0.8rem 1rem',
    borderRadius: 20,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '0.95rem',
    background: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    fontWeight: '500'
  },
  inputWithIcon: {
    position: 'relative',
    width: '100%'
  },
  cardIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.8rem',
    color: 'var(--morado-primario)',
    fontWeight: '600'
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 20,
    marginTop: '0.5rem',
    border: '1px solid rgba(255, 215, 0, 0.2)'
  },
  totalLabel: {
    fontSize: '0.95rem',
    color: 'var(--gris-texto)',
    fontWeight: '500'
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--maracuya)'
  },
  payBtn: {
    padding: '1rem',
    background: 'linear-gradient(135deg, var(--verde-selva) 0%, #2a6b2f 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 30,
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(1, 64, 14, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  payBtnIcon: {
    fontSize: '1rem'
  },
  successContainer: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    padding: '1.2rem',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  summaryTitle: {
    margin: '0 0 0.8rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--verde-selva)'
  },
  itemList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: 120,
    overflowY: 'auto'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    fontSize: '0.9rem'
  },
  itemName: {
    color: 'var(--gris-texto)'
  },
  itemPrice: {
    fontWeight: '600',
    color: 'var(--maracuya)'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.8rem',
    paddingTop: '0.8rem',
    borderTop: '2px solid rgba(255, 215, 0, 0.2)',
    fontSize: '1rem',
    fontWeight: '600'
  },
  totalHighlight: {
    color: 'var(--maracuya)',
    fontSize: '1.2rem'
  },
  successContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  logoContainer: {
    background: 'white',
    padding: '12px',
    borderRadius: 30,
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.15)',
    marginBottom: '0.5rem'
  },
  logo: {
    width: 120,
    height: 'auto'
  },
  successTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '600',
    color: 'var(--verde-selva)',
    textAlign: 'center'
  },
  successMessage: {
    margin: 0,
    fontSize: '0.9rem',
    color: 'var(--gris-texto)',
    textAlign: 'center'
  },
  qrContainer: {
    padding: '0.5rem',
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  qrImage: {
    width: 140,
    height: 140,
    borderRadius: 12
  },
  orderInfo: {
    textAlign: 'center'
  },
  orderLabel: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'var(--gris-texto)',
    marginBottom: '0.2rem'
  },
  orderNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--morado-primario)',
    letterSpacing: '1px'
  },
  successFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  printBtn: {
    padding: '0.8rem',
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: 30,
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  printIcon: {
    fontSize: '1.1rem'
  },
  finishBtn: {
    padding: '1rem',
    background: 'linear-gradient(135deg, var(--morado-primario) 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 30,
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
  }
};

// Estilos hover (se aplican vía className o con eventos onMouseEnter/Leave)
// Se pueden agregar como estilos globales o manejarlos con estados