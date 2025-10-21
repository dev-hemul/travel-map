import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AnnouncementModal from './components/announcements/AnnouncementModal';
import MapView from './components/MapView';
import SidebarLayout from './components/sidebarLayout/sidebarLayout';
import SupportModalWrapper from './components/support/supportModalWrapper';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profilePage';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Стан завантаження для лоадера
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Стан авторизації

  // Захищені роути
  const protectedRoutes = ['/profile', '/announcements', '/routes', '/support', '/settings', '/auth'];

  // Функція перевірки токенів
  const checkTokens = async () => {
    console.log('=== CheckAuth started ===');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refreshToken='))?.split('=')[1];

    console.log('AccessToken present:', !!accessToken);
    console.log('RefreshToken present:', !!refreshToken);

    if (!accessToken && !refreshToken && protectedRoutes.includes(location.pathname)) {
      console.log('No tokens - redirect to login');
      setIsAuthenticated(false);
      setLoading(false);
      navigate('/login', { replace: true });
      return;
    }

    if (!accessToken && !refreshToken) {
      console.log('No tokens, allowing public routes');
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const now = Date.now() / 1000;
        if (decoded.exp < now + 3) {
          console.log('Access token expires soon, refreshing...');
          try {
            const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Refresh successful');
          } catch (refreshError) {
            console.log('Refresh error:', refreshError.response?.status, refreshError.response?.data);
            localStorage.removeItem('accessToken');
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            if (protectedRoutes.includes(location.pathname)) {
              navigate('/login', { replace: true });
            }
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Decode error:', error.message);
        if (refreshToken) {
          try {
            const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Refresh with refresh token successful');
          } catch (refreshError) {
            console.log('Refresh error:', refreshError.response?.status, refreshError.response?.data);
            localStorage.removeItem('accessToken');
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            if (protectedRoutes.includes(location.pathname)) {
              navigate('/login', { replace: true });
            }
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
        } else {
          console.log('No refresh token - logout');
          localStorage.removeItem('accessToken');
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          if (protectedRoutes.includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
      }
    }

    // Якщо все ок, вважаємо авторизованим
    setIsAuthenticated(true);
    setLoading(false);
  };

  useEffect(() => {
    checkTokens();

    // Періодична перевірка (опціонально, можна відключити)
    let interval;
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refreshToken='))?.split('=')[1];
    if (accessToken || refreshToken) {
      interval = setInterval(checkTokens, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [navigate, location.pathname]);

  // Лоадер на найвищому рівні
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#744ce9] mx-auto"></div>
          <p className="mt-4 text-lg text-[#744ce9] font-medium">Перевірка авторизації...</p>
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