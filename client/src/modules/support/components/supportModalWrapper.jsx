import { useState } from 'react';

import ContactSupport from './ContactSupport';
import SupportModal from './supportModal';

export default function SupportModalWrapper() {
  const [showSupport, setShowSupport] = useState(false);

  const toggleSupportModal = () => {
    setShowSupport(prev => !prev);
  };

  const telegramLink = 'https://t.me/dobrotvorcev';

  return (
    <>
      <ContactSupport onOpenForm={toggleSupportModal} telegramLink={telegramLink} />

      {showSupport && <SupportModal onClose={toggleSupportModal} />}
    </>
  );
}
