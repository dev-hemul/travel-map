import { useState } from 'react';
import { toast } from 'react-toastify';

import api from '@/api/api';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch {
      toast.error('Не вдалося завантажити користувачів');
    } finally {
      setLoading(false);
    }
  };

  const ban = async (email) => {
    try {
      await api.post('/admin/ban', { email });
      toast.success('Користувача забанено');

      setUsers(prev =>
        prev.map(u =>
          u.email === email ? { ...u, isBanned: true } : u
        )
      );
    } catch {
      toast.error('Не вдалося забанити');
    }
  };

  const unban = async (email) => {
    try {
      await api.post('/admin/unban', { email });
      toast.success('Користувача розбанено');

      setUsers(prev =>
        prev.map(u =>
          u.email === email ? { ...u, isBanned: false } : u
        )
      );
    } catch {
      toast.error('Не вдалося розбанити');
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Адміністрування</h1>

      {/* Кнопка завантаження */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={loadUsers}
          disabled={loading}
          className="px-4 py-2 bg-[#744ce9] text-white rounded"
        >
          {loading ? 'Завантаження...' : 'Показати всіх користувачів'}
        </button>

        <input
          type="text"
          placeholder="Знайти по email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-80"
        />
      </div>

      {/* Таблиця */}
      <div className="overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Roles</th>
              <th className="p-2 text-left">Ban</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.username || '-'}</td>
                <td className="p-2">
                  {Array.isArray(u.roles) ? u.roles.join(', ') : '-'}
                </td>
                <td className="p-2">
                  {u.isBanned ? '✅' : '—'}
                </td>
                <td className="p-2">
                  {u.isBanned ? (
                    <button
                      onClick={() => unban(u.email)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Розбан
                    </button>
                  ) : (
                    <button
                      onClick={() => ban(u.email)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Бан
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {!filteredUsers.length && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Немає користувачів
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}