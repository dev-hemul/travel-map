import { useState } from 'react';
import useTheme from './hooks/useTheme';
import AnnouncementsBtn from './announcementsBtn';
import AnnouncementModal from './announcementModal';

export default function AnnouncementModalWrapper() {
  const [showModal, setShowModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleModal = () => {
    setShowModal(prev => !prev);
  };

  return (
    <>
      <AnnouncementsBtn onClick={toggleModal} />
      
      {showModal && (
        <AnnouncementModal 
          onClose={toggleModal} 
          toggleTheme={toggleTheme} 
          currentTheme={theme} 
        />
      )}
    </>
  );
}