import React from 'react';

import Announcements from './components/announcements/announcementModalWrapper';
import SearchBar from './components/announcements/SearchBar';
import MapView from './components/MapView';
import SupportModalWrapper from './components/support/supportModalWrapper';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarLayout from './components/sidebarLayour/sidebarLayout';
import ProfilePage from './pages/profilePage';


import './App.css';

function App() {
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
      {/* <MapView />
      <SearchBar />
      <Announcements />
      <SupportModalWrapper /> */}
      <Router>
        <Routes>
          <Route path="/" element={<MapView />} />
          
          <Route element={<SidebarLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            {/* Інші маршрути з сайдбаром */}
            <Route path="/announcements" element={<div>Оголошення</div>} />
            <Route path="/routes" element={<div>Маршрути</div>} />
            <Route path="/support" element={<div>Підтримка</div>} />
            <Route path="/settings" element={<div>Налаштування</div>} />
          </Route>
          
          {/* Маршрути без сайдбара */}
          <Route path="/login" element={<div>Логін</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
