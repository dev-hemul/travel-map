import { MdDelete } from 'react-icons/md';

const isVideoUrl = url => /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);

const SidePanelMediaItem = ({ url, index, markerId, disabled, onDeleteMedia }) => {
  const isVideo = isVideoUrl(url);

  const openMedia = () => {
    if (!disabled) window.open(url, '_blank');
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-gray-100"
      style={{ minHeight: '120px', maxHeight: '200px' }}
    >
      {isVideo ? (
        <video
          src={url}
          className="h-full w-full cursor-pointer object-contain"
          controls
          preload="metadata"
          onClick={openMedia}
        />
      ) : (
        <img
          src={url}
          alt={`Зображення ${index + 1}`}
          className="h-full w-full cursor-pointer object-contain transition-transform hover:scale-105"
          onClick={openMedia}
        />
      )}

      <button
        type="button"
        title="Видалити медіа"
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700 group-hover:opacity-100"
        onClick={event => {
          event.stopPropagation();
          if (onDeleteMedia) onDeleteMedia(markerId, url);
        }}
        disabled={disabled}
      >
        <MdDelete className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SidePanelMediaItem;
