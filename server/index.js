const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authMiddleware = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const portfolioRoutes = require('./routes/portfolio');
const skillRoutes = require('./routes/skills');
const specializationRoutes = require('./routes/specializations');
const serviceRoutes = require('./routes/services');

const app = express();
const PORT = process.env.PORT || 5000;

// Create upload directories if they don't exist
const uploadDirs = ['uploads/portfolio', 'uploads/diplomas'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/services', serviceRoutes);

// Client routes (public POST for contact form, admin GET/PUT/DELETE with auth)
app.use('/api/clients', clientRoutes);

// Protected admin routes (alias for clients with auth middleware)
app.use('/api/admin/clients', authMiddleware, clientRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir los archivos estáticos compilados de React (Frontend)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Ruta comodín (Catch-all): cualquier petición que no sea de la API, devuelve el index.html
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Mx Solutions Server running on port ${PORT}`);
});
