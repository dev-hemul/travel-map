import { useEffect, useState } from 'react';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

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

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

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

          {/* адаптив тлф */}
          {isMobile && (
            <div className="flex items-center gap-2">

              {/* поле сортування */}
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value, sortOrder)
                }
                className="rounded border px-3 py-2"
              >
                <option value="createdAt">Дата</option>
                <option value="email">Пошта</option>
                <option value="status">Статус</option>
                <option value="provider">Провайдер</option>
                <option value="roles">Роль</option>
                <option value="isBanned">Бан</option>
              </select>
                
              <button
                onClick={toggleSortOrder}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#744ce9] text-white hover:bg-[#5d39b3] transition"
              >
                {sortOrder === 'asc' ? (
                  <FaSortAmountUp size={20} />
                ) : (
                  <FaSortAmountDown size={20} />
                )}
              </button>

            </div>
          )}
        </>
      )}
    </div>
  );
}