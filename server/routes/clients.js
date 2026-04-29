const express = require('express');
const pool = require('../config/db');
const { sendAutoReply } = require('../config/mailer');

const router = express.Router();

// POST /api/clients - Register new client (public)
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, company, message, service_interested } = req.body;

    const [result] = await pool.query(
      'INSERT INTO clients (full_name, email, phone, company, message, service_interested) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, phone, company, message, service_interested]
    );

    // Send automated reply email
    sendAutoReply(email, full_name).catch(err => console.error('Auto-reply failed:', err));

    res.status(201).json({
      message: 'Solicitud recibida exitosamente. Te contactaremos pronto.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Client registration error:', error);
    res.status(500).json({ message: 'Error al registrar la solicitud' });
  }
});

// GET /api/clients - Get all clients (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
});

// PUT /api/clients/:id/status - Update client status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE clients SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
});

module.exports = router;
