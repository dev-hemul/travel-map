import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaLayerGroup, FaMap, FaSatellite } from 'react-icons/fa';
import { GiCompass } from 'react-icons/gi';

const LayersSwitcher = ({ mapType, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = nextType => {
    onChange(nextType);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative z-[1000]">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200"
      >
        <FaLayerGroup className="text-2xl text-gray-700" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full z-10 mt-2 flex flex-col space-y-2 -translate-x-14"
          >
            <button
              type="button"
              onClick={() => handleSelect('standard')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-md transition-all duration-300 ${
                mapType === 'standard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaMap className="text-xl" />
              <span>Стандартна</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('satellite')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-md transition-all duration-300 ${
                mapType === 'satellite'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaSatellite className="text-xl" />
              <span>Супутникова</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('topographic')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 shadow-md transition-all duration-300 ${
                mapType === 'topographic'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <GiCompass className="text-xl" />
              <span>Топографічна</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LayersSwitcher;
