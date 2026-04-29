import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data.token);
      toast.success('¡Bienvenido al Dashboard!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__glow" />
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="login-card__header">
          <h1 className="login-card__logo">
            <span className="login-card__logo-mx">MX</span>
            <span className="login-card__logo-text">Solutions</span>
          </h1>
          <p className="login-card__subtitle">Panel Administrativo</p>
        </div>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <div className="login-card__input-group">
            <FaUser className="login-card__input-icon" />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-card__input"
            />
          </div>

          <div className="login-card__input-group">
            <FaLock className="login-card__input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-card__input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold login-card__btn"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
