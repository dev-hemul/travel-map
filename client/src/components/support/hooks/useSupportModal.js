import { useState } from 'react';

export default function useSupportModal() {
  const [showSupport, setShowSupport] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSupportModal = () => {
    setShowSupport(prev => !prev);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    const newTheme = isDarkMode ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
  };

  return { showSupport, toggleSupportModal, isDarkMode, toggleTheme };
}