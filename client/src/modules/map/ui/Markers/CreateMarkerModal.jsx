import { useState, useEffect } from 'react';

import CategoryField from './CreateMarkerModal/CategoryField';
import FileUploadField from './CreateMarkerModal/FileUploadField';
import ModalActions from './CreateMarkerModal/ModalActions';
import ModalHeader from './CreateMarkerModal/ModalHeader';
import PrivateToggle from './CreateMarkerModal/PrivateToggle';

const CreateMarkerModal = ({
  open,
  marker,
  formData,
  options,
  selectedOption,
  onFormChange,
  onCategoryChange,
  onCreateCategory,
  onTagsChange,
  onPrivateChange,
  onFilesChange,
  onSubmit,
  onClose,
  loading,
  onRemoveFile,
  error,
}) => {
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (open) {
      setTagsInput(formData.tags.join(', '));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || !marker) return null;

  const handleTagsInputChange = e => {
    const value = e.target.value;
    setTagsInput(value);

    const tagsArray = value
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    onTagsChange(tagsArray);
  };

  return (
    <div className="fixed inset-0 z-[1000] p-0 md:p-4">
      <div className="absolute inset-0 bg-black/30 md:bg-transparent" onClick={onClose} />

      <div
        className="
          absolute inset-0 md:inset-auto
          md:absolute md:left-1/2 md:top-1/2 md:w-11/12 md:max-w-[450px]
          md:-translate-x-1/2 md:-translate-y-1/2
          z-[1000]
          h-full w-full min-w-full md:h-auto md:max-h-[90vh] md:min-w-0
          rounded-none border-0 bg-gradient-to-br from-white to-gray-50
          shadow-none
          md:rounded-2xl md:border md:border-gray-100 md:shadow-xl
        "
      >
        <ModalHeader />
        <form
          onSubmit={onSubmit}
          className="custom-scrollbar h-[calc(100vh-140px)] overflow-y-auto p-5 pt-8 md:h-auto md:max-h-[75vh] md:pt-3"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 inline-block text-sm font-semibold uppercase text-gray-500">
                Назва
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onFormChange}
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-200 hover:border-[#9ca3af] focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-50 sm:text-base"
                placeholder="Введіть назву маркера"
                required
                disabled={loading}
              />
            </div>

            <div>
              <CategoryField
                options={options}
                selectedOption={selectedOption}
                onCategoryChange={onCategoryChange}
                onCreateCategory={onCreateCategory}
                loading={loading}
              />
            </div>

            <div>
              <label className="mb-1.5 inline-block text-sm font-semibold uppercase text-gray-500">
                Мітки
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsInputChange}
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-200 hover:border-[#9ca3af] focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-50 sm:text-base"
                placeholder="Наприклад: море, пляж, sunset"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">Вводь теги мітки кому</p>
            </div>

            <PrivateToggle value={formData.private} onChange={onPrivateChange} disabled={loading} />

            <FileUploadField
              files={formData.files}
              fileUrls={formData.fileUrls}
              onFilesChange={onFilesChange}
              isUploading={loading}
              onRemoveFile={onRemoveFile}
            />

            <div>
              <label className="mb-1.5 inline-block text-sm font-semibold uppercase text-gray-500">
                Опис
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onFormChange}
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none placeholder-gray-400 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50"
                placeholder="Уведіть опис (необов'язково)"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 text-center text-sm font-medium text-red-500">{error}</div>
          )}

          <ModalActions onClose={onClose} loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default CreateMarkerModal;
