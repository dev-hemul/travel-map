function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}
const gridClass =
  'grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-2 items-center';

export default function UserRow({
  user,
  onBan,
  onUnban,
  onUpdateRole,
  isMobile,
}) {
  const handleToggle = () => {
    if (user.isBanned) {
      onUnban(user.email);
    } else {
      onBan(user.email);
    }
  };

  // картка для адаптиву
  if (isMobile) {
    return (
      <div className="rounded-xl border p-4 shadow-sm bg-white">
        <div className="space-y-2 text-sm">

          <div>
            <b>Email:</b>
            <div className="break-all">{user.email}</div>
          </div>

          <div><b>Username:</b> {user.username || '-'}</div>

          <div className="flex items-center gap-2">
            <b>Role:</b>
            <select
              value={user.roles?.[0] || 'user'}
              onChange={(e) =>
                onUpdateRole(user._id, e.target.value)
              }
              className="border rounded px-2 py-1"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div><b>Provider:</b> {user.provider || '-'}</div>
          <div><b>Дата:</b> {formatDate(user.createdAt)}</div>

          <div className="flex items-center justify-between mt-2">
            <span
              className={
                user.isBanned
                  ? 'text-red-600 font-semibold'
                  : 'text-green-600 font-semibold'
              }
            >
              {user.isBanned ? 'Забанений' : 'Активний'}
            </span>

            <input
              type="checkbox"
              checked={user.isBanned}
              onChange={handleToggle}
              className="h-4 w-4 accent-red-500"
            />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`${gridClass} border-b p-2 text-sm hover:bg-gray-50`}>

      <div className="break-all">{user.email}</div>

      <div>{user.username || '-'}</div>

      <div>
        <select
          value={user.roles?.[0] || 'user'}
          onChange={(e) =>
            onUpdateRole(user._id, e.target.value)
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </div>

      <div>{user.provider || '-'}</div>

      <div>{formatDate(user.createdAt)}</div>

      <div>
        <span
          className={
            user.isBanned
              ? 'text-red-600 font-semibold'
              : 'text-green-600 font-semibold'
          }
        >
          {user.isBanned ? 'Забанений' : 'Активний'}
        </span>
      </div>

      <div>
        <input
          type="checkbox"
          checked={user.isBanned}
          onChange={handleToggle}
          className="h-4 w-4 accent-red-500"
        />
      </div>

    </div>
  );
}