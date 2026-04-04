import { MdDelete, MdClose } from 'react-icons/md';

const SidePanelHeader = ({
  title,
  category,
  getCategoryDisplayName,
  onDeleteClick,
  onClose,
  disabled,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{title || 'Маркер без назви'}</h2>
            <button
              onClick={onDeleteClick}
              className="text-white hover:text-red-300 transition-colors p-1 ml-2 cursor-pointer"
              title="Видалити маркер"
              disabled={disabled}
            >
              <MdDelete className="w-5 h-5" />
            </button>
          </div>
          {category && (
            <span className="inline-block bg-blue-800 bg-opacity-80 px-3 py-1 rounded-full text-base font-medium text-white border border-blue-500">
              {getCategoryDisplayName(category)}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors p-1 flex-shrink-0 cursor-pointer"
          disabled={disabled}
        >
          <MdClose className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SidePanelHeader;
