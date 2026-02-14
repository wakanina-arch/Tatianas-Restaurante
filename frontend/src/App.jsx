import { useState, useEffect } from 'react'; // Corregido: useEffect con doble 'f'
import AdminPage from './AdminPage';
import OrdersDrawer from './OrdersDrawer';
import './App.css';
import { CartProvider, useCart } from './CartContext';

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}

function MainApp() {
  const { itemCount } = useCart();
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  
  // --- 1. ESTADO DEL MENÚ CON MEMORIA ---
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('restaurante_menu');
    return saved ? JSON.parse(saved) : [
      {
      id: 1,
      nombre: 'Primero',
      precio: 5.50,
      region: 'Andes',
      historia: 'Plato típico andino hecho con harina de maíz blanco molida. La arepa es un alimento básico en muchas culturas latinoamericanas.',
      calorias: 380,
      proteina: 12,
      carbohidratos: 48,
      opciones: [
        { nombre: 'Menestra', calorias: 320, proteina: 8, carbohidratos: 45, descripcion: 'Mezcla de verduras frescas sauteadas con cebolla y especias. Ligera y nutritiva.' },
        { nombre: 'Guatita', calorias: 380, proteina: 16, carbohidratos: 42, descripcion: 'Estómago de res cocinado en salsa cremosa con especias. Plato tradicional muy sabroso.' },
        { nombre: 'Pollo', calorias: 420, proteina: 28, carbohidratos: 38, descripcion: 'Pechuga de pollo tierna marinada en especias andinas. Alto en proteína y delicioso.' }
      ]
    },
    {
      id: 2,
      nombre: 'Segundo',
      precio: 8.00,
      region: 'Costa',
      historia: 'Tradicional plato costero marinero con pescado fresco marinado en limón con cebolla roja, cilantro y ají.',
      calorias: 250,
      proteina: 32,
      carbohidratos: 15,
      opciones: [
        { nombre: 'Pescado', calorias: 280, proteina: 35, carbohidratos: 12, descripcion: 'Filete de pescado blanco fresco marinado en limón. Suave y sabroso del mar.' },
        { nombre: 'Camarón', calorias: 320, proteina: 38, carbohidratos: 10, descripcion: 'Camarones frescos al limón con cilantro. Delicadeza marina con sabor intenso.' },
        { nombre: 'Mixto', calorias: 300, proteina: 36, carbohidratos: 11, descripcion: 'Combinación de pescado y camarón marinados juntos. Lo mejor de ambos mundos.' }
      ]
    },
    {
      id: 3,
      nombre: 'Postre',
      precio: 4.50,
      region: 'Puno',
      historia: 'Superfood andino que fue alimento sagrado de los incas. Rico en proteína completa con todos los aminoácidos esenciales.',
      calorias: 220,
      proteina: 8,
      carbohidratos: 38,
      opciones: [
        { nombre: 'Flan', calorias: 200, proteina: 4, carbohidratos: 32, descripcion: 'Flan cremoso con caramelo. Postre suave y delicado perfecto para terminar.' },
        { nombre: 'Pudín', calorias: 240, proteina: 6, carbohidratos: 38, descripcion: 'Pudín espeso de chocolate. Indulgente y reconfortante para los amantes del chocolate.' },
        { nombre: 'Helado', calorias: 280, proteina: 5, carbohidratos: 42, descripcion: 'Helado artesanal con frutas frescas. Refrescante y natural sin colorantes artificiales.' }
      ]
    }
    ];
  });

  // --- 2. ESTADOS DE PEDIDOS Y LOGS CON MEMORIA ---
  const [pendingOrders, setPendingOrders] = useState(() => {
    const saved = localStorage.getItem('restaurante_pending');
    return saved ? JSON.parse(saved) : [];
  });

  const [log, setLog] = useState(() => {
    const saved = localStorage.getItem('restaurante_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [finishedOrders, setFinishedOrders] = useState([]); 
  const [payOpen, setPayOpen] = useState(false);

  // --- 3. EFECTOS PARA GUARDAR AUTOMÁTICAMENTE ---
  useEffect(() => {
    localStorage.setItem('restaurante_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('restaurante_pending', JSON.stringify(pendingOrders));
  }, [pendingOrders]);

  useEffect(() => {
    localStorage.setItem('restaurante_logs', JSON.stringify(log));
  }, [log]);

  const handleSaveMenu = (updatedMenu) => setMenuItems(updatedMenu);
  const addLog = (entry) => setLog((prev) => [...prev, entry]);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">🍽️ One To One</h1>
          <div className="nav-links">
            <button className={currentPage === 'home' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('home')}>Menú</button>
            <button className={currentPage === 'carrito' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('carrito')}>
              🛒 Carrito {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            <button className={currentPage === 'admin' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentPage('admin')}>Dashboard</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && <HomePage platillos={menuItems} />}
        {currentPage === 'carrito' && <CartPage addLog={addLog} setPendingOrders={setPendingOrders} />}
        {currentPage === 'admin' && (
          <AdminPage
            menuItems={menuItems}
            onSaveMenu={handleSaveMenu}
            log={log}
            addLog={addLog}
            pendingOrders={pendingOrders}
            setPendingOrders={setPendingOrders}
            finishedOrders={finishedOrders}
            setFinishedOrders={setFinishedOrders}
          />
        )}
      </main>
    </div>
  );
}

function HomePage({ platillos }) {
  const { addToCart } = useCart();
  return (
    <section className="home-page">
      <div className="hero" style={{textAlign:'center'}}>
        <img src="/The-One-icon.png" alt="Logo One To One" style={{width:'90px',height:'90px',marginBottom:'0.5rem',borderRadius:'22px',boxShadow:'0 4px 18px rgba(118,75,162,0.13)'}} />
        <h2 style={{marginBottom:'0.3rem'}}>One To One 🎉</h2>
        
        <p style={{marginBottom:'0.5rem'}}>Bienvenidos, descubre nuestros deliciosos menús diarios con platos típicos</p>
      </div>
      <div className="menu-container">
        {platillos.map((platillo) => (
          <MenuItem 
            key={platillo.id} 
            item={platillo}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}

function MenuItem({ item, addToCart }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const getSelectedNutrition = () => {
    if (selectedOption) {
      const selected = item.opciones.find(o => o.nombre === selectedOption);
      return selected || { calorias: item.calorias, proteina: item.proteina, carbohidratos: item.carbohidratos };
    }
    return { calorias: item.calorias, proteina: item.proteina, carbohidratos: item.carbohidratos };
  };

  const getSelectedDescription = () => {
    if (selectedOption) {
      const selected = item.opciones.find(o => o.nombre === selectedOption);
      return selected?.descripcion || item.historia;
    }
    return item.historia;
  };

  const nutrition = getSelectedNutrition();
  const description = getSelectedDescription();

 const handleAddToCart = () => {
  // Si NO hay opción seleccionada, no hacer nada
  if (!selectedOption) {
    alert('Por favor selecciona una opción del plato');  // Mensaje amigable
    return;  // ← IMPORTANTE: Salir de la función sin añadir
  }

  // Si llegamos aquí, SÍ hay opción seleccionada
  const itemToAdd = { 
    ...item, 
    id: item.id + '-' + selectedOption,
    variante: selectedOption,
    nombre: `${item.nombre} - ${selectedOption}`
  };
  
  addToCart(itemToAdd);
  setSelectedOption(null);  // Limpiar selección después de añadir
};

   // --- LÓGICA DE LA CAJA VISUAL INTELIGENTE ---
  const renderVisualMedia = (url) => {
    // Detecta si es video por la extensión
    const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(url);
    
    if (isVideo) {
      return (
        <video 
          src={url} 
          autoPlay loop muted playsInline 
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
        />
      );
    }
    return (
      <img 
        src={url || '/img/default-food.jpg'} 
        alt={item.nombre} 
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
      />
    );
  };

  return (
    <div className="food-card" style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '15px', marginBottom: '1rem' }}>
      
      {/* 1. CAJA VISUAL INTELIGENTE */}
      <div className="media-box" style={{ marginBottom: '1rem' }}>
        {renderVisualMedia(item.imagen)}
      </div>
      <div className="food-info">
        <h3>{item.nombre}</h3>
        <p className="food-description">{description}</p>

        {/* CHECKBOX DE OPCIONES */}
        {Array.isArray(item.opciones) && item.opciones.length > 0 && (
          <div className="opciones">
            {item.opciones.slice(0, 3).map((op, idx) => (
              <label className="opcion-label" key={op.nombre} style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem'}}>
                <span style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                  <input
                    type="checkbox"
                    checked={selectedOption === op.nombre}
                    onChange={() => setSelectedOption(selectedOption === op.nombre ? null : op.nombre)}
                  />
                  <span>{op.nombre}</span>
                </span>
                <span style={{marginLeft:'auto', fontWeight:600, color:'#667eea', minWidth:60, textAlign:'right'}}>
                  ${op.precio ? Number(op.precio).toFixed(2) : item.precio.toFixed(2)}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* SECCIÓN NUTRICIONAL DINÁMICA */}
        <div className="nutrition-container">
          <div className="nutri-chip">{nutrition.calorias} Kcal</div>
          <div className="nutri-chip">{nutrition.proteina}g Prot</div>
          <div className="nutri-chip">{nutrition.carbohidratos}g Carbs</div>
        </div>

        <div className="card-footer" style={{marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span className="item-price">{
            selectedOption
              ? `$${item.precio.toFixed(2)}`
              : '$0.00'
          }</span>
          
          <button className="add-btn-small" onClick={handleAddToCart} title="Añadir al carrito"> Añadir
            <span role="img" aria-label="One To One" style={{fontSize: '1.3rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 1px 2px #764ba2aa)'}}>
              🍽️
            </span>            
          </button>
        </div>
      </div>
    </div>
  );
}

import PaymentModal from './PaymentModal';

function CartPage({ addLog, setPendingOrders }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart();
  const [payOpen, setPayOpen] = useState(false);
  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h2>Tu Carrito</h2>
        <div className="empty-state">
          <p>Tu carrito está vacío. ¡Agrega platos deliciosos! 🛒</p>
        </div>
      </section>
    );
  }



  return (
    <section className="cart-page">
      <h2>Tu Carrito 🛒</h2>
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.nombre}</h4>
                <p className="item-price">${item.precio.toFixed(2)}</p>
              </div>
              <div className="cart-item-controls">
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, (item.cantidad || 1) - 1)}
                >
                  -
                </button>
                <span className="qty">{item.cantidad || 1}</span>
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, (item.cantidad || 1) + 1)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                <p>${(item.precio * (item.cantidad || 1)).toFixed(2)}</p>
              </div>
              <button 
                className="delete-btn"
                onClick={() => removeFromCart(item.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total}</span>
          </div>
          <div className="summary-row">
            <span>Envío:</span>
            <span>Gratis</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span className="total-amount">${total}</span>
          </div>
          <button className="checkout-btn" onClick={() => setPayOpen(true)}>Proceder al Pago</button>
          <button className="clear-btn" onClick={clearCart}>Vaciar Carrito</button>
        </div>
      </div>
      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} total={total}
        addLog={addLog}
        setPendingOrders={setPendingOrders} />
    </section>
  );
}

function OrdersPage() {
  return (
    <section className="orders-page">
      <h2>Mis Pedidos</h2>
      <div className="empty-state">
        <p>Aún no tienes pedidos. ¡Haz tu primer pedido ahora! 🛒</p>
      </div>
    </section>
  );
}

function ProfilePage({ user, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Lógica de login
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }
      setUser({ email, name: 'Usuario' });
      setEmail('');
      setPassword('');
    } else {
      // Lógica de registro
      if (!name || !email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      setUser({ email, name });
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  if (user) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <h2>👤 Mi Perfil</h2>
            <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
          <div className="profile-info">
            <div className="info-row">
              <label>Nombre:</label>
              <p>{user.name}</p>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <div className="info-row">
              <label>Estado:</label>
              <p className="status-active">✅ Activo</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn">
              {isLogin ? 'Ingresar' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Registrate aquí' : 'Inicia sesión aquí'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
