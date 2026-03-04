export default function AdminToolbar({
  showUsers,
  loading,
  search,
  onSearchChange,
  onToggleUsers,
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <button
        onClick={onToggleUsers}
        disabled={loading}
        className="rounded bg-[#744ce9] px-4 py-2 text-white"
      >
        {showUsers
          ? 'Сховати список'
          : loading
            ? 'Завантаження...'
            : 'Показати всіх користувачів'}
      </button>

      {showUsers && (
        <input
          type="text"
          placeholder="Знайти по email або username..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-80 rounded border px-3 py-2"
        />
      )}
    </div>
  );
}