import { FaLongArrowAltRight } from 'react-icons/fa';

export const MobileMenuButton = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-2 z-70 w-8 h-8 bg-[#744ce9] text-white rounded-full flex items-center justify-center shadow-lg"
    >
      <FaLongArrowAltRight size={16} />
    </button>
  );
};
