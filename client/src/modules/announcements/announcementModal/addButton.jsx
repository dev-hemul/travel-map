import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const AddButton = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
      <button
        onClick={() => navigate('/create-announcement')}
        className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-white shadow-md active:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 active:from-blue-700 active:to-indigo-800"
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <FaPlus className="text-xs sm:text-sm" />
        Додати нову пропозицію
      </button>
    </div>
  );
};

export default AddButton;
