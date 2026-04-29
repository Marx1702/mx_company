import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardHome from './pages/Dashboard/DashboardHome';
import PortfolioAdmin from './pages/Dashboard/PortfolioAdmin';
import SkillsAdmin from './pages/Dashboard/SkillsAdmin';
import SpecializationsAdmin from './pages/Dashboard/SpecializationsAdmin';
import ClientsAdmin from './pages/Dashboard/ClientsAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#141414',
              color: '#fff',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '0.9rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            success: {
              iconTheme: { primary: '#d4af37', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#e74c3c', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Admin dashboard (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="portfolio" element={<PortfolioAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="specializations" element={<SpecializationsAdmin />} />
            <Route path="clients" element={<ClientsAdmin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
