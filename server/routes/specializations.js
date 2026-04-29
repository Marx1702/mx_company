const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

const router = express.Router();

// Configure multer for diploma files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/diplomas'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes y archivos PDF'));
    }
  }
});

// GET /api/specializations
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM specializations ORDER BY display_order ASC, date_obtained DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ message: 'Error al obtener especializaciones' });
  }
});

// POST /api/specializations
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, institution, description, date_obtained, display_order } = req.body;
    const file_path = req.file ? `/uploads/diplomas/${req.file.filename}` : null;
    const ext = req.file ? path.extname(req.file.originalname).toLowerCase() : '';
    const file_type = ext === '.pdf' ? 'pdf' : 'image';

    const [result] = await pool.query(
      'INSERT INTO specializations (title, institution, file_path, file_type, description, date_obtained, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, institution, file_path, file_type, description, date_obtained, display_order || 0]
    );

    res.status(201).json({ message: 'Especialización agregada', id: result.insertId });
  } catch (error) {
    console.error('Create specialization error:', error);
    res.status(500).json({ message: 'Error al crear especialización' });
  }
});

// PUT /api/specializations/:id
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { title, institution, description, date_obtained, display_order } = req.body;

    let query = 'UPDATE specializations SET title = ?, institution = ?, description = ?, date_obtained = ?, display_order = ?';
    let params = [title, institution, description, date_obtained, display_order || 0];

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const file_type = ext === '.pdf' ? 'pdf' : 'image';
      query += ', file_path = ?, file_type = ?';
      params.push(`/uploads/diplomas/${req.file.filename}`, file_type);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    await pool.query(query, params);
    res.json({ message: 'Especialización actualizada' });
  } catch (error) {
    console.error('Update specialization error:', error);
    res.status(500).json({ message: 'Error al actualizar especialización' });
  }
});

// DELETE /api/specializations/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM specializations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Especialización eliminada' });
  } catch (error) {
    console.error('Delete specialization error:', error);
    res.status(500).json({ message: 'Error al eliminar especialización' });
  }
});

module.exports = router;
