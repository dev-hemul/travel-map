import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Коректний імпорт

import AnnouncementModal from './components/announcements/AnnouncementModal'
import MapView from './components/MapView';
import SidebarLayout from './components/sidebarLayout/sidebarLayout';
import SupportModalWrapper from './components/support/supportModalWrapper';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profilePage';
import axios from 'axios';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];

      if (!accessToken && !refreshToken) {
        console.log('No tokens - redirecting to login');
        navigate('/login');
        return;
      }

      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          const now = Date.now() / 1000;
          if (decoded.exp < now + 3) { // Оновлюємо за 3 сек до смерті
            console.log('Access token expiring soon, refreshing...');
            try {
              const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
              localStorage.setItem('accessToken', response.data.accessToken);
              console.log('Refresh successful');
            } catch (refreshError) {
              console.log('Refresh failed:', refreshError.response?.status, refreshError.response?.data);
              localStorage.removeItem('accessToken');
              document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              navigate('/login');
              return;
            }
          }
        } catch (error) {
          console.log('Token decode error:', error.message);
          if (refreshToken) {
            try {
              const response = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
              localStorage.setItem('accessToken', response.data.accessToken);
              console.log('Refresh with refresh token successful');
            } catch (refreshError) {
              console.log('Refresh failed:', refreshError.response?.status, refreshError.response?.data);
              localStorage.removeItem('accessToken');
              document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              navigate('/login');
              return;
            }
          } else {
            console.log('No refresh token - logging out');
            localStorage.removeItem('accessToken');
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            navigate('/login');
            return;
          }
        }
      }
    }, 3000); // Кожні 3 секунди

    return () => clearInterval(interval);
  }, [navigate]);

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
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;