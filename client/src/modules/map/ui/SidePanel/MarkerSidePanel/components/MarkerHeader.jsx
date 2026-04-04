import { MdClose } from 'react-icons/md';

const MarkerHeader = ({ isEditing, editForm, setEditForm, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {!isEditing ? (
            <>
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="truncate text-2xl font-bold">
                  {editForm.title || 'Маркер без назви'}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block rounded-full border border-blue-500 bg-blue-800/80 px-3 py-1 text-sm font-medium text-white">
                  {editForm.category || 'Без категорії'}
                </span>
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white">
                  {editForm.private ? 'Приватний' : 'Публічний'}
                </span>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.title}
                onChange={e =>
                  setEditForm(prev => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none placeholder:text-white/70 focus:border-white/50"
                placeholder="Введіть назву"
              />

              <input
                type="text"
                value={editForm.category}
                onChange={e =>
                  setEditForm(prev => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/70 focus:border-white/50"
                placeholder="Введіть категорію"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 cursor-pointer p-1 text-white transition-colors hover:text-gray-200"
        >
          <MdClose className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default MarkerHeader;
