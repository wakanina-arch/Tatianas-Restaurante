import React, { useState, useEffect, useRef } from 'react';
import ComercioHeader from '../components/ComercioHeader';
import CategoriaTabs from '../components/CategoriaTabs';
import PlatoCard from '../components/PlatoCard';
import { useCart } from '../CartContext';
import NosotrosSection from '../components/NosotrosSection';

// Animación gelatinosa limpia (nanométrica)
if (typeof document !== 'undefined' && !document.getElementById('jelly-style')) {
  const s = document.createElement('style');
  s.id = 'jelly-style';
  s.textContent = `
    @keyframes jellyIn {
      0% { transform: scale(0.98); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
    .jelly-section { animation: jellyIn 0.4s ease both; }
  `;
  document.head.appendChild(s);
}

const CATEGORIAS_LIST = [
  { id: 'Picoteo', nombre: 'PICOTEO', icono: '🍢' },
  { id: 'Entrantes', nombre: 'ENTRANTES', icono: '🍤' },
  { id: 'Gourmets', nombre: 'GOURMETS', icono: '🍷' },
  { id: 'Escuderos', nombre: 'ESCUDEROS', icono: '🥘' },
  { id: 'Zombies', nombre: 'ZOMBIES', icono: '🍕' },
  { id: 'FastFurious', nombre: 'FAST&FURIOUS', icono: '🏎️' },
  { id: 'Postres', nombre: 'POSTRES', icono: '🍰' },
  { id: 'Bebidas', nombre: 'BEBIDAS', icono: '🥤' },
  { id: 'Nosotros', nombre: 'NOSOTROS', icono: '🏪' },
];

// DATOS DEMO AUTOMÁTICOS
const COMERCIO_DEMO = {
  id: 1,
  nombre: "ONO TO ONE",
  direccion: "Calle Principal 123",
  telefono: "600 000 000",
  descripcion: "Sabores únicos que conectan contigo. Cocina de autor con ingredientes frescos y pasión por el buen comer."
};

const PLATILLOS_DEMO = [
  { nombre: 'Picoteo', opciones: [
    { id: 1, nombre: 'Papas fritas con salsa brava', precio: 4.50 },
    { id: 2, nombre: 'Nuggets de pollo crujientes', precio: 5.00 },
    { id: 3, nombre: 'Aros de cebolla', precio: 4.00 }
  ]},
  { nombre: 'Entrantes', opciones: [
    { id: 4, nombre: 'Ensalada César', precio: 7.50 },
    { id: 5, nombre: 'Bruschetta italiana', precio: 6.00 },
    { id: 6, nombre: 'Croquetas caseras', precio: 6.50 }
  ]},
  { nombre: 'Gourmets', opciones: [
    { id: 7, nombre: 'Solomillo al foie', precio: 18.00 },
    { id: 8, nombre: 'Risotto de setas', precio: 14.50 },
    { id: 9, nombre: 'Carrillera al vino tinto', precio: 16.00 }
  ]},
  { nombre: 'Escuderos', opciones: [
    { id: 10, nombre: 'Cocido completo', precio: 12.00 },
    { id: 11, nombre: 'Lentejas estofadas', precio: 9.00 }
  ]},
  { nombre: 'Zombies', opciones: [
    { id: 12, nombre: 'Pizza zombie', precio: 11.00 },
    { id: 13, nombre: 'Burger zombie doble carne', precio: 10.50 }
  ]},
  { nombre: 'FastFurious', opciones: [
    { id: 14, nombre: 'Perrito racing', precio: 6.00 },
    { id: 15, nombre: 'Wrap nitro', precio: 7.50 }
  ]},
  { nombre: 'Postres', opciones: [
    { id: 16, nombre: 'Tarta de queso', precio: 4.50 },
    { id: 17, nombre: 'Brownie con helado', precio: 5.00 }
  ]},
  { nombre: 'Bebidas', opciones: [
    { id: 18, nombre: 'Refresco', precio: 2.00 },
    { id: 19, nombre: 'Cerveza artesana', precio: 3.50 }
  ]},
];

