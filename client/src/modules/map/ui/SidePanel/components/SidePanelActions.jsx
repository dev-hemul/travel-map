import { MdShare } from 'react-icons/md';

const SidePanelActions = ({ onEdit, onShare, disabled }) => {
  return (
    <div className="p-6 pt-4 border-t border-gray-200">
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 bg-[#744ce9] border-0 hover:bg-[#5d39b3] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          disabled={disabled}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Редагувати
        </button>
        <button
          onClick={onShare}
          className="flex-1 bg-[#744ce9] border-0 hover:hover:bg-[#5d39b3] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          disabled={disabled}
        >
          <MdShare className="w-4 h-4 mr-2" />
          Поділитися
        </button>
      </div>
    </div>
  );
};

export default SidePanelActions;
