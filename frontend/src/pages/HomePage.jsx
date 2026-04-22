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

export default function HomePage({ comercio, platillos, user, setCurrentPage }) {
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIAS_LIST[0].id);
  const { addToCart } = useCart();
  
  const seccionesRef = useRef({});
  const sentinelRef = useRef({});        // ← CENTINELA RESTAURADO
  const bloqueoSincronizacionRef = useRef(false);

  const platillosPorCategoria = (categoriaId) => {
    if (categoriaId === 'Nosotros') return [];
    return platillos?.find(p => p.nombre === categoriaId)?.opciones || [];
  };

  const scrollASeccion = (categoriaId) => {
    bloqueoSincronizacionRef.current = true;
    setCategoriaActiva(categoriaId);

    const elemento = seccionesRef.current[categoriaId];
    if (elemento) {
      const headerHeight = 56;      // ← Nanométrico
      const tabsHeight = 48;        // ← Nanométrico
      const offset = headerHeight + tabsHeight + 8;
      
      const elementPosition = elemento.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => { bloqueoSincronizacionRef.current = false; }, 500);
  };

  // Efecto para sincronizar tabs con scroll (CENTINELA RESTAURADO)
  useEffect(() => {
    if (!platillos || platillos.length === 0) return;

    const headerHeight = 56;
    const tabsHeight = 48;
    const TRIGGER_LINE = headerHeight + tabsHeight + 8;

    const handleScroll = () => {
      if (bloqueoSincronizacionRef.current) return;

      let categoriaVisible = CATEGORIAS_LIST[0].id;
      
      // Recorrer de abajo hacia arriba para encontrar la última que cruzó el centinela
      for (let i = CATEGORIAS_LIST.length - 1; i >= 0; i--) {
        const cat = CATEGORIAS_LIST[i];
        const el = sentinelRef.current[cat.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= TRIGGER_LINE) {
            categoriaVisible = cat.id;
            break;
          }
        }
      }

      if (categoriaVisible !== categoriaActiva) {
        setCategoriaActiva(categoriaVisible);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 80);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [platillos, categoriaActiva]);

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

  if (!comercio) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>Cargando...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#2a1414' }}>
      
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ background: '#2a1414' }}>
          <ComercioHeader comercio={comercio} />
        </div>
        <CategoriaTabs
          categorias={CATEGORIAS_LIST}
          categoriaActiva={categoriaActiva}
          onSelectCategoria={scrollASeccion}
          setCurrentPage={setCurrentPage}
          user={user}
        />
      </div>
      
      <div style={{ flex: 1, paddingTop: '12px' }}>
        {CATEGORIAS_LIST.filter(c => c.id !== 'Nosotros').map((cat, i) => (
          <div
            key={cat.id}
            id={cat.id}
            ref={(el) => (seccionesRef.current[cat.id] = el)}
            className="jelly-section"
            style={{ 
              scrollMarginTop: '112px', 
              animationDelay: `${i * 0.04}s`,
            }}
          >
            {/* 🎯 CENTINELA RESTAURADO */}
            <div
              ref={(el) => (sentinelRef.current[cat.id] = el)}
              data-categoria={cat.id}
              style={{ height: '1px', margin: 0, padding: 0, background: 'transparent' }}
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

        {/* SECCIÓN NOSOTROS (NANOMÉTRICA) */}
        <div 
          id="Nosotros"
          ref={(el) => (seccionesRef.current['Nosotros'] = el)}
          className="jelly-section"
          style={{ scrollMarginTop: '112px', marginTop: '32px' }}
        >
          <div
            ref={(el) => (sentinelRef.current['Nosotros'] = el)}
            data-categoria="Nosotros"
            style={{ height: '1px', margin: 0, padding: 0, background: 'transparent' }}
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
    padding: '16px 14px 6px',
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