function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}

export default function UserRow({ user, onBan, onUnban, onUpdateRole, isMobile }) {
  const handleToggle = () => {
    if (user.isBanned) {
      onUnban(user.email);
    } else {
      onBan(user.email);
    }
  };

  const handleRoleChange = (e) => {
    onUpdateRole(user._id, e.target.value);
  };

  // адаптив
if (isMobile) {
  return (
    <li className="rounded border p-3 shadow-sm">
      <div className="text-sm space-y-1">
        <div><b>Email:</b> {user.email}</div>
        <div><b>Username:</b> {user.username || '-'}</div>
        <div className="flex items-center gap-2">
          <b>Role:</b>

          <select
            value={user.roles?.[0] || 'user'}
            onChange={(e) => {
              onUpdateRole(user._id, e.target.value);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <div><b>Provider:</b> {user.provider || '-'}</div>
        <div><b>Дата:</b> {formatDate(user.createdAt)}</div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={user.isBanned}
            onChange={handleToggle}
            className="h-4 w-4 accent-red-500"
          />

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
      </div>
    </li>
  );
}

  // десктоп
  return (
    <tr className="border-b">
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.username || '-'}</td>

      {/*ролі*/}
      <td className="p-2">
        <select
          value={user.roles?.[0] || 'user'}
          onChange={handleRoleChange}
          className="border rounded px-2 py-1"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </td>

      <td className="p-2">{user.provider || '-'}</td>
      <td className="p-2">{formatDate(user.createdAt)}</td>

      <td className="p-2">
        <span
          className={
            user.isBanned
              ? 'font-semibold text-red-600'
              : 'font-semibold text-green-600'
          }
        >
          {user.isBanned ? 'Забанений' : 'Активний'}
        </span>
      </td>

      <td className="p-2">
        <input
          type="checkbox"
          checked={user.isBanned}
          onChange={handleToggle}
          className="h-4 w-4 cursor-pointer accent-red-500"
        />
      </td>
    </tr>
  );
}