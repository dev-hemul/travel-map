import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { FaRuler } from 'react-icons/fa';

export default function RouletteButton({ isMeasureEnabled, onToggleMeasure }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClick = () => {
    //перемикаємо режим лінійки в батьківському елементі
    onToggleMeasure && onToggleMeasure();
    setIsOpen(prev => !prev);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`w-full flex items-center justify-center p-2 rounded-full shadow-md border hover:cursor-pointer ${
          isMeasureEnabled
            ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
        } active:bg-gray-200 transition-colors duration-200`}
        title={isMeasureEnabled ? 'Режим лінійка увімкнений' : 'Режим лінійка вимкнений'}
      >
        <FaRuler className="text-3xl" />
      </button>
    </div>
  );
}
