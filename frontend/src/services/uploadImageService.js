// src/services/uploadImageService.js
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadImageService = {
  subirImagen: async (file, comercioId) => {
    // Validaciones
    if (!CLOUD_NAME) throw new Error("❌ VITE_CLOUDINARY_CLOUD_NAME no está definido en .env");
    if (!UPLOAD_PRESET) throw new Error("❌ VITE_CLOUDINARY_UPLOAD_PRESET no está definido en .env");
    
    console.log("☁️ CLOUD_NAME:", CLOUD_NAME);
    console.log("☁️ UPLOAD_PRESET:", UPLOAD_PRESET);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `one_to_one/${comercioId || 'general'}`);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    console.log("📤 URL:", url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Añadir headers para evitar problemas de CORS
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.secure_url) {
        throw new Error('No se recibió URL de la imagen');
      }

      return { url: data.secure_url, public_id: data.public_id };
    } catch (error) {
      console.error("❌ Error Cloudinary:", error);
      throw error;
    }
  }
};

export default uploadImageService;