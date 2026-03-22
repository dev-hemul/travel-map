import { FiUpload, FiTrash } from 'react-icons/fi';

const AvatarSection = ({
  avatarPreview,
  getInitials,
  isEditing,
  triggerFileInput,
  resetAvatar,
  getAvatarSize,
  getAvatarTextSize,
}) => {
  return (
    <div className="flex flex-col items-center justify-start bg-[#F4EFFF] rounded-xl p-4 sm:p-6 shadow-lg">
      <div
        className={`relative group rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md cursor-pointer ${getAvatarSize()}`}
      >
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <span className={`text-[#744ce9] font-semibold ${getAvatarTextSize()}`}>
            {getInitials()}
          </span>
        )}

        {isEditing && (
          <div className="absolute inset-0 bg-[#744ce9b3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-white text-lg sm:text-xl cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-[#5d39b380] transition-all duration-200"
            >
              <FiUpload />
            </button>
            <button
              type="button"
              onClick={resetAvatar}
              className="text-white text-lg sm:text-xl cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-[#5d39b380] transition-all duration-200"
            >
              <FiTrash />
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-2">
        Підтримка: JPG, PNG, WEBP. До 10 МБ
      </p>

      <div className="w-full mt-4 space-y-2 text-center">
        <p className="text-xs sm:text-sm text-gray-400">
          Ваш ID: <span className="font-mono font-medium text-gray-600">22222</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-400">
          Дата створення: <span className="text-gray-600">20.01.1999</span>
        </p>
      </div>
    </div>
  );
};

export default AvatarSection;
