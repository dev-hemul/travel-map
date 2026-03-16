import SortComp from './SortComp';
import UserRow from './UserRow';

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'username', label: 'Username' },
  { key: 'roles', label: 'Roles' },
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
}) {
  return (
    <>
      <p className="mb-2 text-sm text-gray-500">
        Натисни на назву колонки, щоб відсортувати
      </p>

      <div className="overflow-auto">
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
    </>
  );
}