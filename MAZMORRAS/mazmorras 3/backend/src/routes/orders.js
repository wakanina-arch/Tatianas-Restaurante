import express from 'express';
import Order from '../models/Order.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { sendTicketMail } from '../utils/mailer.js';

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

    // Obtener datos del usuario
    const user = req.user;
    // Si el usuario viene de JWT, puede que solo tenga id, nombre, email
    // Si no tiene email, no enviar
    if (user && user.email) {
      // Generar QR con número de pedido
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=TICKET-${nuevoPedido.numeroOrden}&size=200x200`;
      // Generar HTML del ticket
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;border:1px solid #ececff;border-radius:12px;padding:24px;background:#fafaff;">
          <div style="display:flex;align-items:flex-start;margin-bottom:18px;">
            <img src='cid:theonelogo' alt="Logo TheOne" style="height:56px;margin-right:12px;border-radius:8px;"/>
            <div>
              <h2 style="margin:0;font-size:1.2rem;color:#764ba2;">¡Pago realizado!</h2>
              <p style="margin:0;color:#333;">Gracias por tu compra, ${user.nombre || ''}.</p>
            </div>
          </div>
          <div style="margin-bottom:18px;border:1px solid #ececff;border-radius:8px;padding:12px 18px;background:#fff;">
            <h3 style="margin:0 0 8px 0;font-size:1.1rem;color:#764ba2;">Detalle de la compra</h3>
            <ul style="list-style:none;padding:0;margin:0;">
              ${items.map(item => `<li style='padding:3px 0;border-bottom:1px solid #eee;font-size:1rem;'>${item.cantidad} x ${item.nombre} <span style='float:right;'>$${(item.precio * item.cantidad).toFixed(2)}</span></li>`).join('')}
            </ul>
            <div style="text-align:right;font-size:1.1rem;color:#667eea;font-weight:bold;">Total: <b>$${total}</b></div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;margin:24px 0 0 0;">
            <img src='${qrUrl}' alt="QR Ticket" style="border-radius:8px;box-shadow:0 2px 8px #667eea33;margin-bottom:8px;"/>
            <div style="font-size:1.1rem;color:#764ba2;font-weight:600;">N° de pedido: <span style="color:#333">${nuevoPedido.numeroOrden}</span></div>
            <div style="font-size:0.9rem;color:#aaa;margin-top:4px;">Presenta este QR en caja</div>
          </div>
        </div>
      `;
      // Enviar email
      await sendTicketMail({
        to: user.email,
        subject: `Tu ticket de compra - Pedido ${nuevoPedido.numeroOrden}`,
        html,
        attachments: [{
          filename: 'The-One.png',
          path: process.cwd() + '/frontend/public/img/The-One.png',
          cid: 'theonelogo'
        }]
      });
    }

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
