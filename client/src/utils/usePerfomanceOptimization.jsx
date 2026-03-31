import { useState, useEffect } from 'react';

export const usePerformanceOptimization = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isLowPerf, setIsLowPerf] = useState(false);
  const [performanceInfo, setPerformanceInfo] = useState({
    isLowPerf: false,
    shouldReduceMotion: false,
    reasons: [],
  });

  useEffect(() => {
    const checkPerformance = () => {
      const reasons = [];

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      if (isMobile) reasons.push('mobile_device');

      const isSmallScreen = window.innerWidth <= 768;
      if (isSmallScreen) reasons.push('small_screen');

      const isLowMemory = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      if (isLowMemory) reasons.push('low_memory');

      const isLowCPU = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
      if (isLowCPU) reasons.push('low_cpu');

      const lowPerf = isMobile || isSmallScreen || isLowMemory || isLowCPU;
      setIsLowPerf(lowPerf);

      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const reduceMotion = mediaQuery.matches;
      setShouldReduceMotion(reduceMotion);

      setPerformanceInfo({
        isLowPerf: lowPerf,
        shouldReduceMotion: reduceMotion,
        reasons,
      });
    };

    checkPerformance();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = e => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', checkPerformance);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkPerformance);
    };
  }, []);

  const getAnimationDuration = (baseDuration = 0.3, reducedDuration = 0.15) => {
    if (shouldReduceMotion) return 0;
    if (isLowPerf) return reducedDuration;
    return baseDuration;
  };

  const getTransitionType = () => {
    if (shouldReduceMotion) return { duration: 0 };
    if (isLowPerf) return { duration: 0.2, ease: 'linear' };
    return { duration: 0.3, ease: 'easeOut' };
  };

  return {
    isLowPerf,
    shouldReduceMotion,
    performanceInfo,
    getAnimationDuration,
    getTransitionType,
  };
};
