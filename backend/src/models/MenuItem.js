import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: String,
  precio: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    enum: ['entrada', 'plato_fuerte', 'acompañamiento', 'bebida', 'postre'],
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  // Información cultural
  regionOrigen: String,
  historiaIngredientes: String,
  ingredientePrincipal: String,
  
  // Información nutricional (por porción)
  nutricion: {
    calorias: Number,
    proteinas: Number,      // en gramos
    grasas: Number,         // en gramos
    carbohidratos: Number,  // en gramos
    fibra: Number,          // en gramos
    sodio: Number           // en mg
  },
  
  // Advertencias de alergias
  contiene: [String], // ['gluten', 'lactosa', 'frutos_secos', etc.]
  esVegetariano: Boolean,
  esVegano: Boolean,
  
  // Imagen
  imagen: String, // URL o base64
  
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MenuItem', menuItemSchema);
