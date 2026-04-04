import SidePanelMediaItem from '../SidePanelMediaItem';

const SidePanelContent = ({ markerData, showDeleteConfirm, showShareModal, onDeleteMedia }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Координати */}
      <div>
        <h2 className="text-base font-semibold text-gray-500 uppercase mb-2">Координати</h2>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700">Широта: {markerData.lat?.toFixed(6)}</p>
          <p className="text-sm text-gray-700">Довгота: {markerData.lng?.toFixed(6)}</p>
        </div>
      </div>

      {/* Описание */}
      {markerData.description && (
        <div>
          <h3 className="text-base font-semibold text-gray-500 uppercase mb-2">Опис</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{markerData.description}</p>
          </div>
        </div>
      )}

      {/* Теги */}
      {markerData.tags && markerData.tags.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-500 uppercase mb-2">Мітки</h3>
          <div className="flex flex-wrap gap-2">
            {markerData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Медиафайлы (изображения и видео) */}
      {markerData.fileUrls && markerData.fileUrls.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-500 uppercase mb-2">Медіафайли</h3>
          <div className="grid grid-cols-2 gap-3">
            {markerData.fileUrls.map((url, index) => (
              <SidePanelMediaItem
                key={index}
                url={url}
                index={index}
                markerId={markerData._id}
                disabled={showDeleteConfirm || showShareModal}
                onDeleteMedia={onDeleteMedia}
              />
            ))}
          </div>
        </div>
      )}

      {/* Статус приватности */}
      {markerData.private && (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base font-medium text-yellow-800">Приватний маркер</span>
            </div>
          </div>
        </div>
      )}

      {/* Дата создания */}
      {markerData.createdAt && (
        <div>
          <h3 className="text-base font-semibold text-gray-500 uppercase mb-2">Дата створення</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              {new Date(markerData.createdAt).toLocaleString('uk-UA')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanelContent;
