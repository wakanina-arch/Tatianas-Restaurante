import React, { useState } from 'react';
import { useCart } from './CartContext';
import TicketModal from './TicketModal';

export default function PaymentModal({ open, onClose, total, addLog, setPendingOrders }) {
  const [step, setStep] = useState(1);  // ← Directamente en paso 1 (formulario de pago)
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    tarjeta: '',
    vencimiento: '',
    cvv: '',
    metodo: 'tarjeta',
  });
  const [orderData, setOrderData] = useState(null);
  const [showTicket, setShowTicket] = useState(false);  // ← Nuevo estado para TicketModal
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
          detalle: `Pago con ${form.metodo} aprobado - Total: $${total}`
        });
      }

      const newOrder = {
        id: generatedId,
        numero: generatedId,
        ordenId: generatedId,
        cliente: form.nombre,
        items: cartItems.map(i => ({ 
          id: i.id, 
          nombre: i.nombre, 
          cantidad: i.cantidad, 
          precio: i.precio 
        })),
        total: parseFloat(total),
        metodo: form.metodo,
        fecha: new Date().toISOString()
      };

      addOrder(newOrder); 
      if (setPendingOrders) {
        setPendingOrders(prev => [...prev, newOrder]);
      }

      setOrderData(newOrder);
      setShowTicket(true);      // ← Abrir TicketModal
      setStep(2);                // ← Mantener paso para que no se cierre
    }, 1200);
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
    clearCart();
    onClose();                  // ← Cerrar PaymentModal
    setStep(0);
  };

  return (
    <>
      {/* Modal de pago */}
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
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

          {/* PASO 0 REMOVIDO - El resumen se muestra en CartPage/CartSummary */}

          {step === 1 && (
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* ... formulario completo ... */}
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

          {step === 2 && !showTicket && (
            <div style={styles.processingContainer}>
              <p>Procesando pago...</p>
            </div>
          )}
        </div>
      </div>

      {/* TicketModal independiente */}
      {showTicket && orderData && (
        <TicketModal 
          open={showTicket} 
          onClose={handleCloseTicket} 
          order={orderData} 
        />
      )}
    </>
  );
}


// ============================================
// ESTILOS IPHONE 16
// ============================================
// ============================================
// ESTILOS MINIMALISTAS - COHERENTES CON TICKET
// ============================================
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
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
    maxWidth: 420,
    background: '#FFFFFF',
    borderRadius: 32,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    animation: 'slideUp 0.3s ease-out'
  },
  header: {
    padding: '1rem 1.5rem',
    background: '#FFFFFF',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  titleIcon: {
    fontSize: '1.2rem'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: 16,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#999',
    transition: 'all 0.2s ease'
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  summaryStep: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  summaryTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#01400e',
    margin: 0
  },
  itemsList: {
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 16,
    padding: '1rem',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  itemName: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#01400e'
  },
  itemQty: {
    fontSize: '0.7rem',
    color: '#666'
  },
  itemPrice: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#FF8C42'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#01400e'
  },
  continueBtn: {
    width: '100%',
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #01400e 0%, #2a6b2f 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 30,
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  label: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    padding: '0.7rem 1rem',
    borderRadius: 24,
    border: '1px solid #e0e0e0',
    fontSize: '0.9rem',
    background: '#FFFFFF',
    transition: 'all 0.2s ease',
    width: '100%',
    outline: 'none'
  },
  select: {
    padding: '0.7rem 1rem',
    borderRadius: 24,
    border: '1px solid #e0e0e0',
    fontSize: '0.9rem',
    background: '#FFFFFF',
    cursor: 'pointer',
    fontWeight: '500',
    outline: 'none'
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
    fontSize: '0.7rem',
    color: '#8B5CF6',
    fontWeight: '500'
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    background: '#f8f8f8',
    borderRadius: 28,
    marginTop: '0.5rem'
  },
  totalLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500'
  },
  totalAmount: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#FF8C42'
  },
  payBtn: {
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 30,
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  payBtnIcon: {
    fontSize: '0.9rem'
  }
};

// Animación
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .close-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #666;
  }
  
  input:focus, select:focus {
    border-color: #FF8C42;
    box-shadow: 0 0 0 2px rgba(255, 140, 66, 0.1);
  }
  
  .pay-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}