import { useEffect, useState } from 'react';

import SortComp from './SortComp';
import UserRow from './UserRow';


const columns = [
  { key: 'email', label: 'Пошта' }, 
  { key: 'status', label: 'Статус', noSort: true },   // ← додаємо noSort: true
  { key: 'roles', label: 'Роль'},
  { key: 'provider', label: 'Провайдер' },
  { key: 'createdAt', label: 'Дата' },
  { key: 'isBanned', label: 'Бан' },
  { key: 'action', label: 'Дія' },
];

export default function UsersTable({
  users,
  sortBy,
  sortOrder,
  onSort,
  onBan,
  onUnban,
  onUpdateRole,
  onUpdateStatus
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <UserRow
            key={user._id}
            user={user}
            onBan={onBan}
            onUnban={onUnban}
            onUpdateRole={onUpdateRole}
            onUpdateStatus={onUpdateStatus}
            isMobile
          />
        ))}

        {!users.length && (
          <p className="text-center text-gray-500 text-base">
            Немає користувачів
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">   {/* центрування */}

      {/* HEADER */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-2 items-center border-b bg-white p-2 text-base font-semibold">
        {columns.map((col) => (
          <div
            key={col.key}
            className={`flex items-center ${col.noSort ? '' : 'cursor-pointer'}`}
            onClick={() => !col.noSort && onSort(col.key)}   // ← сортуємо тільки якщо !noSort
          >
            {col.label}

            {!col.noSort && (
              <SortComp
                field={col.key}
                activeField={sortBy}
                order={sortOrder}
              />
            )}
          </div>
        ))}
      </div>

      {!users.length && (
        <div className="p-4 text-center text-gray-500 text-base">
          Немає користувачів
        </div>
      )}

      <div>
        {users.map((user) => (
          <UserRow
            key={user._id}
            user={user}
            onBan={onBan}
            onUnban={onUnban}
            onUpdateRole={onUpdateRole}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}