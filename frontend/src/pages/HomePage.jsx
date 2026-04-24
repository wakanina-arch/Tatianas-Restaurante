// HomePage.jsx - Versión definitiva con demo automática

import React, { useState, useEffect, useRef } from 'react';
import ComercioHeader from '../components/ComercioHeader';
import CategoriaTabs from '../components/CategoriaTabs';
import PlatoCard from '../components/PlatoCard';
import { useCart } from '../CartContext';

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
  { id: 'Nosotros', nombre: 'NOSOTROS', icono: '⚙️' },
];

// ✅ DATOS DEMO AUTOMÁTICOS (ONO TO ONE)
const COMERCIO_DEMO = {
  id: 1,
  nombre: "ONO TO ONE",
  direccion: "Calle Principal 123",
  telefono: "600 000 000",
  descripcion: "Sabores únicos que conectan contigo. Cocina de autor con ingredientes frescos y pasión por el buen comer."
};

const PLATILLOS_DEMO = [
  { 
    nombre: 'Picoteo', 
    opciones: [
      { id: 1, nombre: 'Papas fritas con salsa brava', precio: 4.50, imagen: '/papas.jpg' },
      { id: 2, nombre: 'Nuggets de pollo crujientes', precio: 5.00, imagen: '/nuggets.jpg' },
      { id: 3, nombre: 'Aros de cebolla', precio: 4.00, imagen: '/aros.jpg' }
    ] 
  },
  { 
    nombre: 'Entrantes', 
    opciones: [
      { id: 4, nombre: 'Ensalada César', precio: 7.50, imagen: '/ensalada.jpg' },
      { id: 5, nombre: 'Bruschetta italiana', precio: 6.00, imagen: '/bruschetta.jpg' },
      { id: 6, nombre: 'Croquetas caseras', precio: 6.50, imagen: '/croquetas.jpg' }
    ] 
  },
  { 
    nombre: 'Gourmets', 
    opciones: [
      { id: 7, nombre: 'Solomillo al foie', precio: 18.00, imagen: '/solomillo.jpg' },
      { id: 8, nombre: 'Risotto de setas', precio: 14.50, imagen: '/risotto.jpg' },
      { id: 9, nombre: 'Carrillera al vino tinto', precio: 16.00, imagen: '/carrillera.jpg' }
    ] 
  },
  { 
    nombre: 'Escuderos', 
    opciones: [
      { id: 10, nombre: 'Cocido completo', precio: 12.00, imagen: '/cocido.jpg' },
      { id: 11, nombre: 'Lentejas estofadas', precio: 9.00, imagen: '/lentejas.jpg' }
    ] 
  },
  { 
    nombre: 'Zombies', 
    opciones: [
      { id: 12, nombre: 'Pizza zombie (pepperoni extra)', precio: 11.00, imagen: '/pizza.jpg' },
      { id: 13, nombre: 'Burger zombie doble carne', precio: 10.50, imagen: '/burger.jpg' }
    ] 
  },
  { 
    nombre: 'FastFurious', 
    opciones: [
      { id: 14, nombre: 'Perrito racing', precio: 6.00, imagen: '/perrito.jpg' },
      { id: 15, nombre: 'Wrap nitro', precio: 7.50, imagen: '/wrap.jpg' }
    ] 
  },
  { 
    nombre: 'Postres', 
    opciones: [
      { id: 16, nombre: 'Tarta de queso', precio: 4.50, imagen: '/tarta.jpg' },
      { id: 17, nombre: 'Brownie con helado', precio: 5.00, imagen: '/brownie.jpg' }
    ] 
  },
  { 
    nombre: 'Bebidas', 
    opciones: [
      { id: 18, nombre: 'Refresco', precio: 2.00, imagen: '/refresco.jpg' },
      { id: 19, nombre: 'Cerveza artesana', precio: 3.50, imagen: '/cerveza.jpg' }
    ] 
  },
];

export default function HomePage({ comercio: comercioProp, platillos: platillosProp, user, setCurrentPage }) {
  // ✅ Estado local con datos demo por defecto
  const [comercio, setComercio] = useState(COMERCIO_DEMO);
  const [platillos, setPlatillos] = useState(PLATILLOS_DEMO);
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIAS_LIST[0].id);
  const { addToCart } = useCart();
  
  const seccionesRef = useRef({});
  const sentinelRef = useRef({});
  const bloqueoSincronizacionRef = useRef(false);
  const isScrollingProgrammatically = useRef(false);

  // ✅ Cargar datos de props si existen (sobreescribe demo)
  useEffect(() => {
    if (comercioProp && Object.keys(comercioProp).length > 0) {
      setComercio(comercioProp);
    }
    if (platillosProp && platillosProp.length > 0) {
      setPlatillos(platillosProp);
    }
  }, [comercioProp, platillosProp]);

  // 📐 ALTURAS EXACTAS
  const HEADER_HEIGHT = 56;
  const TABS_HEIGHT = 48;
  const OFFSET_TOP = HEADER_HEIGHT + TABS_HEIGHT + 8;

  const platillosPorCategoria = (categoriaId) => {
    if (categoriaId === 'Nosotros') return [];
    const categoriaPlatillos = platillos?.find(p => p.nombre === categoriaId);
    return categoriaPlatillos?.opciones || [];
  };

  const scrollASeccion = (categoriaId) => {
  bloqueoSincronizacionRef.current = true;
  setCategoriaActiva(categoriaId);

  // Buscar el centinela (más fiable que el div completo)
  const sentinel = sentinelRef.current[categoriaId] || document.querySelector(`[data-categoria="${categoriaId}"]`);
  
  if (sentinel) {
    const offset = 340; // Altura del Hero + Tabs
    const top = sentinel.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth'
    });
  }
  
  // Liberar el bloqueo después de que termine el scroll
  setTimeout(() => { 
    bloqueoSincronizacionRef.current = false; 
  }, 600);
};

  // Sincronización tabs ↔ scroll
  // 🚨 PARCHE TEMPORAL: Sincronización forzada cada 500ms
