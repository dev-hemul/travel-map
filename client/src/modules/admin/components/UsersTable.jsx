import SortComp from './SortComp';
import UserRow from './UserRow';

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'username', label: 'Username' },
  { key: 'roles', label: 'Role' },
  { key: 'provider', label: 'Provider' },
  { key: 'createdAt', label: 'Зареєстрований' },
  { key: 'isBanned', label: 'Статус' },
];

export default function UsersTable({
  users,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onBan,
  onUnban,
  onUpdateRole,
  isMobile
}) {
  return (
    <>
      <p className="mb-2 text-sm text-gray-500">
        Натисни на назву колонки, щоб відсортувати
      </p>

      <div className="hidden md:block overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="border-b bg-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="cursor-pointer select-none p-2 text-left hover:bg-gray-200"
                  onClick={() => onSort(column.key)}
                >
                  {column.label}
                  <SortComp
                    field={column.key}
                    activeField={sortBy}
                    order={sortOrder}
                  />
                </th>
              ))}
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onBan={onBan}
              onUnban={onUnban}
              onUpdateRole={onUpdateRole}
              isMobile={isMobile}
            />
            ))}

            {!users.length && !loading && (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Немає користувачів
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <UserRow
            key={user._id}
            user={user}
            onBan={onBan}
            onUnban={onUnban}
            isMobile={isMobile}
            onUpdateRole={onUpdateRole}
          />
        ))}

        {!users.length && !loading && (
          <li className="p-4 text-center text-gray-500">
            Немає користувачів
          </li>
        )}
      </ul>
    </>
  );
}