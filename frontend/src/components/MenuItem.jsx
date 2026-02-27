function MenuItem({ item, addToCart }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Opción seleccionada
  const selectedData = item.opciones?.find(o => o.nombre === selectedOption);

  // Precio actual - SOLO cuando hay opción seleccionada
  const currentPrice = selectedData?.precio ?? 0;

  // Nutrición de la opción seleccionada
  const nutrition = selectedData ? {
    calorias: selectedData.calorias || 0,
    proteina: selectedData.proteina || 0,
    carbohidratos: selectedData.carbohidratos || 0
  } : { calorias: 0, proteina: 0, carbohidratos: 0 };

  // Descripción
  const description = selectedData?.descripcion || item.historia;

  // Badge de oferta para la categoría
  const OfertaBadge = () => {
    if (!item.enOferta) return null;
    
    return (
      <span style={styles.ofertaBadge}>
        🏷️ {item.tagPromo} -{item.descuentoAplicado}%
      </span>
    );
  };

  // Obtener la primera imagen disponible (de la primera opción)
  const primeraImagen = item.opciones?.[0]?.imagen || null;

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
    <div className="food-card" style={styles.foodCard}>
      {/* Imagen o carrusel - CORREGIDO */}
      <div className="food-media" style={styles.foodMedia}>
        {primeraImagen ? (
          <img 
            src={primeraImagen} 
            alt={item.nombre}
            style={styles.foodImage}
          />
        ) : (
          <div style={styles.noImage}>
            🍽️ {item.nombre}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="food-info" style={styles.foodInfo}>
        {/* Título de categoría */}
        <div style={styles.categoryHeader}>
          <h2 style={styles.categoryTitle}>
            {item.nombre}
            <OfertaBadge />
          </h2>
        </div>
        
        <p style={styles.categoryDescription}>{description}</p>

        {/* Opciones con checkbox */}
        <div style={styles.optionsContainer}>
          {item.opciones?.map((opt, idx) => {
            const tieneOferta = item.enOferta && opt.precioOriginal;
            const precioOriginal = tieneOferta ? opt.precioOriginal : null;
            const precioActual = opt.precio || 0;
            
            return (
              <label key={idx} style={styles.optionRow}>
                <div style={styles.optionLeft}>
                  <input 
                    type="checkbox"
                    checked={selectedOption === opt.nombre}
                    onChange={() => setSelectedOption(selectedOption === opt.nombre ? null : opt.nombre)}
                    style={styles.checkbox}
                  />
                  <span style={styles.optionName}>{opt.nombre}</span>
                </div>
                <div style={styles.optionRight}>
                  {tieneOferta && (
                    <span style={styles.precioOriginal}>
                      ${precioOriginal.toFixed(2)}
                    </span>
                  )}
                  <span style={styles.precioActual}>
                    ${precioActual.toFixed(2)}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Nutrición - SOLO si hay opción seleccionada */}
        {selectedOption && (
          <div style={styles.nutritionInfo}>
            <span style={styles.nutritionItem}>
              <span style={styles.nutritionIcon}>🥗</span>
              <span style={styles.nutritionValue}>{nutrition.calorias}</span> kcal
            </span>
            <span style={styles.nutritionItem}>
              <span style={styles.nutritionIcon}>🥩</span>
              <span style={styles.nutritionValue}>{nutrition.proteina}</span>g prot
            </span>
            <span style={styles.nutritionItem}>
              <span style={styles.nutritionIcon}>🍚</span>
              <span style={styles.nutritionValue}>{nutrition.carbohidratos}</span>g carb
            </span>
          </div>
        )}

        {/* Footer con precio y botón */}
        <div style={styles.footer}>
          <div style={styles.precioContainer}>
            {selectedOption && selectedData && item.enOferta && selectedData.precioOriginal && (
              <span style={styles.precioOriginalGrande}>
                ${selectedData.precioOriginal.toFixed(2)}
              </span>
            )}
            <span style={styles.precioFinal}>
              ${currentPrice.toFixed(2)}
            </span>
          </div>
          <button 
            style={{
              ...styles.addButton,
              opacity: !selectedOption ? 0.5 : 1,
              cursor: !selectedOption ? 'not-allowed' : 'pointer'
            }}
            onClick={handleAddToCart}
            disabled={!selectedOption}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
