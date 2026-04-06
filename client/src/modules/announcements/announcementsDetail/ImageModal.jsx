import { FiX } from 'react-icons/fi';

export const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-[90vh]">
        <img
          src={image}
          alt="Велике зображення"
          className="max-w-full max-h-[80vh] object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
        >
          <FiX size={24} />
        </button>
      </div>
    </div>
  );
};
