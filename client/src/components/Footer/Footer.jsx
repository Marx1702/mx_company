import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__brand">
            <h3 className="footer__logo">
              <span className="footer__logo-mx">MX</span>
              <span className="footer__logo-text">Solutions</span>
            </h3>
            <p className="footer__tagline">
              Desarrollo web a medida con tecnología de vanguardia
            </p>
          </div>

          <div className="footer__links">
            <h4>Navegación</h4>
            <a href="#hero">Inicio</a>
            <a href="#services">Servicios</a>
            <a href="#about">Sobre Mí</a>
            <a href="#portfolio">Portafolio</a>
            <a href="#contact">Contacto</a>
          </div>

          <div className="footer__links">
            <h4>Servicios</h4>
            <span>E-Commerce</span>
            <span>Landing Pages</span>
            <span>Web Apps</span>
            <span>Sistemas</span>
          </div>

          <div className="footer__social">
            <h4>Conectar</h4>
            <div className="footer__social-icons">
              <a href="#" aria-label="GitHub" className="footer__social-link">
                <FaGithub />
              </a>
              <a href="#" aria-label="LinkedIn" className="footer__social-link">
                <FaLinkedin />
              </a>
              <a href="mailto:contacto@mxsolutions.com" aria-label="Email" className="footer__social-link">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} Mx Solutions. Todos los derechos reservados.
          </p>
          <p className="footer__made-with">
            Hecho con <FaHeart className="footer__heart" /> por Mx Solutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
