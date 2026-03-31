import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ModalSidebar = ({ children, variants, onClose, isMobile }) => {
  return (
    <motion.div
      className={`fixed top-0 left-0 h-full w-full ${isMobile ? 'w-full' : 'sm:w-96'} z-[9999] flex flex-col bg-white text-gray-900 border-r border-gray-200 shadow-2xl`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="relative px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="pr-8">
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">Пропозиції</h2>
          <p className="text-blue-100 mt-0.5 text-xs sm:text-sm">
            Перегляньте та додайте нові пропозиції
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 active:bg-white/30 transition-colors text-white"
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          <FaTimes className="text-sm sm:text-base" />
        </button>
      </div>

      {children}
    </motion.div>
  );
};

export default ModalSidebar;
