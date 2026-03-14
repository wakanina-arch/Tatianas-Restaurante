import mongoose from 'mongoose';

const dailyMenuSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    unique: true
  },
  platos: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    precioDelDia: {
      type: Number,
      required: true
    },
    destacado: {
      type: Boolean,
      default: false
    }
  }],
  activo: {
    type: Boolean,
    default: true
  },
  notas: String,
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('DailyMenu', dailyMenuSchema);