useEffect(() => {
  const interval = setInterval(() => {
    const TRIGGER_LINE = 340;
    let categoriaVisible = CATEGORIAS_LIST[0].id;
    
    for (let i = CATEGORIAS_LIST.length - 1; i >= 0; i--) {
      const cat = CATEGORIAS_LIST[i];
      const el = sentinelRef.current[cat.id] || document.querySelector(`[data-categoria="${cat.id}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= TRIGGER_LINE) {
          categoriaVisible = cat.id;
          break;
        }
      }
    }
    
    if (categoriaVisible !== categoriaActiva) {
      console.log('🔄 Sincronizando tab a:', categoriaVisible);
      setCategoriaActiva(categoriaVisible);
    }
  }, 500); // Cada medio segundo

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

  // Ya no es necesario el check de !comercio porque siempre hay demo
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#2a1414' }}>
      
      {/* HERO + TABS - ABSOLUTAMENTE FIJOS (NO SCROLL) */}
      <div style={{
        position: 'fixed',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#2a1414'
      }}>
        <ComercioHeader comercio={comercio} />
        <CategoriaTabs
          categorias={CATEGORIAS_LIST}
          categoriaActiva={categoriaActiva}
          onSelectCategoria={scrollASeccion}
          setCurrentPage={setCurrentPage}
          user={user}
        />
      </div>

      {/* ESPACIADOR INVISIBLE (Empuja el contenido debajo del Hero + Tabs) */}
      <div style={{ height: '250px ', flexShrink: 0 }} />

      {/* CONTENIDO SCROLLEABLE */}
      <div style={{ flex: 1, paddingBottom: '80px' }}>
        {CATEGORIAS_LIST.filter(c => c.id !== 'Nosotros').map((cat, i) => (
  <div
  key={cat.id}
  id={cat.id}
  ref={(el) => (seccionesRef.current[cat.id] = el)}
  className="jelly-section"
  style={{ 
    scrollMarginTop: '340px',
    animationDelay: `${i * 0.04}s`,
  }}
>
  {/* 🎯 CENTINELA RESTAURADO */}
  <div
    ref={(el) => (sentinelRef.current[cat.id] = el)}
    data-categoria={cat.id}
    style={{ height: '1px', margin: 0, padding: 0, background: 'rgba(255, 0, 0, 0.3)' }}
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

        {/* SECCIÓN NOSOTROS */}
        <div 
          id="Nosotros"
          ref={(el) => (seccionesRef.current['Nosotros'] = el)}
          className="jelly-section"
          style={{ scrollMarginTop: '290px', marginTop: '32px' }}
        >
          <div
            ref={(el) => (sentinelRef.current['Nosotros'] = el)}
            data-categoria="Nosotros"
            style={{ height: '10px', margin: 0, padding: 0, background: 'transparent' }}
          />
          <h3 style={styles.seccionTitulo}>⚙️ NOSOTROS</h3>
          <div style={styles.infoCard}>
            <p style={styles.infoTexto}>
              {comercio.descripcion || "Bienvenidos a nuestra especialidad. Cocinamos con pasión para ofrecerte lo mejor directamente a tu mesa."}
            </p>
            
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.icono}>📍</span>
                <div>
                  <div style={styles.label}>Dirección</div>
                  <div style={styles.valor}>{comercio.direccion || "Calle Principal 123"}</div>
                </div>
              </div>

              <a href={`tel:${comercio.telefono}`} style={{...styles.infoItem, textDecoration: 'none'}}>
                <span style={styles.icono}>📞</span>
                <div>
                  <div style={styles.label}>Teléfono</div>
                  <div style={styles.valor}>{comercio.telefono || "600 000 000"}</div>
                </div>
              </a>

              <a 
                href={`https://wa.me/${comercio.telefono?.replace(/\s+/g, '') || ''}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{...styles.infoItem, textDecoration: 'none'}}
              >
                <span style={styles.icono}>💬</span>
                <div>
                  <div style={styles.label}>WhatsApp</div>
                  <div style={{...styles.valor, color: '#25D366'}}>Escríbenos ahora</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
  infoCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    borderRadius: '20px',
    margin: '8px 12px',
    padding: '16px',
    border: '1px solid rgba(0, 200, 5, 0.25)',
  },
  infoTexto: {
    fontSize: '0.8rem',
    color: '#eee',
    lineHeight: '1.5',
    marginBottom: '16px',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '12px', color: 'white' },
  icono: {
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    width: '36px', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px',
  },
  label: { fontSize: '0.6rem', color: '#aaa', textTransform: 'uppercase' },
  valor: { fontSize: '0.8rem', fontWeight: '600' }
};
