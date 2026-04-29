import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCrud.css';

const SkillsAdmin = () => {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', icon: '', category: 'other', proficiency: 80, display_order: 0
  });

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', icon: '', category: 'other', proficiency: 80, display_order: 0 });
    setShowModal(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({
      name: skill.name || '',
      icon: skill.icon || '',
      category: skill.category || 'other',
      proficiency: skill.proficiency || 80,
      display_order: skill.display_order || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('El nombre es obligatorio'); return; }

    try {
      if (editing) {
        await api.put(`/skills/${editing.id}`, form);
        toast.success('Habilidad actualizada');
      } else {
        await api.post('/skills', form);
        toast.success('Habilidad agregada');
      }
      setShowModal(false);
      fetchSkills();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta habilidad?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Habilidad eliminada');
      fetchSkills();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const categoryLabels = {
    frontend: 'Frontend', backend: 'Backend', database: 'Base de Datos', devops: 'DevOps', other: 'Otros'
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud__header">
        <div>
          <h1 className="admin-crud__title">Conocimientos</h1>
          <p className="admin-crud__subtitle">Gestiona tus lenguajes y tecnologías</p>
        </div>
        <button className="btn btn-gold" onClick={openCreate}>
          <FaPlus /> Nuevo Conocimiento
        </button>
      </div>

      <div className="admin-crud__table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Dominio</th>
              <th>Orden</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, color: '#fff' }}>{s.name}</td>
                <td><span className="badge badge-new">{categoryLabels[s.category] || s.category}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.proficiency}%`, height: '100%', background: 'linear-gradient(135deg, #d4af37, #f0d060)', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#d4af37', fontWeight: 600 }}>{s.proficiency}%</span>
                  </div>
                </td>
                <td>{s.display_order}</td>
                <td>
                  <div className="admin-crud__actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(s)}><FaEdit /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-dark)' }}>No hay conocimientos aún</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="modal-header">
                <h2>{editing ? 'Editar Conocimiento' : 'Nuevo Conocimiento'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: JavaScript, React, Python" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-input form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Base de Datos</option>
                      <option value="devops">DevOps</option>
                      <option value="other">Otros</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nivel de dominio: {form.proficiency}%</label>
                    <input type="range" min="0" max="100" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })} className="form-input" style={{ padding: '8px' }} />
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

export default SkillsAdmin;
