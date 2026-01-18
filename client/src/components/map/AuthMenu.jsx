import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AuthMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg
                  hover:bg-gray-100 transition-all duration-300 z-20 relative"
        onClick={() => navigate('/login')}
      >
        <FaUser className="text-2xl text-gray-700" />
      </button>
    </div>
  );
};

export default AuthMenu;
