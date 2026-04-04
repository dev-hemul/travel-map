import { motion } from 'framer-motion';
import { FaBullhorn } from 'react-icons/fa';

const AnnouncementButton = ({ onClick, isLowPerf, shouldReduceMotion }) => {
  const buttonHoverAnimation = !isLowPerf && !shouldReduceMotion ? { scale: 1.05 } : {};
  const buttonTapAnimation = !isLowPerf && !shouldReduceMotion ? { scale: 0.95 } : {};

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 left-4 z-[998] p-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-lg active:shadow-xl transition-shadow duration-200 flex items-center justify-center"
      whileHover={buttonHoverAnimation}
      whileTap={buttonTapAnimation}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <FaBullhorn className="text-xl sm:text-2xl" />
    </motion.button>
  );
};

export default AnnouncementButton;
