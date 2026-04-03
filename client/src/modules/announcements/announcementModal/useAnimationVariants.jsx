import { useMemo } from 'react';

export const useAnimationVariants = (isLowPerf, shouldReduceMotion) => {
  const overlayVariants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }

    if (isLowPerf) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      };
    }

    return {
      initial: { opacity: 0, backdropFilter: 'blur(0px)' },
      animate: {
        opacity: 1,
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        transition: { duration: 0.25 },
      },
      exit: {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        transition: { duration: 0.2 },
      },
    };
  }, [isLowPerf, shouldReduceMotion]);

  const sidebarVariants = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        initial: { x: '-100%' },
        animate: { x: 0 },
        exit: { x: '-100%' },
      };
    }

    if (isLowPerf) {
      return {
        initial: { x: '-100%' },
        animate: { x: 0, transition: { duration: 0.2 } },
        exit: { x: '-100%', transition: { duration: 0.15 } },
      };
    }

    return {
      initial: { x: '-100%', opacity: 0 },
      animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeOut' },
      },
      exit: {
        x: '-100%',
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeIn' },
      },
    };
  }, [isLowPerf, shouldReduceMotion]);

  return { overlayVariants, sidebarVariants };
};
