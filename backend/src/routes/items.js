import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los ítems del menú
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ítems por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const items = await MenuItem.find({ 
      categoria: req.params.categoria,
      disponible: true 
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo ítem (solo admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const nuevoItem = new MenuItem(req.body);
    await nuevoItem.save();
    res.status(201).json({
      mensaje: 'Ítem creado exitosamente',
      item: nuevoItem
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar ítem (solo admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      mensaje: 'Ítem actualizado exitosamente',
      item
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar ítem (solo admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Ítem eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
