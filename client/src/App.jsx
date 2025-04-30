import './App.css';
import React, { useState } from 'react';
import MapView from './components/MapView';
import SupportButton from './components/support/supportButton';
import SupportModal from './components/support/supportModal';

function App() {
  const [showSupport, setShowSupport] = useState(false);

  const handleSupportButtonClick = () => {
    setShowSupport(true);
  };

  const handleCloseSupportModal = () => {
    setShowSupport(false);
  };

  return (
    <>
      <div className="map-container">
        <MapView className="map-view" />
        <SupportButton onClick={handleSupportButtonClick} />
        
        {showSupport && (
          <div className="support-modal-container">
            <SupportModal onClose={handleCloseSupportModal} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
