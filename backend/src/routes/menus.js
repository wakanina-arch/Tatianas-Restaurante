import express from 'express';
import DailyMenu from '../models/DailyMenu.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtener menú del día
router.get('/today', async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const menuDelDia = await DailyMenu.findOne({
      fecha: { $gte: hoy, $lt: mañana },
      activo: true
    }).populate('platos.menuItemId');

    if (!menuDelDia) {
      return res.status(404).json({ error: 'Menú del día no disponible' });
    }

    res.json(menuDelDia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener menú por fecha
router.get('/:fecha', async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);
    fecha.setHours(0, 0, 0, 0);
    
    const mañana = new Date(fecha);
    mañana.setDate(mañana.getDate() + 1);

    const menu = await DailyMenu.findOne({
      fecha: { $gte: fecha, $lt: mañana }
    }).populate('platos.menuItemId');

    if (!menu) {
      return res.status(404).json({ error: 'Menú no encontrado' });
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear menú del día (solo admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const nuevoMenu = new DailyMenu({
      ...req.body,
      creadoPor: req.user.id
    });
    await nuevoMenu.save();
    res.status(201).json({
      mensaje: 'Menú creado exitosamente',
      menu: nuevoMenu
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar menú (solo admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const menu = await DailyMenu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('platos.menuItemId');
    
    res.json({
      mensaje: 'Menú actualizado exitosamente',
      menu
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
