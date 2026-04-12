import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaRoute, FaLongArrowAltLeft, FaLongArrowAltRight, FaBullhorn, FaUserShield } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { NavLink, Outlet } from 'react-router';

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const breakPoint768 = 768;
  const breakPoint1200 = 1200;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > breakPoint1200) {
      setIsSidebarOpen(true);
      setShowToggleButton(false);
    } else if (windowWidth <= breakPoint768) {
      setIsSidebarOpen(false);
      setShowToggleButton(true);
    } else {
      setIsSidebarOpen(false);
      setShowToggleButton(true);
    }
  }, [windowWidth]);

  const baseLinkStyles = 'py-2 px-4 rounded-lg flex items-center transition-all duration-200 ease-in-out';

  const activeStyle = ({ isActive }) => {
    if (windowWidth < breakPoint768 && isSidebarOpen) {
      return `${baseLinkStyles} ${isActive ? 'bg-[#744ce9] text-white' : 'text-[#797979] hover:bg-[#744CE9] hover:text-white'}`;
    } else if (isSidebarOpen) {
      return `${baseLinkStyles} ${isActive ? 'bg-[#744ce9] text-white' : 'text-[#797979] hover:bg-[#744CE9] hover:text-white'}`;
    } else {
      return `${baseLinkStyles} ${isActive ? 'text-[#744ce9]' : 'text-[#797979] hover:text-[#744CE9]'} justify-center`;
    }
  };

  const links = [
    { to: '/profile', icon: <CgProfile size={29} />, label: 'Профіль' },
    { to: '/announcements', icon: <FaBullhorn size={25} />, label: 'Оголошення' },
    { to: '/routes', icon: <FaRoute size={25} />, label: 'Маршрути' },
    { to: '/settings', icon: <IoMdSettings size={25} />, label: 'Налаштування' },
    { to: '/admin', icon: <FaUserShield size={25} />, label: 'Адміністрування' },
  ];

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">

      {windowWidth < breakPoint768 && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-2 z-70 w-8 h-8 bg-[#744ce9] text-white rounded-full flex items-center justify-center shadow-lg"
        >
          <FaLongArrowAltRight size={16} />
        </button>
      )}

      <motion.div
        className="fixed left-0 top-0 h-full bg-white p-6 flex flex-col shadow-lg z-[60]"
        animate={{
          width: windowWidth < breakPoint768 ? (isSidebarOpen ? '100%' : 0) : isSidebarOpen ? 256 : 64,
        }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        {showToggleButton && windowWidth >= breakPoint768 && (
          <motion.button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 z-50 w-9 h-9 bg-[#744ce9] text-white rounded-full flex items-center justify-center shadow-lg"
            animate={{ left: isSidebarOpen ? 256 : 8 }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {isSidebarOpen ? <FaLongArrowAltLeft size={18} /> : <FaLongArrowAltRight size={18} />}
          </motion.button>
        )}
        
        {windowWidth < breakPoint768 && isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 z-[70] w-5 h-5 bg-[#744ce9] hover:bg-[#5d39b3] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
          >
            <FaLongArrowAltLeft size={18} />
          </button>
        )}

        <motion.div className="flex flex-col items-center mb-8" animate={{ opacity: isSidebarOpen ? 1 : 0 }}>
          <h1 className="font-bold text-[#744ce9] text-2xl text-center">
            Особистий<br />кабінет
          </h1>
          <h2 className="text-[#744ce9] mt-4 text-center">Вітаємо Користувач!</h2>
        </motion.div>

        <nav className="flex flex-col justify-between h-full">
          <div className="space-y-4">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={activeStyle}
                onClick={() => windowWidth < breakPoint768 && setIsSidebarOpen(false)}
              >
                {windowWidth < breakPoint768 && isSidebarOpen ? (
                  <div className="flex flex-col items-center justify-center w-full gap-1">
                    {link.icon}
                    <motion.span className="text-sm text-center">{link.label}</motion.span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {link.icon}
                    <motion.span
                      className="ml-7 whitespace-nowrap overflow-hidden"
                      animate={{ opacity: isSidebarOpen ? 1 : 0, maxWidth: isSidebarOpen ? 200 : 0 }}
                    >
                      {link.label}
                    </motion.span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </motion.div>
      
      <div 
        className="flex-1 min-h-screen bg-white p-4 sm:p-6 lg:p-8"
        style={{
          paddingLeft: windowWidth < breakPoint768 ? '64px' : (isSidebarOpen ? '256px' : '64px'),
          paddingRight: '16px',           // костиль 
        }}
        onClick={() => windowWidth < breakPoint768 && isSidebarOpen && setIsSidebarOpen(false)}
      >
        <div className="w-full max-w-[1280px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;