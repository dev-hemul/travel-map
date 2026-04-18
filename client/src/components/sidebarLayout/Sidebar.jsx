import { motion } from 'framer-motion';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { NavLink } from 'react-router';

import { SIDEBAR_LINKS } from './constants';
import { useSidebarStyles } from './hooks/useSidebarStyles';

export const Sidebar = ({ isOpen, onClose, windowWidth, breakpoints }) => {
  const { getLinkStyles } = useSidebarStyles(windowWidth, isOpen);

  return (
    <motion.aside
      className="fixed left-0 top-0 h-full bg-white p-6 flex flex-col shadow-lg z-[60]"
      animate={{
        width: windowWidth < breakpoints.MOBILE ? (isOpen ? '100%' : 0) : isOpen ? 256 : 64,
      }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      {windowWidth < breakpoints.MOBILE && isOpen && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] w-8 h-8 bg-[#744ce9] hover:bg-[#5d39b3] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
        >
          <FaLongArrowAltLeft size={18} />
        </button>
      )}

      <SidebarHeader isOpen={isOpen} />

      <SidebarNavigation
        links={SIDEBAR_LINKS}
        getLinkStyles={getLinkStyles}
        isOpen={isOpen}
        windowWidth={windowWidth}
        breakpoints={breakpoints}
        onNavClick={onClose}
      />
    </motion.aside>
  );
};

const SidebarHeader = ({ isOpen }) => (
  <motion.div className="flex flex-col items-center mb-8" animate={{ opacity: isOpen ? 1 : 0 }}>
    <h1 className="font-bold text-[#744ce9] text-2xl text-center">
      Особистий
      <br />
      кабінет
    </h1>
    <h2 className="text-[#744ce9] mt-4 text-center">Вітаємо Користувач!</h2>
  </motion.div>
);

const SidebarNavigation = ({
  links,
  getLinkStyles,
  isOpen,
  windowWidth,
  breakpoints,
  onNavClick,
}) => (
  <nav className="flex flex-col justify-between h-full">
    <div className="space-y-4">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={getLinkStyles}
          onClick={() => windowWidth < breakpoints.MOBILE && onNavClick()}
        >
          {windowWidth < breakpoints.MOBILE && isOpen ? (
            <div className="flex flex-col items-center justify-center w-full gap-1">
              {link.icon}
              <motion.span className="text-sm text-center">{link.label}</motion.span>
            </div>
          ) : (
            <div className="flex items-center">
              {link.icon}
              <motion.span
                className="ml-7 whitespace-nowrap overflow-hidden"
                animate={{ opacity: isOpen ? 1 : 0, maxWidth: isOpen ? 200 : 0 }}
              >
                {link.label}
              </motion.span>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
