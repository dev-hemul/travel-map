import { Outlet, Link } from 'react-router-dom';
import { CiSettings } from "react-icons/ci";
import { FaRoute } from "react-icons/fa6";
import { FaBullhorn } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { RiLogoutBoxLine } from "react-icons/ri"
import { MdSupportAgent } from "react-icons/md";

const SidebarLayout = () => {
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
            <Link to="/profile" className="bg-indigo-600"><CgProfile size="25" className="mr-[5px]" /> Профіль</Link>
            <Link to="/announcements"><FaBullhorn size="25" className="mr-[5px]" /> Оголошення</Link>
            <Link to="/routes"><FaRoute size="25" className="mr-[5px]" /> Маршрути</Link>
            <Link to="/support"><MdSupportAgent size="25" className="mr-[5px]" /> Підтримка</Link>
            <Link to="/settings"><CiSettings size="25" className="mr-[5px]" /> Налаштування</Link>
            <Link to="/logout" className="text-red-300 hover:bg-red-600"><RiLogoutBoxLine size="25" className="mr-[5px]" /> Вихід</Link>
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