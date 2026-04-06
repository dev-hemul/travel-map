import { motion } from 'framer-motion';
import { FiArrowLeft, FiMenu, FiX, FiShare2, FiHeart } from 'react-icons/fi';

export const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen, onBack }) => (
  <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 text-gray-600 hover:text-[#e65000] cursor-pointer transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </motion.button>

          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#e65000] cursor-pointer transition-colors"
          >
            <FiArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Назад</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <ActionButton icon={<FiShare2 />} />
          <ActionButton icon={<FiHeart />} hoverColor="hover:text-red-500" />
        </div>
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, hoverColor = 'hover:text-[#e65000]' }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`p-2 text-gray-500 ${hoverColor} cursor-pointer transition-colors`}
  >
    {icon}
  </motion.button>
);
