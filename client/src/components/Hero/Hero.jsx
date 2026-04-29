import { motion } from 'framer-motion';
import { FaChevronDown, FaCode, FaServer, FaDatabase } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      {/* Animated background particles */}
      <div className="hero__particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="hero__particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div className="hero__glow" />

      <div className="hero__container container">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.p
            className="hero__badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FaCode /> Desarrollo Web a Medida
          </motion.p>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Transformamos ideas en
            <span className="hero__title-accent"> soluciones digitales</span>
          </motion.h1>

          <motion.p
            className="hero__description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            Diseño y desarrollo de aplicaciones web profesionales, e-commerce,
            sistemas administrativos y más. Tecnología de vanguardia con un
            enfoque centrado en tu negocio.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <button
              className="btn btn-gold"
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Solicitar Cotización
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                const el = document.getElementById('portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Portafolio
            </button>
          </motion.div>

          <motion.div
            className="hero__tech-icons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="hero__tech-item">
              <FaCode />
              <span>Frontend</span>
            </div>
            <div className="hero__tech-item">
              <FaServer />
              <span>Backend</span>
            </div>
            <div className="hero__tech-item">
              <FaDatabase />
              <span>Databases</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        className="hero__scroll-btn"
        onClick={scrollToServices}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-label="Scroll down"
      >
        <FaChevronDown />
      </motion.button>
    </section>
  );
};

export default Hero;
