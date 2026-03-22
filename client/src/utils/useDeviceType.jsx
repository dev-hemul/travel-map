import { useState, useEffect } from 'react';

export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: window.innerWidth,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      const isMobileWidth = width < 768;
      const isTabletWidth = width >= 768 && width < 1024;

      const mobile = isMobileDevice || isMobileWidth;
      const tablet = isTabletWidth && !mobile;

      setIsMobile(mobile);
      setIsTablet(tablet);
      setDeviceInfo({
        isMobile: mobile,
        isTablet: tablet,
        isDesktop: !mobile && !tablet,
        screenWidth: width,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, deviceInfo };
};
