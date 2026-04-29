-- =============================================
-- MX SOLUTIONS - Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS u447396976_mx_solutions ;
USE u447396976_mx_solutions;

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients / Contact requests
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(200),
  message TEXT,
  service_interested VARCHAR(200),
  status ENUM('new', 'contacted', 'in_progress', 'completed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio projects
CREATE TABLE IF NOT EXISTS portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url VARCHAR(500),
  repo_url VARCHAR(500),
  technologies VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills / Programming languages
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  category ENUM('frontend', 'backend', 'database', 'devops', 'other') DEFAULT 'other',
  proficiency INT DEFAULT 80,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specializations / Diplomas
CREATE TABLE IF NOT EXISTS specializations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  institution VARCHAR(300),
  file_path VARCHAR(500),
  file_type ENUM('pdf', 'image') DEFAULT 'image',
  description TEXT,
  date_obtained DATE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services offered
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123 - CHANGE IN PRODUCTION)
INSERT INTO admins (username, password) VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert default services
INSERT INTO services (title, description, icon, display_order) VALUES
('E-Commerce', 'Desarrollo de tiendas online completas con pasarelas de pago, gestión de inventario y experiencia de compra optimizada.', 'FaShoppingCart', 1),
('Landing Pages', 'Páginas de aterrizaje de alto impacto diseñadas para convertir visitantes en clientes potenciales.', 'FaRocket', 2),
('Sistemas Administrativos', 'Software de gestión empresarial a medida: facturación, RRHH, inventarios y más.', 'FaChartBar', 3),
('Web Apps', 'Aplicaciones web interactivas y escalables con tecnologías modernas.', 'FaLaptopCode', 4),
('Administración de BD', 'Diseño, optimización y mantenimiento de bases de datos SQL y NoSQL.', 'FaDatabase', 5),
('Arquitectura de Sistemas', 'Diseño de arquitecturas escalables, seguras y de alto rendimiento.', 'FaSitemap', 6),
('Acompañamiento al Cliente', 'Asesoramiento técnico continuo durante todo el ciclo de vida del proyecto.', 'FaHandshake', 7),
('Mantenimiento', 'Soporte técnico, actualizaciones y monitoreo post-lanzamiento.', 'FaTools', 8);
