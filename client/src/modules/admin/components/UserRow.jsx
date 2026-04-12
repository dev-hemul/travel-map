function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}

export default function UserRow({
  user,
  onBan,
  onUnban,
  onUpdateRole,
  onUpdateStatus,
  isMobile,
}) {
  const handleToggle = () => {
    if (user.isBanned) {
      onUnban(user.email);
    } else {
      onBan(user.email);
    }
  };

  // тлф
  if (isMobile) {
    return (
      <div className="rounded-xl border p-4 shadow-sm bg-white">
        <div className="space-y-3 text-base">

          <div>
            <b>Пошта:</b>
            <div className="break-all">{user.email}</div>
          </div>

          <div className="flex items-center gap-2">
            <b>Статус:</b>
            <select
              value={user.statuses?.[0] || 'Учасник клубу'}
              onChange={(e) =>
                onUpdateStatus(user._id, e.target.value)
              }
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="Учасник клубу">Учасник клубу</option>
              <option value="Шляхотворець">Шляхотворець</option>
              <option value="Власник садиби">Власник садиби</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <b>Role:</b>
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
      </div>
    );
  }

  // десктоп
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-2 items-center border-b p-2 text-base hover:bg-gray-50">

      <div className="break-all">{user.email}</div>

        <div>
        <select
          value={user.statuses?.[0] || 'Учасник клубу'}
          onChange={(e) =>
            onUpdateStatus(user._id, e.target.value)
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="Учасник клубу">Учасник клубу</option>
          <option value="Шляхотворець">Шляхотворець</option>
          <option value="Власник садиби">Власник садиби</option>
        </select>
      </div>

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