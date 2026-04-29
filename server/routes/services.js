const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Error al obtener servicios' });
  }
});

// POST /api/services
router.post('/', async (req, res) => {
  try {
    const { title, description, icon, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO services (title, description, icon, display_order) VALUES (?, ?, ?, ?)',
      [title, description, icon, display_order || 0]
    );
    res.status(201).json({ message: 'Servicio agregado', id: result.insertId });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Error al crear servicio' });
  }
});

// PUT /api/services/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, icon, display_order, is_active } = req.body;
    await pool.query(
      'UPDATE services SET title = ?, description = ?, icon = ?, display_order = ?, is_active = ? WHERE id = ?',
      [title, description, icon, display_order, is_active !== undefined ? is_active : 1, req.params.id]
    );
    res.json({ message: 'Servicio actualizado' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Error al actualizar servicio' });
  }
});

// DELETE /api/services/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Error al eliminar servicio' });
  }
});

module.exports = router;
