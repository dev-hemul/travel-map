import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AnnouncementModal from './components/announcements/AnnouncementModal';
import MapView from './components/MapView';
import SidebarLayout from './components/sidebarLayout/sidebarLayout';
import SupportModalWrapper from './components/support/supportModalWrapper';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profilePage';
import PrivateRouter from './components/PrivateRouter'; 

axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const protectedRoutes = ['/profile', '/announcements', '/routes', '/support', '/settings', '/auth'];

  const checkTokens = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const now = Date.now() / 1000;

      if (decoded.exp < now + 300) {
        const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Перевірка при завантаженні + кожні 5 хв
  useEffect(() => {
    checkTokens();
    const interval = setInterval(checkTokens, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && protectedRoutes.includes(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#744ce9] mx-auto"></div>
          <p className="mt-4 text-lg text-[#744ce9] font-medium">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 relative">
      <Routes>
        <Route path="/" element={<><MapView /><SupportModalWrapper /><AnnouncementModal /></>} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<PrivateRouter isAuthenticated={isAuthenticated} />}>
          <Route path="/profile" element={<SidebarLayout><ProfilePage /></SidebarLayout>} />
          <Route path="/announcements" element={<SidebarLayout><div>Оголошення</div></SidebarLayout>} />
          <Route path="/routes" element={<SidebarLayout><div>Маршрути</div></SidebarLayout>} />
          <Route path="/support" element={<SidebarLayout><div>Підтримка</div></SidebarLayout>} />
          <Route path="/settings" element={<SidebarLayout><div>Налаштування</div></SidebarLayout>} />
          <Route path="/auth" element={<SidebarLayout><div>Налаштування авторизації</div></SidebarLayout>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;