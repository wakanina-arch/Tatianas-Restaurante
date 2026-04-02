import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Keyboard } from 'swiper/modules';
import MenuItem from './components/MenuItem';
import { useCart } from './CartContext';

export default function HomePage({ platillos, selectedCategory, comercioId }) {
  const { addToCart } = useCart();
  const swiperRef = useRef(null);

  const getCategoria = (categoriaNombre) => {
    return platillos.find(p => p.nombre === categoriaNombre);
  };

  const categorias = [
    { id: 'Primero', nombre: 'COMPLEMENTOS', icono: '🍟', categoria: getCategoria('Primero') },
    { id: 'Segundo', nombre: 'ENSALADAS', icono: '🥗', categoria: getCategoria('Segundo') },
    { id: 'Bebidas', nombre: 'BEBIDAS', icono: '🥤', categoria: getCategoria('Bebidas') },
    { id: 'Pizzas', nombre: 'PIZZAS', icono: '🍕', categoria: getCategoria('Pizzas') }
  ];

  // Efecto para cambiar de slide cuando selectedCategory cambie
  useEffect(() => {
    if (swiperRef.current && selectedCategory) {
      const index = categorias.findIndex(cat => cat.id === selectedCategory);
      if (index >= 0 && index !== swiperRef.current.activeIndex) {
        swiperRef.current.slideTo(index);
      }
    }
  }, [selectedCategory, categorias]);

  // Si no hay comercio seleccionado, mostramos un mensaje
  if (!comercioId) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>No hay comercio seleccionado</h2>
      </div>
    );
  }

  return (
    <section style={{ padding: '1rem', maxWidth: 1200, margin: '0 auto' }}>
      
      <Swiper
  onSwiper={(swiper) => { swiperRef.current = swiper; }}
  modules={[Pagination, Keyboard]}
  spaceBetween={20}
  slidesPerView={1}
  pagination={{ 
    clickable: true,
    dynamicBullets: true,  // ← mejora en móvil
  }}
  keyboard={{ enabled: true }}
  touchRatio={1.2}          // ← más sensible al touch
  touchAngle={30}           // ← más fácil deslizar
  resistance={true}
  resistanceRatio={0.85}
  style={{ width: '100%', touchAction: 'pan-y' }}
>
        {categorias.map((categoria) => (
          <SwiperSlide key={categoria.id}>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
              padding: '1rem',
    width: '100%',           // ← añade
  overflow: 'visible',   // ← añade para evitar recortes
  }}>
    {/* Título eliminado */}
    <MenuItem item={categoria.categoria} addToCart={addToCart} />
  </div>
</SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

// Al final del archivo, añade estos estilos globales
const swiperStyles = document.createElement('style');
swiperStyles.textContent = `
  .swiper-pagination {
    position: relative !important;
    margin-top: 20px !important;
    margin-bottom: 10px !important;
  }
  .swiper-pagination-bullet {
    background: #f4f9f5 !important;
    opacity: 0.4 !important;
  }
  .swiper-pagination-bullet-active {
    background: #FF8C42 !important;
    opacity: 1 !important;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(swiperStyles);
}