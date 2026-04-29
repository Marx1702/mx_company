import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    service_interested: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.message) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      await api.post('/clients', formData);
      toast.success('¡Solicitud enviada exitosamente! Te contactaremos pronto.', {
        duration: 5000,
        icon: '🎉',
      });
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        service_interested: '',
        message: '',
      });
    } catch (error) {
      toast.error('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappNumber = '2616556219';
  const whatsappMessage = encodeURIComponent('Hola, me interesa conocer más sobre sus servicios de desarrollo web.');

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Contacto</h2>
          <p className="section-subtitle">
            ¿Tienes un proyecto en mente? Contáctanos y hagámoslo realidad
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="contact__content">
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="contact__info-title">Hablemos de tu proyecto</h3>
            <p className="contact__info-desc">
              Estamos listos para escuchar tu idea y transformarla en una solución digital
              de alto impacto. Completa el formulario o contáctanos directamente.
            </p>

            <div className="contact__channels">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__channel"
              >
                <div className="contact__channel-icon contact__channel-icon--whatsapp">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>Respuesta inmediata</p>
                </div>
              </a>

              <div className="contact__channel">
                <div className="contact__channel-icon">
                  <FaEnvelope />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>mxsolutionscontact@gmail.com</p>
                </div>
              </div>

              <div className="contact__channel">
                <div className="contact__channel-icon">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4>Ubicación</h4>
                  <p>Argentina</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="contact__form-row">
              <div className="form-group">
                <label className="form-label">Nombre completo *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="contact__form-row">
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+54 9 11 0000-0000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Empresa</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tu empresa"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Servicio de interés</label>
              <select
                name="service_interested"
                value={formData.service_interested}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="">Seleccionar servicio</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Sistema Administrativo">Sistema Administrativo</option>
                <option value="Web App">Web App</option>
                <option value="Base de Datos">Administración de BD</option>
                <option value="Arquitectura">Arquitectura de Sistemas</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Contanos sobre tu proyecto..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold contact__submit"
              disabled={loading}
            >
              {loading ? (
                <span className="contact__loading">Enviando...</span>
              ) : (
                <>
                  <FaPaperPlane /> Enviar Solicitud
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat por WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </section>
  );
};

export default Contact;
