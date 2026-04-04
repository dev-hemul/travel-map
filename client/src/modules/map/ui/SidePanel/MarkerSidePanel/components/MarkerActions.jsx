import { MdDelete } from 'react-icons/md';

const MarkerActions = ({
  isEditing,
  setIsEditing,
  isDeleteConfirm,
  setIsDeleteConfirm,
  isDeleting,
  isSaving,
  onDelete,
  onSave,
  onCancelEdit,
  setShowShareModal,
  deleteError,
  saveError,
  mediaDeleteError,
}) => {
  return (
    <div className="space-y-4">
      {!isEditing ? (
        <>
          {!isDeleteConfirm ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex flex-1 items-center justify-center rounded-lg border-0 bg-[#744ce9] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#5d39b3]"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                type="button"
                onClick={() => {
                  setIsDeleteConfirm(true);
                }}
                className="flex flex-1 items-center justify-center rounded-lg border-0 bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
              >
                <MdDelete className="mr-2 h-4 w-4" />
                Видалити
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowShareModal(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 font-semibold text-violet-700 transition-all hover:bg-violet-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18 16a3 3 0 00-2.4 1.2l-6.4-3.2a3.3 3.3 0 000-1.9l6.3-3.2A3 3 0 1015 7a3.3 3.3 0 00.1.8l-6.3 3.2a3 3 0 100 5.9l6.4 3.2A3 3 0 1018 16z" />
                </svg>
                Поділитися
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Видалити маркер?</h3>
              <p className="mb-4 text-sm text-gray-600">
                Ця дія незворотна. Маркер буде видалено назавжди.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteConfirm(false)}
                  className="flex-1 rounded-lg border-0 bg-[#E0E0E0] px-4 py-2 font-semibold text-black transition-colors hover:bg-[#CCCCCC] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={onDelete}
                  className="flex-1 rounded-lg border-0 bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? 'Видалення...' : 'Видалити'}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="flex-1 rounded-lg border-0 bg-[#744ce9] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#5d39b3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Збереження...' : 'Зберегти'}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onCancelEdit}
            className="flex-1 rounded-lg border-0 bg-[#E0E0E0] px-4 py-2 font-semibold text-black transition-colors hover:bg-[#CCCCCC] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Скасувати
          </button>
        </div>
      )}

      {(deleteError || saveError || mediaDeleteError) && (
        <div className="space-y-2">
          {deleteError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          )}
          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {saveError}
            </div>
          )}
          {mediaDeleteError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {mediaDeleteError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkerActions;
