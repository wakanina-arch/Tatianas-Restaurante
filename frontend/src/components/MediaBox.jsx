// He simplificado para que sea la "Galleta" que acompaña, no que la pise
export default function MediaBox({ nombre, precio, descripcion }) {
  return (
    <div style={styles.galletaContainer}>
      <div style={styles.galletaHeader}>
        <h3 style={styles.platoNombre}>{nombre || 'Nombre del Plato'}</h3>
        <span style={styles.platoPrecio}>${precio?.toFixed(2) || '0.00'}</span>
      </div>
      <p style={styles.platoDesc}>
        {descripcion || 'Sabores auténticos seleccionados especialmente para tu menú de hoy.'}
      </p>
      <div style={styles.tag}>✨ Sugerencia del Chef</div>
    </div>
  );
}

const styles = {
  galletaContainer: {
    width: '90%', // Un poco más estrecha que el carrusel para el efecto "flotante"
    margin: '0 auto',
    padding: '1.5rem',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: '1px solid var(--borde-tropical)',
    position: 'relative',
    zIndex: 2,
    marginTop: '-20px' // ESTO HACE QUE MONTE UN POCO SOBRE EL CARRUSEL ESTILO MODERNO
  },
  galletaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  platoNombre: { fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--verde-selva)', margin: 0 },
  platoPrecio: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--mango)' },
  platoDesc: { fontSize: '0.95rem', color: '#666', lineHeight: '1.4' },
  tag: { display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', background: 'var(--crema-tropical)', padding: '4px 10px', borderRadius: '10px', color: 'var(--maracuya)', fontWeight: 'bold' }
};
