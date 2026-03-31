import { motion } from 'framer-motion';
import {
  FiMap,
  FiArrowLeft,
  FiSearch,
  FiMoon,
  FiMessageCircle,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router';

const ProfileHeader = ({
  darkMode,
  toggleDarkMode,
  handleLogout,
  getInitials,
  firstName,
  lastName,
  isMobileMenuOpen,
  toggleMobileMenu,
  isLargeScreen,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-[#F4EFFF] rounded-xl px-4 py-2 mb-6 gap-4 border border-gray-300 shadow-lg">
      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', color: '#744ce9' }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 text-sm bg-[#744ce9] text-white w-full sm:w-auto py-2 px-4 rounded-md shadow transition-all duration-50 cursor-pointer border-2 border-[#744ce9] justify-center"
      >
        <FiMap size={20} />
        <FiArrowLeft size={20} />
        <span>Повернутись до карти</span>
      </motion.button>

      <div className="relative w-full max-w-3xl mt-2 sm:mt-0">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Пошук..."
          className="bg-white text-sm text-gray-700 placeholder-gray-400 pl-10 pr-4 py-2 rounded-md w-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:border-transparent"
        />
      </div>

      {isLargeScreen ? (
        <DesktopMenu
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          handleLogout={handleLogout}
          getInitials={getInitials}
          firstName={firstName}
          lastName={lastName}
        />
      ) : (
        <MobileMenuButton toggleMobileMenu={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      )}
    </div>
  );
};

const DesktopMenu = ({ toggleDarkMode, handleLogout, getInitials, firstName, lastName }) => (
  <div className="flex items-center gap-3">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleDarkMode}
      className="text-[#744ce9] text-xl p-2 rounded cursor-pointer"
    >
      <FiMoon />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="text-[#744ce9] text-xl p-2 relative rounded cursor-pointer"
    >
      <FiMessageCircle />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        3
      </span>
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="text-[#744ce9] text-xl p-2 relative rounded cursor-pointer"
    >
      <FiUsers />
      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        5
      </span>
    </motion.button>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-[#744ce9] text-white flex items-center justify-center text-sm font-semibold shadow">
        {getInitials()}
      </div>
      <p className="text-base font-medium text-gray-700 whitespace-nowrap">
        {firstName} {lastName}
      </p>
    </div>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleLogout}
      className="text-[#dc2626] text-xl p-2 rounded cursor-pointer"
    >
      <FiLogOut />
    </motion.button>
  </div>
);

const MobileMenuButton = ({ toggleMobileMenu, isMobileMenuOpen }) => (
  <motion.button
    onClick={toggleMobileMenu}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mt-2 text-[#744ce9] text-xl p-2 rounded cursor-pointer flex items-center justify-center"
  >
    {isMobileMenuOpen ? <FiX /> : <FiMenu />}
  </motion.button>
);

export default ProfileHeader;
