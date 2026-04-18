import { motion } from 'framer-motion';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';

export const SidebarToggle = ({ isOpen, onToggle, sidebarWidth }) => (
  <motion.button
    onClick={onToggle}
    className="fixed top-4 z-50 w-9 h-9 bg-[#744ce9] text-white rounded-full flex items-center justify-center shadow-lg"
    animate={{ left: sidebarWidth + 8 }}
    transition={{ type: 'tween', duration: 0.3 }}
  >
    {isOpen ? <FaLongArrowAltLeft size={18} /> : <FaLongArrowAltRight size={18} />}
  </motion.button>
);
