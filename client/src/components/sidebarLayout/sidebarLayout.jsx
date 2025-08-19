import { BiSupport } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { FaRoute } from "react-icons/fa6";
import { FaBullhorn } from 'react-icons/fa';
import { BiLogIn } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { useEffect } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { NavLink } from 'react-router-dom';

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);

  const breakPoint = 768;

  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth < breakPoint){
      setIsSidebarOpen(false);
      setShowToggleButton(true);
      } else {
        setIsSidebarOpen(true);
        setShowToggleButton(false);
      }   
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  const baseLinkStyles = `
    py-2 px-4 rounded-lg flex items-center transition-all duration-200 ease-in-out
  `;

  const activeStyle = ({ isActive }) =>
    isSidebarOpen 
      ? `${baseLinkStyles} ${isActive ? "bg-[#744ce9] text-white" : "text-[#797979] hover:bg-[#744CE9] hover:text-[#ffff]"}`
      : `${baseLinkStyles} text-[#797979] hover:bg-[#744CE9] hover:text-[#ffff]`;

  return (
    <div className="flex min-h-screen bg-[#F3F3F3]">
      <motion.div 
        className="fixed left-0 top-0 h-full bg-white p-6 flex flex-col shadow-lg z-50"
        animate={{ width: isSidebarOpen ? 256 : 64 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {showToggleButton && (
          <motion.button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-4 top-4 z-50 w-8 h-8 bg-[#744ce9] text-white rounded-full flex items-center justify-center shadow-lg"
            animate={{ left: isSidebarOpen ? 256 : 64 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {isSidebarOpen ? <FaLongArrowAltLeft size={18}/> : <FaLongArrowAltRight size={18}/>}
          </motion.button>
        )}
        
        <motion.h1 
          className="text-2xl font-bold mb-8 text-[#744ce9] whitespace-nowrap overflow-hidden"
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Особистий кабінет
        </motion.h1>

        <motion.div 
          className="mb-8 whitespace-nowrap overflow-hidden"
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-[#744ce9]">Вітаємо Користувач!</h2>
        </motion.div>

        <nav className="flex flex-col justify-between h-full">
          <div className="space-y-4">
            <NavLink to="/profile" className={activeStyle}>
              <CgProfile size="27" className="mr-[5px]" /> 
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Профіль
              </motion.span>
            </NavLink>
            <NavLink to="/announcements" className={activeStyle}>
              <FaBullhorn size="25" className="mr-[5px]" /> 
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Оголошення
              </motion.span>
            </NavLink>
            <NavLink to="/routes" className={activeStyle}>
              <FaRoute size="25" className="mr-[5px]" /> 
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Маршрути
              </motion.span>
            </NavLink>
            <NavLink to="/support" className={activeStyle}>
              <BiSupport size="25" className="mr-[5px]" /> 
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Підтримка
              </motion.span>
            </NavLink>
            <NavLink to="/auth" className={activeStyle}>
              <BiLogIn size="25" className="mr-[5px]" /> 
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Авторизація
              </motion.span>
            </NavLink>
          </div>

          <div className="space-y-4">
            <NavLink to="/settings" className={activeStyle}>
              <IoMdSettings size="25" className="mr-[5px]" /> 
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Налаштування
              </motion.span>
            </NavLink>
          </div>
        </nav>
      </motion.div>

      <motion.div 
        animate={{ marginLeft: isSidebarOpen ? 256 : 64 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="flex-1 p-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SidebarLayout;