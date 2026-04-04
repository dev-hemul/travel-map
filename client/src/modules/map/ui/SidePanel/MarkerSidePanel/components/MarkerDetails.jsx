const MarkerDetails = ({ marker, isEditing, editForm, setEditForm }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-base font-semibold uppercase text-gray-500">Координати</h3>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-700">Широта: {marker.lat?.toFixed?.(6) ?? marker.lat}</p>
          <p className="text-sm text-gray-700">Довгота: {marker.lng?.toFixed?.(6) ?? marker.lng}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold uppercase text-gray-500">Опис</h3>
        {!isEditing ? (
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="leading-relaxed text-gray-700">{editForm.description || '—'}</p>
          </div>
        ) : (
          <textarea
            value={editForm.description}
            onChange={e =>
              setEditForm(prev => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500"
            placeholder="Введіть опис"
          />
        )}
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold uppercase text-gray-500">Мітки</h3>
        {!isEditing ? (
          editForm.tags ? (
            <div className="flex flex-wrap gap-2">
              {editForm.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)
                .map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-3 text-gray-700">—</div>
          )
        ) : (
          <input
            type="text"
            value={editForm.tags}
            onChange={e =>
              setEditForm(prev => ({
                ...prev,
                tags: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500"
            placeholder="Наприклад: travel, city, food"
          />
        )}
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold uppercase text-gray-500">Приватність</h3>
        {!isEditing ? (
          <div className="rounded-lg bg-gray-50 p-3 text-gray-700">
            {editForm.private ? 'Приватний маркер' : 'Публічний маркер'}
          </div>
        ) : (
          <label className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-900">
            <input
              type="checkbox"
              checked={editForm.private}
              onChange={e =>
                setEditForm(prev => ({
                  ...prev,
                  private: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            Приватний маркер
          </label>
        )}
      </div>
    </div>
  );
};

export default MarkerDetails;
