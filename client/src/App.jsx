import React from 'react';
import Announcements from './components/announcements/AnnouncementModalWrapper';
import MapView from './components/MapView';
import SupportModalWrapper from './components/support/supportModalWrapper';
import AnnouncementModalWrapper from './components/announcements/AnnouncementModalWrapper';
import './App.css';

function App() {
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
      <MapView />
      <Announcements />
      <SupportModalWrapper />
      <AnnouncementModalWrapper />
    </div>
  );
}

export default App;