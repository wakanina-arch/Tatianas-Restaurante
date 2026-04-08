import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { put, del } from '@vercel/blob';
import ComercioImage from '../models/ComercioImage.js';

const router = express.Router();

// Configurar multer para archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const mimesPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (mimesPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten JPG, PNG y WEBP'), false);
    }
  }
});

// ============================================
// POST /api/uploads - Subir imagen (con procesamiento)
// ============================================
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningun archivo' });
    }

    const { comercioId } = req.body;
    if (!comercioId) {
      return res.status(400).json({ error: 'commercioId es requerido' });
    }

    console.log(`📤 Procesando imagen para comercio ${comercioId}...`);

    // Procesar imagen con sharp (resize + optimización)
    let processedImageBuffer = req.file.buffer;
    let dimensiones = { ancho: 0, alto: 0 };

    try {
      const metadata = await sharp(req.file.buffer).metadata();
      dimensiones = {
        ancho: metadata.width,
        alto: metadata.height
      };

      // Redimensionar a máximo 1200x900 manteniendo proporción
      processedImageBuffer = await sharp(req.file.buffer)
        .resize(1200, 900, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpError) {
      console.error('Error procesando imagen:', sharpError);
    }

    // Generar nombre único para Vercel Blob
    const timestamp = Date.now();
    const nombreArchivo = `comercio_${comercioId}_${timestamp}.webp`;
    const blobPath = `comercios/${comercioId}/${nombreArchivo}`;

    // Subir a Vercel Blob
    console.log(`☁️ Subiendo a Vercel Blob: ${blobPath}...`);
    const blob = await put(blobPath, processedImageBuffer, {
      access: 'public',
      contentType: 'image/webp'
    });

    console.log(`✅ Subido correctamente: ${blob.url}`);

    // Guardar referencia en MongoDB
    const imagenGuardada = new ComercioImage({
      comercioId: parseInt(comercioId),
      nombreOriginal: req.file.originalname,
      nombreArchivo: nombreArchivo,
      urlPublica: blob.url,
      tamaño: processedImageBuffer.length,
      peso: `${(processedImageBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      mimetype: 'image/webp',
      dimensiones: dimensiones
    });

    await imagenGuardada.save();

    res.json({
      success: true,
      imagen: {
        id: imagenGuardada._id,
        nombre: imagenGuardada.nombreOriginal,
        url: imagenGuardada.urlPublica,
        tamaño: imagenGuardada.peso,
        uploadedAt: imagenGuardada.uploadedAt
      }
    });
  } catch (error) {
    console.error('❌ Error en upload:', error);
    res.status(500).json({
      error: 'Error al subir imagen',
      detalle: error.message
    });
  }
});

// ============================================
// GET /api/uploads/:comercioId - Obtener imágenes del comercio
// ============================================
router.get('/:comercioId', async (req, res) => {
  try {
    const { comercioId } = req.params;

    const imagenes = await ComercioImage.find({
      comercioId: parseInt(comercioId),
      deletedAt: null
    }).sort({ uploadedAt: -1 });

    res.json({
      success: true,
      total: imagenes.length,
      imagenes: imagenes.map(img => ({
        id: img._id,
        nombre: img.nombreOriginal,
        url: img.urlPublica,
        tamaño: img.peso,
        dimensiones: img.dimensiones,
        uploadedAt: img.uploadedAt
      }))
    });
  } catch (error) {
    console.error('❌ Error obteniendo imágenes:', error);
    res.status(500).json({
      error: 'Error al obtener imágenes',
      detalle: error.message
    });
  }
});

// ============================================
// DELETE /api/uploads/:id - Eliminar imagen
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const imagen = await ComercioImage.findById(id);
    if (!imagen) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Eliminar de Vercel Blob
    const blobPath = `comercios/${imagen.comercioId}/${imagen.nombreArchivo}`;
    try {
      await del(blobPath);
      console.log(`🗑️ Eliminada de Blob: ${blobPath}`);
    } catch (blobError) {
      console.warn(`⚠️ Error eliminando de Blob: ${blobError.message}`);
    }

    // Marcar como eliminado en BD (soft delete)
    imagen.deletedAt = new Date();
    await imagen.save();

    res.json({
      success: true,
      mensaje: 'Imagen eliminada correctamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando imagen:', error);
    res.status(500).json({
      error: 'Error al eliminar imagen',
      detalle: error.message
    });
  }
});

export default router;
