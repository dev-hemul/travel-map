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

// глобальний аксіос шоб не прописувати кожен раз with cred.
axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const protectedRoutes = ['/profile', '/announcements', '/routes', '/support', '/settings', '/auth'];

  const checkTokens = async () => {
    console.log('=== CheckAuth started ===');
    const accessToken = localStorage.getItem('accessToken');
    console.log('AccessToken present:', !!accessToken);

    if (!accessToken && protectedRoutes.includes(location.pathname)) {
      console.log('No access token - redirect to login');
      setIsAuthenticated(false);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      navigate('/login', { replace: true });
      return;
    }

    if (!accessToken) {
      console.log('No access token, allowing public routes');
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const now = Date.now() / 1000;
      if (decoded.exp < now + 3) {
        console.log('Access token expires soon, refreshing...');
        const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
        localStorage.setItem('accessToken', response.data.accessToken);
        console.log('Refresh successful');
      }
    } catch (error) {
      console.log('Decode or refresh error:', error.response?.status, error.response?.data);
      localStorage.removeItem('accessToken');
      if (protectedRoutes.includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  };

  useEffect(() => {
    checkTokens();

    let interval;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      interval = setInterval(checkTokens, 10000); 
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [navigate, location.pathname]);

  // Спінер
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
        <Route
          path="/"
          element={
            <>
              <MapView />
              <SupportModalWrapper />
              <AnnouncementModal />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <ProfilePage />
              </SidebarLayout>
            ) : null
          }
        />
        <Route
          path="/announcements"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <div>Оголошення</div>
              </SidebarLayout>
            ) : null
          }
        />
        <Route
          path="/routes"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <div>Маршрути</div>
              </SidebarLayout>
            ) : null
          }
        />
        <Route
          path="/support"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <div>Підтримка</div>
              </SidebarLayout>
            ) : null
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <div>Налаштування</div>
              </SidebarLayout>
            ) : null
          }
        />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <SidebarLayout>
                <div>налаштування авторизації</div>
              </SidebarLayout>
            ) : null
          }
        />
      </Routes>
    </div>
  );
}

export default App;