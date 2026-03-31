import { motion } from 'framer-motion';
import { FiMoon, FiMessageCircle, FiUsers, FiLogOut } from 'react-icons/fi';

const MobileMenu = ({ toggleDarkMode, handleLogout, getInitials, firstName, lastName }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDarkMode}
        className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded hover:bg-[#f0e8ff] transition-colors"
      >
        <FiMoon />
        <span>Тема</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded hover:bg-[#f0e8ff] transition-colors"
      >
        <FiMessageCircle />
        <span>Повідомлення</span>
        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          3
        </span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded hover:bg-[#f0e8ff] transition-colors"
      >
        <FiUsers />
        <span>Друзі</span>
        <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          5
        </span>
      </motion.button>
      <div className="flex items-center gap-2 p-2 border rounded bg-[#f0e8ff]">
        <div className="w-8 h-8 rounded-full bg-[#744ce9] text-white flex items-center justify-center text-sm font-semibold shadow flex-shrink-0">
          {getInitials()}
        </div>
        <span className="text-[#744ce9] text-base font-medium">
          {firstName} {lastName}
        </span>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="flex items-center gap-2 text-[#dc2626] text-base p-2 border rounded hover:bg-[#fee2e2] transition-colors"
      >
        <FiLogOut />
        <span>Вихід</span>
      </motion.button>
    </div>
  );
};

export default MobileMenu;
