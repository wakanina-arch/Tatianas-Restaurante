import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  numeroOrden: {
    type: String,
    unique: true,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    },
    nombre: String,
    precio: Number,
    cantidad: {
      type: Number,
      default: 1
    },
    notas: String // Especificaciones del cliente
  }],
  estado: {
    type: String,
    enum: ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  total: {
    type: Number,
    required: true
  },
  tipoEntrega: {
    type: String,
    enum: ['local', 'domicilio'],
    default: 'local'
  },
  direccionEntrega: String,
  telefonoContacto: String,
  notasEspeciales: String,
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    default: 'efectivo'
  },
  horaEstimadaEntrega: Date,
  fechaPedido: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
