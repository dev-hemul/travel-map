
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';


import AnnouncementDetailPage from './pages/announcementDetailPage.jsx';
import AnnouncementModal from './components/announcements/announcementModal';
import MapView from './components/MapView';
import PrivateRouter from './components/PrivateRouter';
import SidebarLayout from './components/sidebarLayout/sidebarLayout';
import SupportModalWrapper from './components/support/supportModalWrapper';
import AdminTestPage from './pages/adminTestPage.jsx';
import CreateAnnouncementPage from './pages/createAnnouncementPage';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profilePage';



axios.defaults.withCredentials = true;

function App() {
  const [isReady, setIsReady] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsReady(true);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now + 300) {
        const res = await axios.post(
          'http://localhost:4000/refresh-token',
          {},
          { withCredentials: true }
        );
        localStorage.setItem('accessToken', res.data.accessToken);
      }
    } catch {
      localStorage.removeItem('accessToken');
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    checkAuth();

    const interval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios
          .post('http://localhost:4000/refresh-token', {}, { withCredentials: true })
          .then(res => localStorage.setItem('accessToken', res.data.accessToken))
          .catch(() => localStorage.removeItem('accessToken'));
      }
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
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

        <Route path="/create-announcement" element={<CreateAnnouncementPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Додано маршрут для сторінки деталей оголошення */}
        <Route path="/announcement/:id" element={<AnnouncementDetailPage />} />

        <Route element={<PrivateRouter />}>
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
                <div>Налаштування авторизації</div>
              </SidebarLayout>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;