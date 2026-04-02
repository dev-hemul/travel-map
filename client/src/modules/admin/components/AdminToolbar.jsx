import { useEffect, useState } from 'react';

export default function AdminToolbar({
  showUsers,
  loading,
  search,
  onSearchChange,
  onToggleUsers,
  sortBy,
  sortOrder,
  onSortChange,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mb-4 flex flex-wrap gap-4 items-center">
      <button
        onClick={onToggleUsers}
        disabled={loading}
        className="rounded bg-[#744ce9] px-4 py-2 text-white"
      >
        {showUsers
          ? 'Сховати список'
          : loading
          ? 'Завантаження...'
          : 'Показати користувачів'}
      </button>

      {showUsers && (
        <>
          <input
            type="text"
            placeholder="Знайти..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-60 rounded border px-3 py-2"
          />

          {/*адаптив*/}
          {isMobile && (
            <>
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value, sortOrder)
                }
                className="rounded border px-3 py-2"
              >
                <option value="createdAt">Дата</option>
                <option value="email">Email</option>
                <option value="username">Username</option>
                <option value="provider">Provider</option>
                <option value="roles">Role</option>
                <option value="isBanned">Статус</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) =>
                  onSortChange(sortBy, e.target.value)
                }
                className="rounded border px-3 py-2"
              >
                <option value="asc">⬆ ASC</option>
                <option value="desc">⬇ DESC</option>
              </select>
            </>
          )}
        </>
      )}
    </div>
  );
}