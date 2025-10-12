import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AnnouncementModal from './components/announcements/AnnouncementModal'
import MapView from './components/MapView';
import SidebarLayout from './components/sidebarLayout/sidebarLayout';
import SupportModalWrapper from './components/support/supportModalWrapper';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profilePage';
import axios from 'axios';

function App() {
  const navigate = useNavigate(); 
  const location = useLocation();

  // захищені роути
  const protectedRoutes = ['/profile', '/announcements', '/routes', '/support', '/settings', '/auth'];

  // Функція перевірки токенів
  const checkTokens = async () => {
    const accessToken = localStorage.getItem('accessToken'); 
    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1]; // Витягуємо refresh token

    // якщо немає токенів і користувач на захищеному роуті, перенаправляємо на логін
    if (!accessToken && !refreshToken && protectedRoutes.includes(location.pathname)) {
      console.log('немає токенів, захищений роут, редірект на логін');
      navigate('/login', { replace: true });
      return;
    }

    // якщо немає токенів, але роут не захищений, залишаємо користувача на сторінці, не викидаємо на сторінку логіна
    if (!accessToken && !refreshToken) {
      console.log('немає токенів, користувач не залогінений, дозволено переглядати незахищені роути');
      return;
    }

    // Якщо є аксестокен, перевіряємо його
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken); 
        const now = Date.now() / 1000; 
        if (decoded.exp < now + 3) { 
          console.log('Access token expiring soon, refreshing...');
          try {
            const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true }); 
            localStorage.setItem('accessToken', response.data.accessToken); 
            console.log('Refresh successful');
          } catch (refreshError) {
            console.log('Refresh failed:', refreshError.response?.status, refreshError.response?.data);
            localStorage.removeItem('accessToken'); 
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; 
            navigate('/login', { replace: true }); /
            return;
          }
        }
      } catch (error) {
        console.log('Token decode error:', error.message);
        if (refreshToken) { // якщо є рефрештокен, оновлюємо його
          try {
            const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log('Refresh with refresh token successful');
          } catch (refreshError) {
            console.log('Refresh failed:', refreshError.response?.status, refreshError.response?.data);
            localStorage.removeItem('accessToken');
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            navigate('/login', { replace: true });
            return;
          }
        } else {
          console.log('No refresh token - logging out');
          localStorage.removeItem('accessToken');
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          navigate('/login', { replace: true });
          return;
        }
      }
    }
  };

  useEffect(() => {
    checkTokens();

    // періодична перевірка, щоб вчасно викидати користувча
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