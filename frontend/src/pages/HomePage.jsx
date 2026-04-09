import React, { useState, useEffect, useRef } from 'react';
import ComercioHeader from '../components/ComercioHeader';
import CategoriaTabs from '../components/CategoriaTabs';
import PlatoCard from '../components/PlatoCard';
import { useCart } from '../CartContext';

// Inyectar animación gelatinosa
if (typeof document !== 'undefined' && !document.getElementById('jelly-style')) {
  const s = document.createElement('style');
  s.id = 'jelly-style';
  s.textContent = `
    @keyframes jellyIn {
      0% { transform: scale(0.99); opacity: 0.4; }
      100% { transform: scale(1); opacity: 1; }
    }
    .jelly-section {
      animation: jellyIn 0.6s ease both;
    }
  `;
  document.head.appendChild(s);
}


export default function HomePage({ 
  comercio, 
  platillos, 
  user, 
  itemCount, 
  onOpenPerfil, 
  onOpenMenu, 
  onBackToWelcome,
  setCurrentPage
}) {
  const [categoriaActiva, setCategoriaActiva] = useState('Primero');
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState({});
  const seccionesRef = useRef({});
  const sentinelRef = useRef({});
  const { addToCart } = useCart();

  const categorias = [
  { id: 'Picoteo', nombre: 'PICOTEO', icono: '🍢' },
  { id: 'Entrantes', nombre: 'ENTRANTES', icono: '🍤' },
  { id: 'Gourmets', nombre: 'GOURMETS', icono: '🍷' },
  { id: 'Escuderos', nombre: 'ESCUDEROS', icono: '🥘' },
  { id: 'Zombies', nombre: 'ZOMBIES', icono: '🍕' },
  { id: 'FastFurious', nombre: 'FAST&FURIOUS', icono: '🏎️' },
  { id: 'Postres', nombre: 'POSTRES', icono: '🍰' },
  { id: 'Bebidas', nombre: 'BEBIDAS', icono: '🥤' },
];

  const platillosPorCategoria = (categoriaId) => {
  const categoria = platillos.find(p => p.nombre === categoriaId);
  return categoria?.opciones || [];
};

  const scrollASeccion = (categoriaId) => {
    setCategoriaActiva(categoriaId);
    seccionesRef.current[categoriaId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateCarrito = (plato, cantidad) => {
  if (cantidad > 0) {
    addToCart({
      id: plato.id || `${plato.nombre}-${Date.now()}`,
      nombre: plato.nombre,
      precio: plato.precio,
      cantidad: cantidad,
      imagen: plato.imagen || plato.imagenes?.[0],
    });
  }
};

  useEffect(() => {
    // Scroll listener: la línea trigger está a 360px del top (debajo de tabs)
    const TRIGGER_LINE = 360;
    
    const handleScroll = () => {
      let categoriaVisible = null;
      // Recorrer sentinels y encontrar el último cuyo top ya pasó la línea trigger
      const ids = categorias.map(c => c.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = sentinelRef.current[ids[i]];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= TRIGGER_LINE) {
            categoriaVisible = ids[i];
            break;
          }
        }
      }
      if (categoriaVisible && categoriaVisible !== categoriaActiva) {
        setCategoriaActiva(categoriaVisible);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Chequear estado inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [categorias, categoriaActiva]);

  if (!comercio) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando comercio...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#2a1414' }}>
      {/* Header con imagen del comercio (sticky) */}
      <div style={{ position: 'sticky', top: '60px', zIndex: 20 }}>
        <ComercioHeader comercio={comercio} />
      </div>
      
      {/* Tabs de categorías (sticky) */}
      <div style={{ position: 'sticky', top: '300px', zIndex: 15 }}>
        <CategoriaTabs
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onSelectCategoria={scrollASeccion}
          setCurrentPage={setCurrentPage}
          user={user}
        />
      </div>
      
      {/* Contenido principal (scroll) */}
      <div style={{ flex: 1 }}>
        {categorias.map((cat, i) => (
          <div
            key={cat.id}
            ref={(el) => (seccionesRef.current[cat.id] = el)}
            data-categoria={cat.id}
            className="jelly-section"
            style={{ scrollMarginTop: '320px', animationDelay: `${i * 0.07}s` }}
          >
            {/* Sentinel: línea invisible que activa el tab al cruzar bajo los tabs */}
            <div
              ref={(el) => (sentinelRef.current[cat.id] = el)}
              data-categoria={cat.id}
              style={{ height: '1px', background: '#2a1414', margin: 0, padding: 0 }}
            />
            <h3 style={styles.seccionTitulo}>{cat.nombre}</h3>
            {platillosPorCategoria(cat.id).map((plato, idx) => (
      <PlatoCard 
  key={`${cat.id}-${idx}`} 
  plato={plato} 
  onUpdateCart={updateCarrito} 
/>
    ))}
  </div>
))}
      </div>
    </div>
  );
}

const styles = {
  seccionTitulo: {
    padding: '12px 16px 6px',
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#037b05',
    letterSpacing: '0.5px',
    textShadow: '0 1px 3px rgba(0,0,0,0.3), 0 0 12px rgba(1, 64, 14, 0.25)',
  },
};
