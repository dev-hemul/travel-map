import { BiSupport } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { FaRoute } from "react-icons/fa6";
import { FaBullhorn, FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const breakPointMobile = 768;
  const breakPointTablet = 1200;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if(window.innerWidth < breakPointMobile){
        setIsSidebarOpen(false);
        setShowToggleButton(true);
      } else if(window.innerWidth < breakPointTablet){
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
  }, []);

  const baseLinkStyles = `
    py-2 px-4 rounded-lg flex items-center transition-all duration-200 ease-in-out
  `;

  const activeStyle = ({ isActive }) =>
    `${baseLinkStyles} ${isActive ? "bg-[#744ce9] text-white" : "text-[#797979] hover:bg-[#744CE9] hover:text-[#ffff]"}`;

  // Ширина сайдбару залежно від стану
  let sidebarWidth = 256;
  if(windowWidth < breakPointMobile) sidebarWidth = 0;
  else if(windowWidth < breakPointTablet && !isSidebarOpen) sidebarWidth = 64;

  return (
    <div className="flex min-h-screen bg-[#F3F3F3]">
      <motion.div
        className="fixed left-0 top-0 h-full bg-white p-6 flex flex-col shadow-lg overflow-hidden"
        animate={{ width: isSidebarOpen ? 256 : sidebarWidth }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {(showToggleButton || windowWidth > breakPointTablet) && (
          <motion.button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-64 z-50 w-8 h-8 bg-[#744ce9] text-white rounded-full flex items-center justify-center shadow-lg"
            animate={{ left: isSidebarOpen ? 256 : 15 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {isSidebarOpen ? <FaLongArrowAltLeft /> : <FaLongArrowAltRight />}
          </motion.button>
        )}

        {isSidebarOpen && windowWidth > breakPointTablet && (
          <>
            <h1 className="text-2xl font-bold mb-8 text-[#744ce9]">Особистий кабінет</h1>
            <div className="mb-8">
              <p className="text-[#744ce9]">Вітаємо</p>
              <p className="text-xl text-[#744ce9] font-semibold">Користувач!</p>
            </div>
          </>
        )}

        {isSidebarOpen && (
          <nav className="flex flex-col justify-between h-full">
            <div className="space-y-4">
              <NavLink to="/profile" className={activeStyle}>
                <CgProfile size="27" className="mr-[5px]" /> {isSidebarOpen && windowWidth > breakPointTablet && "Профіль"}
              </NavLink>
              <NavLink to="/announcements" className={activeStyle}>
                <FaBullhorn size="25" className="mr-[5px]" /> {isSidebarOpen && windowWidth > breakPointTablet && "Оголошення"}
              </NavLink>
              <NavLink to="/routes" className={activeStyle}>
                <FaRoute size="25" className="mr-[5px]" /> {isSidebarOpen && windowWidth > breakPointTablet && "Маршрути"}
              </NavLink>
              <NavLink to="/support" className={activeStyle}>
                <BiSupport size="25" className="mr-[5px]" /> {isSidebarOpen && windowWidth > breakPointTablet && "Підтримка"}
              </NavLink>
              <NavLink to="/auth" className={activeStyle}>
                <BiLogIn size="25" className="mr-[5px]" /> {isSidebarOpen && windowWidth > breakPointTablet && "Авторизація"}
              </NavLink>
            </div>
            <div className="space-y-4">
              <NavLink to="/settings" className={activeStyle}>
                <IoMdSettings size="25" className="mr-[5px]" /> {isSidebarOpen && windowWidth > breakPointTablet && "Налаштування"}
              </NavLink>
            </div>
          </nav>
        )}
      </motion.div>

      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ type: "tween", duration: 0.3 }}
        className="flex-1 p-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SidebarLayout;
