import { useState } from 'react';
import { MdClose } from 'react-icons/md';

const isVideoFile = url => {
  if (!url) return false;

  return /\.(mp4|mov|webm|ogg)(\?.*)?$/i.test(url);
};

const FilePreviewItem = ({ url, index, file, onRemoveFile, isUploading }) => {
  const isVideo = file?.type?.startsWith('video/') || isVideoFile(url);

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative aspect-square bg-gray-100">
        {typeof onRemoveFile === 'function' && !isUploading && (
          <button
            type="button"
            onClick={() => onRemoveFile(index)}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Видалити файл"
          >
            <MdClose className="h-4 w-4" />
          </button>
        )}

        {isVideo ? (
          <>
            <video
              src={url}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-xs font-semibold text-white">
              Відео
            </div>
          </>
        ) : (
          <img src={url} alt={`preview-${index}`} className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
};

const FileUploadField = ({ files, fileUrls, onFilesChange, onRemoveFile, isUploading = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFilesSelect = fileList => {
    onFilesChange(Array.from(fileList || []));
  };

  const handleDragOver = event => {
    event.preventDefault();
    if (isUploading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = event => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = event => {
    event.preventDefault();
    if (isUploading) return;
    setIsDragOver(false);
    handleFilesSelect(event.dataTransfer.files);
  };

  const rootClassName = `rounded-xl border-2 border-dashed transition-all ${
    isUploading
      ? 'cursor-wait border-blue-400 bg-blue-50/80 text-blue-700 opacity-80'
      : isDragOver
        ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
        : files.length > 0
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
  }`;

  const titleClassName = `text-sm font-medium ${
    isUploading
      ? 'text-blue-700'
      : isDragOver
        ? 'text-violet-700'
        : files.length > 0
          ? 'text-blue-700'
          : 'text-gray-600'
  }`;

  const titleText = isUploading
    ? 'Завантаження файлів...'
    : files.length > 0
      ? `Вибрано файлів: ${files.length}`
      : isDragOver
        ? 'Відпустіть файли тут'
        : 'Натисніть або перетягніть файли';

  const iconColorClass = isDragOver
    ? 'text-violet-500'
    : files.length > 0
      ? 'text-blue-500'
      : 'text-gray-400';

  return (
    <div className="pt-1">
      <label className="mb-1.5 inline-block text-sm font-semibold uppercase text-gray-500">
        ЗОБРАЖЕННЯ/ВІДЕО
      </label>

      <input
        type="file"
        name="files"
        id="fileInput"
        disabled={isUploading}
        onChange={e => handleFilesSelect(e.target.files)}
        className="hidden"
        accept="image/*,video/*,.webp,image/webp"
        multiple
      />

      <div
        className={rootClassName}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label
          htmlFor="fileInput"
          className={`flex w-full items-center justify-center px-4 py-5 ${
            isUploading ? 'cursor-wait' : 'cursor-pointer'
          }`}
        >
          <div className="flex items-center">
            {isUploading ? (
              <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`mr-3 h-6 w-6 ${iconColorClass}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}

            <div className="flex flex-col items-start">
              <span className={titleClassName}>{titleText}</span>
              <span className="mt-0.5 text-xs text-gray-500">
                Підтримуються зображення та відео
              </span>
            </div>
          </div>
        </label>
      </div>

      {!!fileUrls.length && (
        <div className="mt-4">
          <div className="mb-1.5 text-xs font-semibold uppercase text-gray-500">
            Попередній перегляд
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {fileUrls.map((url, index) => (
              <FilePreviewItem
                key={`${url}-${index}`}
                url={url}
                index={index}
                file={files[index]}
                onRemoveFile={onRemoveFile}
                isUploading={isUploading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
