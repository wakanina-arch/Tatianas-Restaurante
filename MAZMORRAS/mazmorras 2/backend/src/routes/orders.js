import express from 'express';
import Order from '../models/Order.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Generar número de orden único
const generarNumeroOrden = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Crear pedido (cliente)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, tipoEntrega, metodoPago, notasEspeciales } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El pedido debe tener al menos un ítem' });
    }

    // Calcular total
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    const nuevoPedido = new Order({
      numeroOrden: generarNumeroOrden(),
      cliente: req.user.id,
      items,
      total,
      tipoEntrega,
      metodoPago,
      notasEspeciales,
      horaEstimadaEntrega: new Date(Date.now() + 30 * 60000) // 30 minutos
    });

    await nuevoPedido.save();

    res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedido: nuevoPedido
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener mis pedidos (cliente)
router.get('/cliente/mis-pedidos', authMiddleware, async (req, res) => {
  try {
    const pedidos = await Order.find({ cliente: req.user.id })
      .sort({ fechaPedido: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las comandas (admin)
router.get('/admin/todas', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const estado = req.query.estado;
    const query = estado ? { estado } : {};
    
    const pedidos = await Order.find(query)
      .populate('cliente', 'nombre email telefonoContacto')
      .sort({ fechaPedido: -1 });
    
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener detalle de pedido
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id)
      .populate('items.menuItemId')
      .populate('cliente', 'nombre email');

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que el cliente sea el propietario o sea admin
    if (pedido.cliente._id.toString() !== req.user.id && 
        req.user.rol !== 'admin_restaurante') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de pedido (admin)
router.put('/:id/estado', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const pedido = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        estado,
        fechaActualizacion: new Date()
      },
      { new: true }
    );

    res.json({
      mensaje: 'Estado del pedido actualizado',
      pedido
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancelar pedido (cliente)
router.put('/:id/cancelar', authMiddleware, async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (pedido.cliente.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    if (pedido.estado !== 'pendiente') {
      return res.status(400).json({ 
        error: 'Solo se pueden cancelar pedidos pendientes' 
      });
    }

    pedido.estado = 'cancelado';
    await pedido.save();

    res.json({
      mensaje: 'Pedido cancelado',
      pedido
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
