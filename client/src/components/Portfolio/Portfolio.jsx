import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaGitlab, FaExternalLinkAlt, FaFolder, FaGlobe } from 'react-icons/fa';
import api from '../../utils/api';
import './Portfolio.css';

const ensureProtocol = (url) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/portfolio');
        setProjects(res.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="portfolio section" id="portfolio">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Portafolio</h2>
          <p className="section-subtitle">
            Proyectos desarrollados con dedicación y tecnología de punta
          </p>
          <div className="section-divider" />
        </motion.div>

        {categories.length > 1 && (
          <div className="portfolio__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`portfolio__filter ${filter === cat ? 'portfolio__filter--active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        )}

        <div className="portfolio__grid">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              className="portfolio__card card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              layout
            >
              <div className="portfolio__card-image">
                {project.image_url ? (
                  <img
                    src={`http://localhost:5000${project.image_url}`}
                    alt={project.project_name}
                    loading="lazy"
                  />
                ) : (
                  <div className="portfolio__card-placeholder">
                    <FaFolder />
                  </div>
                )}
                <div className="portfolio__card-overlay">
                  <div className="portfolio__card-overlay-btns">
                    {project.site_url && (
                      <a
                        href={project.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio__card-repo-btn portfolio__card-site-btn"
                      >
                        <FaGlobe />
                        <span>Visitar Sitio</span>
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio__card-repo-btn"
                      >
                        {project.repo_url.includes('github') ? <FaGithub /> : <FaGitlab />}
                        <span>Repositorio</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="portfolio__card-body">
                <h3 className="portfolio__card-title">{project.project_name}</h3>
                {project.description && (
                  <p className="portfolio__card-desc">{project.description}</p>
                )}
                {project.technologies && (
                  <div className="portfolio__card-tech">
                    {project.technologies.split(',').map((tech, i) => (
                      <span key={i} className="portfolio__tech-tag">{tech.trim()}</span>
                    ))}
                  </div>
                )}

                <div className="portfolio__card-links">
                  {project.site_url && (
                    <a
                      href={project.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio__repo-link portfolio__site-link"
                    >
                      <FaGlobe />
                      <span>Visitar Sitio</span>
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio__repo-link"
                    >
                      {project.repo_url.includes('github') ? <FaGithub /> : <FaExternalLinkAlt />}
                      <span>Repositorio</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <motion.p
            className="portfolio__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Los proyectos se cargarán desde el panel administrativo.
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
