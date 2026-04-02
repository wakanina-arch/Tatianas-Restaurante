import React, { useState } from 'react';
import MediaCarousel from './MediaCarousel';

function MenuItem({ item, addToCart }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const selectedData = item.opciones?.find(o => o.nombre === selectedOption);
  const currentPrice = selectedData?.precio ?? item.precio ?? 0;
  
  const nutrition = {
    calorias: selectedData?.calorias ?? item.calorias ?? 0,
    proteina: selectedData?.proteina ?? item.proteina ?? 0,
    carbohidratos: selectedData?.carbohidratos ?? item.carbohidratos ?? 0
  };

  const description = selectedData?.descripcion || item.historia;
  
  // Usar imagen de la opción seleccionada o la del item
  const imageSrc = selectedData?.imagen || item.imagenes?.[0];
  
  const OfertaBadge = () => {
    if (!item.enOferta) return null;
    return (
      <span style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        color: '#1a1a1a',
        padding: '0.2rem 0.8rem',
        borderRadius: 30,
        fontSize: '0.8rem',
        fontWeight: '700',
        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
        display: 'inline-block',
        marginLeft: '0.5rem'
      }}>
        🏷️ {item.tagPromo || 'Oferta'} -{item.descuentoAplicado || 0}%
      </span>
    );
  };

  const handleAddToCart = () => {
    if (!selectedOption) {
      alert('Por favor selecciona una opción');
      return;
    }

    addToCart({
      ...item,
      id: `${item.id}-${selectedOption}`,
      variante: selectedOption,
      nombre: `${item.nombre} - ${selectedOption}`,
      precio: currentPrice,
      ...nutrition,
      cantidad: 1
    });
    
    setSelectedOption(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'transparent',
      marginBottom: '2rem'
    }}>
      {/* Carrusel cuadrado - 320px */}
      <div style={{
        width: '100%',
        maxWidth: 360,
        aspectRatio: '1/1',
        margin: '1.5rem auto 0.75rem auto',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        borderRadius: 24,
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
      }}>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={item.nombre}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
          //  maxWidth: '95%',   // o '100%' - lo ajustamos visualmente
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: 'white',
            fontSize: '2rem'
          }}>
            🔱 {item.nombre}
          </div>
        )}
      </div>

      {/* Galleta informativa - 320px alineada */}
      {/* Galleta informativa - más ancha que la imagen */}
<div style={{
  width: 'calc(100% + 80px)',    // 80px más ancha (40px cada lado)
  maxWidth: 'calc(100% + 80px)',
  marginLeft: '-40px',            // centrar la galleta
  marginTop: '0.75rem',           // espacio de respiración con la imagen
  marginBottom: '2.5rem',         // espacio hacia abajo para ver los dots
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  background: 'rgba(255, 255, 255, 0.97)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '28px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  position: 'relative',
  zIndex: 10,
  maxHeight: '400px',
  overflowY: 'auto'
}}>
        
        <div>
          <h2 style={{
            fontSize: '1.7rem',
            fontWeight: '600',
            color: 'var(--verde-selva)',
            margin: '0 0 0.35rem 0',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            letterSpacing: '-0.5px'
          }}>
            {item.nombre}
            <OfertaBadge />
          </h2>
        </div>
        
        {/* DESCRIPCIÓN TIPO "GALLETA" */}
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--gris-texto)',
          lineHeight: 1.5,
          margin: 0,
          fontStyle: 'italic',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          maxHeight: '75px',
          overflowY: 'auto',
          paddingRight: '4px',
          fontWeight: '400'
        }}>
          {description}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          margin: '0.35rem 0',
          maxHeight: '180px',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {item.opciones?.map((opt, idx) => {
            const tieneOferta = item.enOferta && opt.precioOriginal;
            const precioOriginal = tieneOferta ? opt.precioOriginal : null;
            const precioActual = opt.precio || 0;
            
            return (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '0.5rem 0.8rem',
                  background: selectedOption === opt.nombre ? 'rgba(255, 215, 0, 0.08)' : 'transparent',
                  borderRadius: 12,
                  border: selectedOption === opt.nombre 
                    ? '1px solid rgba(255, 215, 0, 0.3)' 
                    : '1px solid rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedOption !== opt.nombre) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOption !== opt.nombre) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <input 
                    type="checkbox"
                    checked={selectedOption === opt.nombre}
                    onChange={() => setSelectedOption(selectedOption === opt.nombre ? null : opt.nombre)}
                    style={{
                      width: 18,
                      height: 18,
                      marginTop: '3px',
                      cursor: 'pointer',
                      accentColor: 'var(--maracuya)'
                    }}
                  />
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: 'var(--gris-texto)',
                    lineHeight: '1.4',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    {opt.nombre}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {tieneOferta && (
                    <span style={{
                      fontSize: '0.8rem',
                      color: '#999',
                      textDecoration: 'line-through'
                    }}>
                      ${precioOriginal.toFixed(2)}
                  </span>
                  )}
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: 'var(--maracuya)',
                    whiteSpace: 'nowrap'
                  }}>
                    ${precioActual.toFixed(2)}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          background: 'rgba(255, 215, 0, 0.03)',
          padding: '0.6rem 0.5rem',
          borderRadius: 16,
          border: '1px solid rgba(255, 215, 0, 0.08)',
          marginTop: '0.5rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}>
            <span style={{ fontSize: '0.9rem' }}>🥗</span>
            <span style={{ color: 'var(--verde-selva)' }}>{nutrition.calorias}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}>
            <span style={{ fontSize: '0.9rem' }}>🥩</span>
            <span style={{ color: 'var(--verde-selva)' }}>{nutrition.proteina}g</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '500' }}>
            <span style={{ fontSize: '0.9rem' }}>🍚</span>
            <span style={{ color: 'var(--verde-selva)' }}>{nutrition.carbohidratos}g</span>
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.6rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedOption && selectedData && item.enOferta && selectedData.precioOriginal && (
              <span style={{
                fontSize: '0.9rem',
                color: '#999',
                textDecoration: 'line-through'
              }}>
                ${selectedData.precioOriginal.toFixed(2)}
              </span>
            )}
            <span style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: 'var(--maracuya)',
              lineHeight: 1
            }}>
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          <button 
            style={{
              background: !selectedOption 
                ? 'rgba(0, 0, 0, 0.08)' 
                : 'linear-gradient(135deg, var(--mango) 0%, var(--maracuya) 100%)',
              color: !selectedOption ? '#aaa' : 'var(--verde-selva)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 24,
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: !selectedOption ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: !selectedOption ? 'none' : '0 3px 10px rgba(255, 215, 0, 0.25)',
              letterSpacing: '-0.3px'
            }}
            onClick={handleAddToCart}
            disabled={!selectedOption}
            onMouseEnter={(e) => {
              if (selectedOption) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedOption) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(255, 215, 0, 0.25)';
              }
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;