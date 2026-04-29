const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY display_order ASC, name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Error al obtener habilidades' });
  }
});

// POST /api/skills
router.post('/', async (req, res) => {
  try {
    const { name, icon, category, proficiency, display_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO skills (name, icon, category, proficiency, display_order) VALUES (?, ?, ?, ?, ?)',
      [name, icon, category, proficiency || 80, display_order || 0]
    );
    res.status(201).json({ message: 'Habilidad agregada', id: result.insertId });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ message: 'Error al crear habilidad' });
  }
});

// PUT /api/skills/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, icon, category, proficiency, display_order } = req.body;
    await pool.query(
      'UPDATE skills SET name = ?, icon = ?, category = ?, proficiency = ?, display_order = ? WHERE id = ?',
      [name, icon, category, proficiency, display_order, req.params.id]
    );
    res.json({ message: 'Habilidad actualizada' });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Error al actualizar habilidad' });
  }
});

// DELETE /api/skills/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ message: 'Habilidad eliminada' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Error al eliminar habilidad' });
  }
});

module.exports = router;
