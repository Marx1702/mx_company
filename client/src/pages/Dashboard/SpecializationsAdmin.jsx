import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaFilePdf, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCrud.css';

const SpecializationsAdmin = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', institution: '', description: '', date_obtained: '', display_order: 0
  });
  const [file, setFile] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await api.get('/specializations');
      setItems(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', institution: '', description: '', date_obtained: '', display_order: 0 });
    setFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      institution: item.institution || '',
      description: item.description || '',
      date_obtained: item.date_obtained ? item.date_obtained.split('T')[0] : '',
      display_order: item.display_order || 0,
    });
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('El título es obligatorio'); return; }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (file) formData.append('file', file);

    try {
      if (editing) {
        await api.put(`/specializations/${editing.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Especialización actualizada');
      } else {
        await api.post('/specializations', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Especialización agregada');
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta especialización?')) return;
    try {
      await api.delete(`/specializations/${id}`);
      toast.success('Especialización eliminada');
      fetchItems();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud__header">
        <div>
          <h1 className="admin-crud__title">Especializaciones</h1>
          <p className="admin-crud__subtitle">Gestiona tus diplomas y certificaciones</p>
        </div>
        <button className="btn btn-gold" onClick={openCreate}>
          <FaPlus /> Nueva Especialización
        </button>
      </div>

      <div className="admin-crud__table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Título</th>
              <th>Institución</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td>
                  <div style={{ color: s.file_type === 'pdf' ? '#e74c3c' : '#3498db', fontSize: '1.2rem' }}>
                    {s.file_type === 'pdf' ? <FaFilePdf /> : <FaImage />}
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{s.title}</td>
                <td>{s.institution || '—'}</td>
                <td>{s.date_obtained ? new Date(s.date_obtained).toLocaleDateString('es-AR') : '—'}</td>
                <td>
                  <div className="admin-crud__actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(s)}><FaEdit /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-dark)' }}>No hay especializaciones aún</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="modal-header">
                <h2>{editing ? 'Editar Especialización' : 'Nueva Especialización'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Título *</label>
                    <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institución</label>
                    <input className="form-input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-input form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha de obtención</label>
                    <input type="date" className="form-input" value={form.date_obtained} onChange={(e) => setForm({ ...form, date_obtained: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Diploma (PDF o Imagen)</label>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files[0])} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Orden</label>
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

export default SpecializationsAdmin;
