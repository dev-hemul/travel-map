import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLargeScreen = windowWidth >= 1200;
  const isMediumScreen = windowWidth >= 768 && windowWidth < 1200;
  const isSmallScreen = windowWidth >= 640 && windowWidth < 768;
  const isXSmallScreen = windowWidth < 640;

  return {
    windowWidth,
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
    isXSmallScreen,
  };
};
