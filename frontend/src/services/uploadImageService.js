// ============================================
// SERVICIO DIRECTO A CLOUDINARY
// ============================================

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageService = {
  async subirImagen(archivo, comercioId) {
    try {
      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', `comercios/${comercioId}`);

      const response = await fetch(
        `https://cloudinary.com{CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Error al subir a Cloudinary');

      const data = await response.json();
      
      // Devolvemos la URL segura para guardarla en la estantería
      return { url: data.secure_url, id: data.public_id };
    } catch (error) {
      console.error('❌ Error Cloudinary:', error);
      throw error;
    }
  },

  validarArchivo(archivo) {
    const formatos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!archivo) return { valido: false, error: 'Sin archivo' };
    if (archivo.size > 5 * 1024 * 1024) return { valido: false, error: 'Máximo 5MB' };
    if (!formatos.includes(archivo.type)) return { valido: false, error: 'Solo JPG/PNG/WEBP' };
    return { valido: true };
  }
};

export default uploadImageService;
