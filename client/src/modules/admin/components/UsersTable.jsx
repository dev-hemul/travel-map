import { useEffect, useState } from 'react';

import SortComp from './SortComp';
import UserRow from './UserRow';

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'username', label: 'Username' },
  { key: 'roles', label: 'Role' },
  { key: 'provider', label: 'Provider' },
  { key: 'createdAt', label: 'Дата' },
  { key: 'isBanned', label: 'Статус' },
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
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 📱 MOBILE
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

  // 💻 DESKTOP
  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-2 items-center border-b bg-gray-100 p-2 text-base font-semibold">
        {columns.map((col) => (
          <div
            key={col.key}
            className="cursor-pointer flex items-center"
            onClick={() => col.key !== 'action' && onSort(col.key)}
          >
            {col.label}

            {col.key !== 'action' && (
              <SortComp
                field={col.key}
                activeField={sortBy}
                order={sortOrder}
              />
            )}
          </div>
        ))}
      </div>

      {/* BODY */}
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
          />
        ))}
      </div>

    </div>
  );
}