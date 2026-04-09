import React, { useState, useEffect, useRef } from 'react';
import ComercioHeader from '../components/ComercioHeader';
import CategoriaTabs from '../components/CategoriaTabs';
import PlatoCard from '../components/PlatoCard';
import { useCart } from '../CartContext';


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
    const observador = new IntersectionObserver(
      (entradas) => {
        // Solo detectar cuando un elemento entra por la PARTE SUPERIOR
        entradas.forEach((entrada) => {
          // Si el elemento está intersectando y el ratio es alto (> 50%)
          // significa que está completamente visible
          if (entrada.isIntersecting && entrada.intersectionRatio > 0.5) {
            const id = entrada.target.dataset.categoria;
            if (id) {
              setCategoriaActiva(id);
            }
          }
        });
      },
      { 
        threshold: [0.5],  // Solo cuando está >50% visible
        rootMargin: '-60px 0px -50% 0px'  // Detecta cuando llega a TOP
      }
    );

    Object.values(seccionesRef.current).forEach((el) => {
      if (el) observador.observe(el);
    });

    return () => observador.disconnect();
  }, []);

  if (!comercio) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando comercio...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#1a0a0a' }}>
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
        {categorias.map((cat) => (
          <div
            key={cat.id}
            ref={(el) => (seccionesRef.current[cat.id] = el)}
            data-categoria={cat.id}
            style={{ scrollMarginTop: '320px' }}
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
    padding: '12px 16px 6px',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#01400e',
    margin: 0,
  },
};
