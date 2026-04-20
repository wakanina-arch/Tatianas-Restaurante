import React, { useState, useEffect, useRef, useCallback } from 'react';
import ComercioHeader from '../components/ComercioHeader';
import CategoriaTabs from '../components/CategoriaTabs';
import PlatoCard from '../components/PlatoCard';
import { useCart } from '../CartContext';

// Animación gelatinosa limpia
if (typeof document !== 'undefined' && !document.getElementById('jelly-style')) {
  const s = document.createElement('style');
  s.id = 'jelly-style';
  s.textContent = `
    @keyframes jellyIn {
      0% { transform: scale(0.98); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
    .jelly-section { animation: jellyIn 0.5s ease both; }
  `;
  document.head.appendChild(s);
}

export default function HomePage({ 
  comercio, platillos, user, setCurrentPage 
}) {
  const [categoriaActiva, setCategoriaActiva] = useState('Picoteo');
  const { addToCart } = useCart();
  
  const seccionesRef = useRef({});
  const isScrollingRef = useRef(false); // Bloqueo para evitar saltos al hacer clic

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
    return platillos?.find(p => p.nombre === categoriaId)?.opciones || [];
  };

  // 1. Efecto para detectar qué categoría está en pantalla
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -70% 0px', // Detecta cuando el título entra en la zona superior
      threshold: 0
    };

    const observerCallback = (entries) => {
      if (isScrollingRef.current) return; // No actualizar si estamos haciendo scroll por clic

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCategoriaActiva(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    Object.values(seccionesRef.current).forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [platillos]);

  // 2. Scroll al hacer clic en Tab
  const scrollASeccion = (categoriaId) => {
    isScrollingRef.current = true;
    setCategoriaActiva(categoriaId);

    const elemento = seccionesRef.current[categoriaId];
    if (elemento) {
      const offset = 140; // Ajuste según la altura de tus headers sticky
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = elemento.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Liberar el bloqueo tras terminar el scroll
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  };

  const updateCarrito = (plato, cantidad) => {
  if (cantidad > 0) {
    addToCart({
      id: plato.id || plato.nombre,  // ← ID FIJO (sin Date.now)
      nombre: plato.nombre,
      precio: plato.precio,
      precioOriginal: plato.precioOriginal || plato.precio,  // ← AÑADIR
      enOferta: plato.enOferta || false,                      // ← AÑADIR
      descuentoAplicado: plato.descuentoAplicado || 0,        // ← AÑADIR
      tagPromo: plato.tagPromo || '',                         // ← AÑADIR
      cantidad: cantidad,
      imagen: plato.imagen
    });
  }
};

  if (!comercio) return <div style={{ color: 'white', textAlign: 'center' }}>Cargando...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#2a1414' }}>
      
      <div style={{ position: 'sticky', top: 0, zIndex: 30 }}>
        <ComercioHeader comercio={comercio} />
        <CategoriaTabs
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onSelectCategoria={scrollASeccion}
          setCurrentPage={setCurrentPage}
          user={user}
        />
      </div>
      
      <div style={{ flex: 1, paddingBottom: '100px' }}>
        {categorias.map((cat, i) => (
          <div
            key={cat.id}
            id={cat.id}
            ref={(el) => (seccionesRef.current[cat.id] = el)}
            className="jelly-section"
            style={{ animationDelay: `${i * 0.05}s`, marginBottom: '20px' }}
          >
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
    padding: '20px 16px 10px',
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#00c805',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
};