export default function HomePage({ comercio: comercioProp, platillos: platillosProp, user, setCurrentPage }) {
  const [comercio, setComercio] = useState(COMERCIO_DEMO);
  const [platillos, setPlatillos] = useState(PLATILLOS_DEMO);
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIAS_LIST[0].id);
  const { addToCart } = useCart();
  
  const seccionesRef = useRef({});
  const sentinelRef = useRef({});
  const bloqueoSincronizacionRef = useRef(false);

  useEffect(() => {
    if (comercioProp && Object.keys(comercioProp).length > 0) setComercio(comercioProp);
    if (platillosProp && platillosProp.length > 0) setPlatillos(platillosProp);
  }, [comercioProp, platillosProp]);

  const platillosPorCategoria = (categoriaId) => {
    if (categoriaId === 'Nosotros') return [];
    return platillos?.find(p => p.nombre === categoriaId)?.opciones || [];
  };

  const scrollASeccion = (categoriaId) => {
    bloqueoSincronizacionRef.current = true;
    setCategoriaActiva(categoriaId);
    const sentinel = sentinelRef.current[categoriaId] || document.querySelector(`[data-categoria="${categoriaId}"]`);
    if (sentinel) {
      const offset = 300;
      const top = sentinel.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
    setTimeout(() => { bloqueoSincronizacionRef.current = false; }, 600);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const TRIGGER_LINE = 300;
      let categoriaVisible = CATEGORIAS_LIST[0].id;
      for (let i = CATEGORIAS_LIST.length - 1; i >= 0; i--) {
        const cat = CATEGORIAS_LIST[i];
        const el = sentinelRef.current[cat.id] || document.querySelector(`[data-categoria="${cat.id}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= TRIGGER_LINE) { categoriaVisible = cat.id; break; }
        }
      }
      if (categoriaVisible !== categoriaActiva) setCategoriaActiva(categoriaVisible);
    }, 500);
    return () => clearInterval(interval);
  }, [categoriaActiva]);

  const updateCarrito = (plato, cantidad) => {
    if (cantidad > 0) {
      addToCart({
        id: plato.id || plato.nombre,
        nombre: plato.nombre,
        precio: plato.precio,
        precioOriginal: plato.precioOriginal || plato.precio,
        enOferta: plato.enOferta || false,
        descuentoAplicado: plato.descuentoAplicado || 0,
        tagPromo: plato.tagPromo || '',
        cantidad: cantidad,
        imagen: plato.imagen
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#2a1414' }}>
      
      {/* HERO + TABS FIJOS */}
      <div style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 100, background: '#2a1414' }}>
        <ComercioHeader comercio={comercio} />
        <CategoriaTabs categorias={CATEGORIAS_LIST} categoriaActiva={categoriaActiva} onSelectCategoria={scrollASeccion} setCurrentPage={setCurrentPage} user={user} />
      </div>

      {/* ESPACIADOR */}
      <div style={{ height: '190px', flexShrink: 0 }} />

      {/* CONTENIDO SCROLLEABLE */}
      <div style={{ flex: 1, paddingBottom: '120px' }}>
        {CATEGORIAS_LIST.filter(c => c.id !== 'Nosotros').map((cat, i) => (
          <div key={cat.id} id={cat.id} ref={(el) => (seccionesRef.current[cat.id] = el)} className="jelly-section" style={{ scrollMarginTop: '300px', animationDelay: `${i * 0.04}s` }}>
            <div ref={(el) => (sentinelRef.current[cat.id] = el)} data-categoria={cat.id} style={{ height: '10px', margin: 0, padding: 0, background: 'transparent' }} />
            <h3 style={S.seccionTitulo}>{cat.nombre}</h3>
            {platillosPorCategoria(cat.id).map((plato, idx) => (
              <PlatoCard key={`${cat.id}-${idx}`} plato={plato} onUpdateCart={updateCarrito} />
            ))}
          </div>
        ))}

        {/* SECCIÓN NOSOTROS */}
        <div 
          id="Nosotros"
          ref={(el) => (seccionesRef.current['Nosotros'] = el)}
          className="jelly-section"
          style={S.nosotrosContainer}
        >
          <div 
            ref={(el) => (sentinelRef.current['Nosotros'] = el)} 
            data-categoria="Nosotros" 
            style={S.sentinel} 
          />
          <h3 style={S.seccionTitulo}>🏪 NOSOTROS</h3>
          <NosotrosSection comercio={comercio} editMode={false} />
        </div>
      </div>
    </div>
  );
}

const S = {
  seccionTitulo: {
    padding: '20px 14px 6px', 
    margin: 0, 
    fontSize: '1rem', 
    fontWeight: '800',
    color: '#00c805', 
    letterSpacing: '0.8px', 
    textTransform: 'uppercase', 
    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
  },
  nosotrosContainer: {
    scrollMarginTop: '290px', 
    marginTop: '32px',
    paddingBottom: '60px',
    marginBottom: '40px',
  },
  sentinel: {
    height: '10px', 
    margin: 0, 
    padding: 0, 
    background: 'transparent',
  },
};