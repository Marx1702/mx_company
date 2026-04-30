import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaGraduationCap, FaFilePdf, FaImage, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../../utils/api';
import './About.css';

const About = () => {
  const [skills, setSkills] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, specsRes] = await Promise.all([
          api.get('/skills'),
          api.get('/specializations'),
        ]);
        setSkills(skillsRes.data);
        setSpecializations(specsRes.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchData();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categoryLabels = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Base de Datos',
    devops: 'DevOps',
    other: 'Otros',
  };

  return (
    <section className="about section" id="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Sobre Mí</h2>
          <p className="section-subtitle">
            Desarrollador Fullstack apasionado por crear soluciones digitales de alto impacto
          </p>
          <div className="section-divider" />
        </motion.div>

        <div className="about__content">
          <motion.div
            className="about__bio"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="about__avatar">
              <FaUserTie />
            </div>
            <h3 className="about__name">Marcelo</h3>
            <p className="about__role">Fullstack Developer & System Architect</p>
            <p className="about__desc">
              Con experiencia en el desarrollo de soluciones web integrales, desde e-commerce
              hasta sistemas administrativos complejos. Mi enfoque combina diseño premium
              con arquitectura robusta para entregar productos que superan expectativas.
            </p>
          </motion.div>

          <motion.div
            className="about__details"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="about__tabs">
              <button
                className={`about__tab ${activeTab === 'skills' ? 'about__tab--active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                <FaUserTie /> Conocimientos
              </button>
              <button
                className={`about__tab ${activeTab === 'diplomas' ? 'about__tab--active' : ''}`}
                onClick={() => setActiveTab('diplomas')}
              >
                <FaGraduationCap /> Especializaciones
              </button>
            </div>

            {activeTab === 'skills' && (
              <div className="about__skills">
                {Object.entries(groupedSkills).map(([category, items]) => (
                  <div key={category} className="about__skill-group">
                    <h4 className="about__skill-category">{categoryLabels[category] || category}</h4>
                    <div className="about__skill-list">
                      {items.map((skill) => (
                        <motion.div
                          key={skill.id}
                          className="about__skill-item"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="about__skill-name">{skill.name}</span>
                          <div className="about__skill-bar">
                            <motion.div
                              className="about__skill-fill"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                          <span className="about__skill-pct">{skill.proficiency}%</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="about__empty">Los conocimientos se cargarán desde el panel administrativo.</p>
                )}
              </div>
            )}

            {activeTab === 'diplomas' && (
              <div className="about__diplomas">
                {specializations.map((spec) => (
                  <motion.div
                    key={spec.id}
                    className="about__diploma-card card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="about__diploma-icon">
                      {spec.file_type === 'pdf' ? <FaFilePdf /> : <FaImage />}
                    </div>
                    <div className="about__diploma-info">
                      <h4>{spec.title}</h4>
                      <p>{spec.institution}</p>
                      {spec.date_obtained && (
                        <span className="about__diploma-date">
                          {new Date(spec.date_obtained).toLocaleDateString('es-AR')}
                        </span>
                      )}
                    </div>
                    {spec.file_path && (
                      <a
                        href={spec.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about__diploma-link"
                        title="Ver diploma"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </motion.div>
                ))}
                {specializations.length === 0 && (
                  <p className="about__empty">Las especializaciones se cargarán desde el panel administrativo.</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
