import { Outlet, Link, NavLink} from 'react-router-dom';
import { IoMdSettings } from "react-icons/io";
import { FaRoute } from "react-icons/fa6";
import { FaBullhorn } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { RiLogoutBoxLine } from "react-icons/ri"
import { BiSupport } from "react-icons/bi";



const SidebarLayout = () => {
  const activeStyle = ({isActive}) => isActive ? "bg-indigo-600" : "bg-none";


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Особистий кабінет</h1>
        
        <div className="mb-8">
          <p className="text-indigo-200">Вітаємо</p>
          <p className="text-xl font-semibold">Андрій Стегній!</p>
        </div>
        
        <nav className="space-y-4 [&>a]:py-2 [&>a]:px-4 [&>a]:rounded-lg [&>a]:transition-all [&>a]:duration-200 [&>a]:ease-in-out [&>a]:flex [&>a]:items-center [&>a:hover]:bg-indigo-600">
            <NavLink to="/profile" className={activeStyle}><CgProfile size="25" className="mr-[5px]" /> Профіль</NavLink>
            <NavLink to="/announcements" className={activeStyle}><FaBullhorn size="25" className="mr-[5px]" /> Оголошення</NavLink>
            <NavLink to="/routes" className={activeStyle}><FaRoute size="25" className="mr-[5px]" /> Маршрути</NavLink>
            <NavLink to="/support" className={activeStyle}><BiSupport size="25" className="mr-[5px]" /> Підтримка</NavLink>
            <NavLink to="/settings" className={activeStyle}><IoMdSettings size="25" className="mr-[5px]" /> Налаштування</NavLink>
            <NavLink to="/logout" className="text-red-300 hover:bg-red-600"><RiLogoutBoxLine size="25" className="mr-[5px]" /> Вихід</NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;