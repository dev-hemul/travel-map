import { MdDelete } from 'react-icons/md';

const MediaGallery = ({
  media,
  onMediaClick,
  onDeleteMedia,
  deletingMediaUrl,
  isVideoFile,
  markerId,
}) => {
  if (!media || !media.length) return null;

  return (
    <div>
      <h3 className="mb-2 text-base font-semibold uppercase text-gray-500">Медіафайли</h3>

      <div className="grid grid-cols-2 gap-3">
        {media.map((url, index) => {
          const isVideo = isVideoFile(url);
          const isDeletingMedia = deletingMediaUrl === url;

          return (
            <div
              key={`${url}-${index}`}
              className="group relative overflow-hidden rounded-lg bg-gray-100"
              style={{ minHeight: '120px', maxHeight: '200px' }}
            >
              <button
                type="button"
                onClick={() => onMediaClick(url)}
                className="block h-full w-full"
              >
                {isVideo ? (
                  <div className="relative h-full w-full">
                    <video src={url} className="h-full w-full object-contain" />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg text-white shadow-lg">
                        ▶
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`marker-media-${index}`}
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                  />
                )}
              </button>

              <button
                type="button"
                title="Видалити медіа"
                disabled={isDeletingMedia}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={async e => {
                  e.stopPropagation();
                  await onDeleteMedia(markerId, url);
                }}
              >
                {isDeletingMedia ? (
                  <span className="text-xs font-bold leading-none">...</span>
                ) : (
                  <MdDelete className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MediaViewer = ({ url, isVideoFile, onClose }) => {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-full max-w-5xl overflow-hidden rounded-xl bg-black"
        onClick={e => e.stopPropagation()}
      >
        {isVideoFile(url) ? (
          <video src={url} controls autoPlay className="max-h-[85vh] max-w-full" />
        ) : (
          <img src={url} alt="preview" className="max-h-[85vh] max-w-full" />
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
