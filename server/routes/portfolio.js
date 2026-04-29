const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

const router = express.Router();

// Configure multer for portfolio images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/portfolio'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp, gif)'));
    }
  }
});

// GET /api/portfolio - Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM portfolio WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Error al obtener portafolio' });
  }
});

// GET /api/portfolio/all - Get all projects including inactive (admin)
router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM portfolio ORDER BY display_order ASC, created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get all portfolio error:', error);
    res.status(500).json({ message: 'Error al obtener portafolio' });
  }
});

// POST /api/portfolio
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { project_name, description, category, repo_url, site_url, technologies, display_order } = req.body;
    const image_url = req.file ? `/uploads/portfolio/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO portfolio (project_name, description, category, image_url, repo_url, site_url, technologies, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [project_name, description, category, image_url, repo_url, site_url || null, technologies, display_order || 0]
    );

    res.status(201).json({ message: 'Proyecto agregado', id: result.insertId });
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ message: 'Error al crear proyecto' });
  }
});

// PUT /api/portfolio/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { project_name, description, category, repo_url, site_url, technologies, display_order, is_active } = req.body;

    let query = 'UPDATE portfolio SET project_name = ?, description = ?, category = ?, repo_url = ?, site_url = ?, technologies = ?, display_order = ?, is_active = ?';
    let params = [project_name, description, category, repo_url, site_url || null, technologies, display_order || 0, is_active !== undefined ? is_active : 1];

    if (req.file) {
      query += ', image_url = ?';
      params.push(`/uploads/portfolio/${req.file.filename}`);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    await pool.query(query, params);
    res.json({ message: 'Proyecto actualizado' });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Error al actualizar proyecto' });
  }
});

// DELETE /api/portfolio/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ message: 'Error al eliminar proyecto' });
  }
});

module.exports = router;
