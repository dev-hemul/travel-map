import { BiSupport, BiLogIn } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { FaRoute, FaLongArrowAltLeft, FaLongArrowAltRight, FaBullhorn } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const breakPoint768 = 768;
  const breakPoint1200 = 1200;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > breakPoint1200) {
      setIsSidebarOpen(true);
      setShowToggleButton(false);
    } else if (windowWidth <= breakPoint768) {
      setIsSidebarOpen(false);
      setShowToggleButton(true);
    } else {
      // Для екранів між 768px і 1200px
      setIsSidebarOpen(true);
      setShowToggleButton(true);
    }
  }, [windowWidth]);

  const baseLinkStyles = "py-2 px-4 rounded-lg flex items-center transition-all duration-200 ease-in-out";

  const activeStyle = ({ isActive }) => {
    if (isSidebarOpen) {
      return `${baseLinkStyles} ${
        isActive
          ? "bg-[#744ce9] text-white"
          : "text-[#797979] hover:bg-[#744CE9] hover:text-white"
      }`;
    } else {
      return `${baseLinkStyles} ${
        isActive ? "text-[#744ce9]" : "text-[#797979] hover:text-[#744CE9]"
      } justify-center`;
    }
  };

  const links = [
    { to: "/profile", icon: <CgProfile size={27} />, label: "Профіль" },
    { to: "/announcements", icon: <FaBullhorn size={25} />, label: "Оголошення" },
    { to: "/routes", icon: <FaRoute size={25} />, label: "Маршрути" },
    { to: "/support", icon: <BiSupport size={25} />, label: "Підтримка" },
    { to: "/auth", icon: <BiLogIn size={25} />, label: "Авторизація" },
    { to: "/settings", icon: <IoMdSettings size={25} />, label: "Налаштування" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F3F3F3]">
      {/* Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-full bg-white p-6 flex flex-col shadow-lg z-50"
        animate={{ width: isSidebarOpen ? 256 : 64 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {showToggleButton && (
          <motion.button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 z-50 w-8 h-8 bg-[#744ce9] text-white rounded-full flex items-center justify-center shadow-lg"
            animate={{ left: isSidebarOpen ? 256 : 64 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {isSidebarOpen ? <FaLongArrowAltLeft size={18} /> : <FaLongArrowAltRight size={18} />}
          </motion.button>
        )}

        <motion.h1
          className="text-2xl font-bold mb-8 text-[#744ce9] whitespace-nowrap overflow-hidden h-[10%]"
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Особистий 
          <br />
          кабінет
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
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={activeStyle}>
                <div className="flex items-center">
                  {link.icon} {/* Іконка завжди видно */}
                  <motion.span
                    className="ml-2 whitespace-nowrap overflow-hidden"
                    initial={false}
                    animate={{
                      opacity: isSidebarOpen ? 1 : 0,
                      maxWidth: isSidebarOpen ? 200 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    >
                    {link.label}
                  </motion.span>
                </div>
              </NavLink>
            ))}
          </div>
        </nav>
      </motion.div>

      {/* Контент */}
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
