import { BiSolidNavigation } from 'react-icons/bi';

const LocateMeButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-300"
    >
      <BiSolidNavigation className="text-3xl text-gray-700" />
    </button>
  );
};

export default LocateMeButton;
