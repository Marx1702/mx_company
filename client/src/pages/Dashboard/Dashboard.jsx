import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFolderOpen, FaCode, FaGraduationCap, FaUsers,
  FaSignOutAlt, FaBars, FaTimes, FaHome
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: <FaHome />, label: 'Dashboard', end: true },
    { to: '/admin/portfolio', icon: <FaFolderOpen />, label: 'Portafolio' },
    { to: '/admin/skills', icon: <FaCode />, label: 'Conocimientos' },
    { to: '/admin/specializations', icon: <FaGraduationCap />, label: 'Especializaciones' },
    { to: '/admin/clients', icon: <FaUsers />, label: 'Clientes' },
  ];

  return (
    <div className="dashboard">
      {/* Mobile toggle */}
      <button
        className="dashboard__mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`dashboard__sidebar ${sidebarOpen ? 'dashboard__sidebar--open' : ''}`}>
        <div className="dashboard__sidebar-header">
          <h2 className="dashboard__logo">
            <span className="dashboard__logo-mx">MX</span>
            <span className="dashboard__logo-text">Admin</span>
          </h2>
        </div>

        <nav className="dashboard__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `dashboard__nav-link ${isActive ? 'dashboard__nav-link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dashboard__sidebar-footer">
          <a href="/" className="dashboard__nav-link" target="_blank">
            <FaHome />
            <span>Ver Sitio</span>
          </a>
          <button className="dashboard__nav-link dashboard__logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="dashboard__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="dashboard__main">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
