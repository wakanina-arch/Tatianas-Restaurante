import mongoose from 'mongoose';

const comercioImageSchema = new mongoose.Schema({
  comercioId: {
    type: Number,
    required: true,
    index: true
  },
  nombreOriginal: {
    type: String,
    required: true
  },
  nombreArchivo: {
    type: String,
    required: true,
    unique: true
  },
  urlPublica: {
    type: String,
    required: true
  },
  tamaño: {
    type: Number,
    required: true
  },
  peso: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    enum: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    required: true
  },
  dimensiones: {
    ancho: Number,
    alto: Number
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

// Índice compuesto para búsquedas rápidas por comercio
comercioImageSchema.index({ comercioId: 1, deletedAt: 1 });

export default mongoose.model('ComercioImage', comercioImageSchema);
