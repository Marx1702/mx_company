import { motion } from 'framer-motion';
import {
  FaShoppingCart, FaRocket, FaChartBar, FaLaptopCode,
  FaDatabase, FaSitemap, FaHandshake, FaTools
} from 'react-icons/fa';
import './Services.css';

const iconMap = {
  FaShoppingCart: <FaShoppingCart />,
  FaRocket: <FaRocket />,
  FaChartBar: <FaChartBar />,
  FaLaptopCode: <FaLaptopCode />,
  FaDatabase: <FaDatabase />,
  FaSitemap: <FaSitemap />,
  FaHandshake: <FaHandshake />,
  FaTools: <FaTools />,
};

const defaultServices = [
  { id: 1, title: 'E-Commerce', description: 'Desarrollo de tiendas online completas con pasarelas de pago, gestión de inventario y experiencia de compra optimizada.', icon: 'FaShoppingCart' },
  { id: 2, title: 'Landing Pages', description: 'Páginas de aterrizaje de alto impacto diseñadas para convertir visitantes en clientes potenciales.', icon: 'FaRocket' },
  { id: 3, title: 'Sistemas Administrativos', description: 'Software de gestión empresarial a medida: facturación, RRHH, inventarios y más.', icon: 'FaChartBar' },
  { id: 4, title: 'Web Apps', description: 'Aplicaciones web interactivas y escalables con tecnologías modernas.', icon: 'FaLaptopCode' },
  { id: 5, title: 'Administración de BD', description: 'Diseño, optimización y mantenimiento de bases de datos SQL y NoSQL.', icon: 'FaDatabase' },
  { id: 6, title: 'Arquitectura de Sistemas', description: 'Diseño de arquitecturas escalables, seguras y de alto rendimiento.', icon: 'FaSitemap' },
  { id: 7, title: 'Acompañamiento al Cliente', description: 'Asesoramiento técnico continuo durante todo el ciclo de vida del proyecto.', icon: 'FaHandshake' },
  { id: 8, title: 'Mantenimiento', description: 'Soporte técnico, actualizaciones y monitoreo post-lanzamiento.', icon: 'FaTools' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const Services = ({ services }) => {
  const data = services && services.length > 0 ? services : defaultServices;

  return (
    <section className="services section" id="services">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">
            Soluciones tecnológicas completas para impulsar tu negocio al siguiente nivel
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="services__grid">
          {data.map((service, index) => (
            <motion.div
              key={service.id}
              className="services__card card"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="services__icon">
                {iconMap[service.icon] || <FaLaptopCode />}
              </div>
              <h3 className="services__card-title">{service.title}</h3>
              <p className="services__card-desc">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
