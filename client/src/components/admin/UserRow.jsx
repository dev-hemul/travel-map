
function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}

function formatRoles(roles) {
  if (!Array.isArray(roles) || !roles.length) return '-';
  return roles.join(', ');
}

export default function UserRow({ user, onBan, onUnban }) {
  return (
    <tr className="border-b">
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.username || '-'}</td>
      <td className="p-2">{formatRoles(user.roles)}</td>
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
        {user.isBanned ? (
          <button
            onClick={() => onUnban(user.email)}
            className="rounded bg-green-600 px-3 py-1 text-white"
          >
            Розбан
          </button>
        ) : (
          <button
            onClick={() => onBan(user.email)}
            className="rounded bg-red-600 px-3 py-1 text-white"
          >
            Бан
          </button>
        )}
      </td>
    </tr>
  );
}