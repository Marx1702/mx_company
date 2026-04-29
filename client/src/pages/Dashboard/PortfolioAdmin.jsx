import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCrud.css';

const PortfolioAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    project_name: '', description: '', category: '',
    repo_url: '', site_url: '', technologies: '', display_order: 0, is_active: 1
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/portfolio');
      setProjects(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ project_name: '', description: '', category: '', repo_url: '', site_url: '', technologies: '', display_order: 0, is_active: 1 });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      project_name: project.project_name || '',
      description: project.description || '',
      category: project.category || '',
      repo_url: project.repo_url || '',
      site_url: project.site_url || '',
      technologies: project.technologies || '',
      display_order: project.display_order || 0,
      is_active: project.is_active ?? 1,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.project_name) { toast.error('El nombre es obligatorio'); return; }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editing) {
        await api.put(`/portfolio/${editing.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Proyecto actualizado');
      } else {
        await api.post('/portfolio', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Proyecto agregado');
      }
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      toast.error('Error al guardar el proyecto');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este proyecto?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success('Proyecto eliminado');
      fetchProjects();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud__header">
        <div>
          <h1 className="admin-crud__title">Portafolio</h1>
          <p className="admin-crud__subtitle">Gestiona los proyectos de tu portafolio</p>
        </div>
        <button className="btn btn-gold" onClick={openCreate}>
          <FaPlus /> Nuevo Proyecto
        </button>
      </div>

      <div className="admin-crud__table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Tecnologías</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: '#fff' }}>{p.project_name}</td>
                <td>{p.category || '—'}</td>
                <td>
                  <div className="admin-crud__tech-tags">
                    {p.technologies?.split(',').slice(0, 3).map((t, i) => (
                      <span key={i} className="portfolio__tech-tag">{t.trim()}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge ${p.is_active ? 'badge-completed' : 'badge-new'}`}>
                    {p.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="admin-crud__actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-dark)' }}>No hay proyectos aún</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h2>{editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Nombre del Proyecto *</label>
                    <input className="form-input" value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-input form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ej: E-Commerce, Landing Page" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL del Repositorio</label>
                    <input className="form-input" value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} placeholder="https://github.com/..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL del Sitio Web</label>
                    <input className="form-input" value={form.site_url} onChange={(e) => setForm({ ...form, site_url: e.target.value })} placeholder="https://mi-proyecto.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tecnologías (separadas por coma)</label>
                    <input className="form-input" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MySQL" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Imagen del proyecto</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Orden de visualización</label>
                    <input type="number" className="form-input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-gold">{editing ? 'Actualizar' : 'Crear'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioAdmin;
