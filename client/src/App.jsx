import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AnnouncementModal from './components/announcements/announcementModal';
import MapView from './components/MapView';
import SidebarLayout from './components/sidebarLayout/sidebarLayout';
import SupportModalWrapper from './components/support/supportModalWrapper';
import LoginPage from './pages/login/LoginPage';
import ProfilePage from './pages/profilePage';
import CreateAnnouncementPage from './components/announcements/createAnnouncementPage';

function App() {
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
        {/* Додайте цей маршрут */}
        <Route
          path="/create-announcement"
          element={
            
              <CreateAnnouncementPage />
           
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
              <div>Налаштування авторизації</div>
            </SidebarLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;