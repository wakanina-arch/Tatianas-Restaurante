// ============================================
// SERVICIO DE UPLOAD DE IMÁGENES
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadImageService = {
  // Subir imagen
  async subirImagen(archivo, comercioId) {
    try {
      const formData = new FormData();
      formData.append('imagen', archivo);
      formData.append('comercioId', comercioId);

      console.log(`📤 Subiendo imagen para comercio ${comercioId}...`);

      const response = await fetch(`${API_URL}/uploads`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detalle || error.error);
      }

      const data = await response.json();
      console.log('✅ Imagen subida:', data.imagen.url);
      return data.imagen;
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      throw error;
    }
  },

  // Obtener imágenes del comercio
  async obtenerImagenes(comercioId) {
    try {
      const response = await fetch(`${API_URL}/uploads/${comercioId}`);

      if (!response.ok) {
        throw new Error('Error obteniendo imágenes');
      }

      const data = await response.json();
      return data.imagenes || [];
    } catch (error) {
      console.error('❌ Error obteniendo imágenes:', error);
      return [];
    }
  },

  // Eliminar imagen
  async eliminarImagen(imagenId) {
    try {
      console.log(`🗑️ Eliminando imagen ${imagenId}...`);

      const response = await fetch(`${API_URL}/uploads/${imagenId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detalle || error.error);
      }

      console.log('✅ Imagen eliminada');
      return true;
    } catch (error) {
      console.error('❌ Error eliminando imagen:', error);
      throw error;
    }
  },

  // Validar archivo antes de subir
  validarArchivo(archivo) {
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB
    const formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!archivo) {
      return { valido: false, error: 'No se seleccionó archivo' };
    }

    if (archivo.size > tamañoMaximo) {
      return { 
        valido: false, 
        error: `Archivo muy grande (${(archivo.size / 1024 / 1024).toFixed(2)}MB). Máximo: 5MB` 
      };
    }

    if (!formatosPermitidos.includes(archivo.type)) {
      return { 
        valido: false, 
        error: 'Formato no válido. Solo: JPG, PNG, WEBP' 
      };
    }

    return { valido: true };
  }
};

export default uploadImageService;
