import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin_restaurante'],
    default: 'cliente'
  },
  telefonoContacto: String,
  direccionEntrega: String,
  preferenciasAlergias: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

export default mongoose.model('User', userSchema);
