import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFolderOpen, FaCode, FaGraduationCap, FaUsers } from 'react-icons/fa';
import api from '../../utils/api';
import './DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    portfolio: 0,
    skills: 0,
    specializations: 0,
    clients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, s, sp, c] = await Promise.all([
          api.get('/portfolio'),
          api.get('/skills'),
          api.get('/specializations'),
          api.get('/admin/clients'),
        ]);
        setStats({
          portfolio: p.data.length,
          skills: s.data.length,
          specializations: sp.data.length,
          clients: c.data.length,
        });
      } catch (error) {
        console.error('Stats error:', error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: <FaFolderOpen />, label: 'Proyectos', value: stats.portfolio, color: '#d4af37' },
    { icon: <FaCode />, label: 'Conocimientos', value: stats.skills, color: '#3498db' },
    { icon: <FaGraduationCap />, label: 'Especializaciones', value: stats.specializations, color: '#9b59b6' },
    { icon: <FaUsers />, label: 'Clientes', value: stats.clients, color: '#2ecc71' },
  ];

  return (
    <div className="dashboard-home">
      <h1 className="dashboard-home__title">Dashboard</h1>
      <p className="dashboard-home__subtitle">Bienvenido al panel de administración de Mx Solutions</p>

      <div className="dashboard-home__stats">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            className="dashboard-home__stat-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div
              className="dashboard-home__stat-icon"
              style={{ background: `${card.color}15`, color: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <p className="dashboard-home__stat-value">{card.value}</p>
              <p className="dashboard-home__stat-label">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
