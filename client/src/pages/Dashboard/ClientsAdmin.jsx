import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminCrud.css';

const ClientsAdmin = () => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const res = await api.get('/admin/clients');
      setClients(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/clients/${id}/status`, { status });
      toast.success('Estado actualizado');
      fetchClients();
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    try {
      await api.delete(`/admin/clients/${id}`);
      toast.success('Cliente eliminado');
      fetchClients();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const statusLabels = {
    new: 'Nuevo',
    contacted: 'Contactado',
    in_progress: 'En Progreso',
    completed: 'Completado',
  };

  const statusClasses = {
    new: 'badge-new',
    contacted: 'badge-contacted',
    in_progress: 'badge-progress',
    completed: 'badge-completed',
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud__header">
        <div>
          <h1 className="admin-crud__title">Clientes</h1>
          <p className="admin-crud__subtitle">Registro de solicitudes recibidas</p>
        </div>
      </div>

      <div className="admin-crud__table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Servicio</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, color: '#fff' }}>
                  {c.full_name}
                  {c.company && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray)' }}><FaBuilding style={{ marginRight: '4px' }} />{c.company}</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.82rem' }}>
                    <span><FaEnvelope style={{ marginRight: '6px', color: 'var(--color-gold)' }} />{c.email}</span>
                    {c.phone && <span><FaPhone style={{ marginRight: '6px', color: 'var(--color-silver)' }} />{c.phone}</span>}
                  </div>
                </td>
                <td>{c.service_interested || '—'}</td>
                <td>
                  <span style={{ fontSize: '0.82rem', maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.message || '—'}
                  </span>
                </td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="form-input form-select"
                    style={{ padding: '6px 10px', fontSize: '0.78rem', minWidth: '130px' }}
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </td>
                <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {new Date(c.created_at).toLocaleDateString('es-AR')}
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-dark)' }}>No hay clientes registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsAdmin;
