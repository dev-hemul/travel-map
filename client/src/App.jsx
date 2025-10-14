import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // Додано useNavigate
import { jwtDecode } from 'jwt-decode'; // Додано jwtDecode
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

  // Захищені роути
  const protectedRoutes = ['/profile', '/announcements', '/routes', '/support', '/settings', '/auth'];

  // Функція перевірки токенів
  const checkTokens = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];

    // якщо немає токенів і користувач на захищеному роуті, перенаправляємо на логін
    if (!accessToken && !refreshToken && protectedRoutes.includes(location.pathname)) {
      console.log('Немає токенів, захищений роут, редирект на логін');
      navigate('/login', { replace: true });
      return;
    }

    // якщо немає токенів, але роут не захищений, дозволяємо залишатися на незахищених сторінках
    if (!accessToken && !refreshToken) {
      console.log('Немає токенів, користувач не залогінений, дозволено переглядати незахищені роути');
      return;
    }

    // якщо є аксестокен, перевіряємо його
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const now = Date.now() / 1000;
        if (decoded.exp < now + 3) {
          console.log('Access token скоро закінчиться, оновлюємо...');
          try {
            const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Оновлення успішне');
          } catch (refreshError) {
            console.log('Помилка оновлення:', refreshError.response?.status, refreshError.response?.data);
            localStorage.removeItem('accessToken');
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            navigate('/login', { replace: true });
            return;
          }
        }
      } catch (error) {
        console.log('Помилка декодування токена:', error.message);
        if (refreshToken) {
          try {
            const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Оновлення за допомогою refresh token успішне');
          } catch (refreshError) {
            console.log('Помилка оновлення:', refreshError.response?.status, refreshError.response?.data);
            localStorage.removeItem('accessToken');
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            navigate('/login', { replace: true });
            return;
          }
        } else {
          console.log('Немає refresh token - вихід');
          localStorage.removeItem('accessToken');
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          navigate('/login', { replace: true });
          return;
        }
      }
    }
  };

  useEffect(() => {
    checkTokens(); // перевіряємо токени одразу

    // періодична перевірка для залогінених
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
    let interval;
    if (accessToken || refreshToken) {
      interval = setInterval(checkTokens, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 relative">
      <Routes>
        {/* Публічні роути */}
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

        {/* Захищені роути */}
        <Route
          path="/profile"
          element={
            <SidebarLayout>
              <ProfilePage />
            </SidebarLayout>
          }
        />
        <Route
          path="/announcements"
          element={
            <SidebarLayout>
              <div>Оголошення</div>
            </SidebarLayout>
          }
        />
        <Route
          path="/routes"
          element={
            <SidebarLayout>
              <div>Маршрути</div>
            </SidebarLayout>
          }
        />
        <Route
          path="/support"
          element={
            <SidebarLayout>
              <div>Підтримка</div>
            </SidebarLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <SidebarLayout>
              <div>Налаштування</div>
            </SidebarLayout>
          }
        />
        <Route
          path="/auth"
          element={
            <SidebarLayout>
              <div>налаштування авторизації</div>
            </SidebarLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;