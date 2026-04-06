import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import AuthMenu from './AuthMenu';
import LayersSwitcher from './LayersSwitcher';
import LocateMeButton from './LocateMeButton';
import RouletteWidget from './RouletteWidget';
import WeatherWidget from './WeatherWidget';

const MapControlsPanel = ({
  mapType,
  onMapTypeChange,
  onLocate,
  isMeasureEnabled,
  onToggleMeasure,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -1 }, // минимальное смещение
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -1 },
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      {/* Бургер-кнопка всегда здесь, отдельно от анимаций */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-300"
        type="button"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-5 h-5">
          <span
            className={`absolute left-0 w-5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-45 top-2' : 'rotate-0 top-0'
            }`}
            style={{ height: '3px' }}
          />
          <span
            className={`absolute left-0 w-5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${
              isOpen ? 'opacity-0' : 'opacity-100 top-2'
            }`}
            style={{ height: '3px' }}
          />
          <span
            className={`absolute left-0 w-5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${
              isOpen ? '-rotate-45 top-2' : 'rotate-0 top-4'
            }`}
            style={{ height: '3px' }}
          />
        </div>
      </motion.button>

      {/* Остальные кнопки с анимацией */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            className="flex flex-col gap-3 items-start mt-3" // Добавлен mt-3 для отступа от бургера
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants}>
              <AuthMenu />
            </motion.div>
            <motion.div variants={itemVariants}>
              <LayersSwitcher mapType={mapType} onChange={onMapTypeChange} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <WeatherWidget />
            </motion.div>
            <motion.div variants={itemVariants}>
              <LocateMeButton onClick={onLocate} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <RouletteWidget
                isMeasureEnabled={isMeasureEnabled}
                onToggleMeasure={onToggleMeasure}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapControlsPanel;
