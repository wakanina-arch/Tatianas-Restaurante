import React, { useState, useEffect, useRef } from 'react';
import ComercioHeader from '../components/ComercioHeader';
import CategoriaTabs from '../components/CategoriaTabs';
import PlatoCard from '../components/PlatoCard';

export default function HomePage({ 
  comercio, 
  platillos, 
  user, 
  itemCount, 
  onOpenPerfil, 
  onOpenMenu, 
  onBackToWelcome,
  NavBarComponent 
}) {
  const [categoriaActiva, setCategoriaActiva] = useState('Primero');
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState({});
  const seccionesRef = useRef({});

  const categorias = [
    { id: 'Primero', nombre: 'COMPLEMENTOS', icono: '🍟' },
    { id: 'Segundo', nombre: 'ENSALADAS', icono: '🥗' },
    { id: 'Bebidas', nombre: 'BEBIDAS', icono: '🥤' },
    { id: 'Pizzas', nombre: 'PIZZAS', icono: '🍕' },
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
    setCarrito(prev => ({
      ...prev,
      [plato.nombre]: cantidad
    }));
  };

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const id = entrada.target.dataset.categoria;
            if (id) setCategoriaActiva(id);
          }
        });
      },
      { threshold: 0.3 }
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header con imagen del comercio (sticky) */}
      <div style={{ position: 'sticky', top: '60px', zIndex: 20 }}>
        <ComercioHeader comercio={comercio} />
      </div>
      
      {/* Tabs de categorías (sticky) */}
      <div style={{ position: 'sticky', top: '260px', zIndex: 15 }}>
        <CategoriaTabs
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onSelectCategoria={scrollASeccion}
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
                plato={{ ...plato, nombre: plato.nombre }}
                onUpdateCart={updateCarrito}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <NavBarComponent
        currentPage="home"
        setCurrentPage={() => {}}
        itemCount={Object.values(carrito).reduce((a, b) => a + b, 0)}
        onOpenMenu={onOpenMenu}
        onOpenPerfil={onOpenPerfil}
        onBackToWelcome={onBackToWelcome}
        user={user}
      />
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
