import { useState, useEffect } from 'react';

import { BREAKPOINTS } from '../constants';

export const useSidebarLogic = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > BREAKPOINTS.TABLET) {
      setIsSidebarOpen(true);
      setShowToggleButton(false);
    } else {
      setIsSidebarOpen(false);
      setShowToggleButton(true);
    }
  }, [windowWidth]);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    showToggleButton,
    windowWidth,
    breakpoints: BREAKPOINTS,
  };
};
