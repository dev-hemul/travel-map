import { useEffect, useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { toast } from 'react-toastify';

import api from '@/api/api';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = async ({
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = {}) => {
    try {
      setLoading(true);

      const res = await api.get('/admin/users', {
        params: { search, sortBy, sortOrder },
      });

      setUsers(res.data.users || []);
    } catch {
      toast.error('Не вдалося завантажити користувачів');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showUsers) return;

    fetchUsers({
      search: debouncedSearch,
      sortBy,
      sortOrder,
    });
  }, [debouncedSearch, sortBy, sortOrder, showUsers]);

  const handleToggleUsers = () => {
    if (showUsers) {
      setShowUsers(false);
      setUsers([]);
      return;
    }

    setShowUsers(true);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderSortArrow = (field) => {
    if (sortBy !== field) {
      return <FaSort className="inline ml-1 opacity-40" />;
    }

    return sortOrder === "asc"
      ? <FaSortUp className="inline ml-1 text-purple-600" />
      : <FaSortDown className="inline ml-1 text-purple-600" />;
  };

  const ban = async (email) => {
    try {
      await api.post('/admin/ban', { email });
      toast.success('Користувача забанено');

      setUsers((prev) =>
        prev.map((u) =>
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

      setUsers((prev) =>
        prev.map((u) =>
          u.email === email ? { ...u, isBanned: false } : u
        )
      );
    } catch {
      toast.error('Не вдалося розбанити');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Адміністрування</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        <button
          onClick={handleToggleUsers}
          disabled={loading}
          className="px-4 py-2 bg-[#744ce9] text-white rounded"
        >
          {showUsers
            ? 'Сховати список'
            : loading
              ? 'Завантаження...'
              : 'Показати всіх користувачів'}
        </button>

        {showUsers && (
          <input
            type="text"
            placeholder="Знайти по email або username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded w-80"
          />
        )}
      </div>

      {showUsers && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            Натисни на назву колонки, щоб відсортувати
          </p>

          <div className="overflow-auto">
            <table className="w-full border">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th
                    className="p-2 text-left cursor-pointer select-none hover:bg-gray-200"
                    onClick={() => handleSort('email')}
                  >
                    Email {renderSortArrow('email')}
                  </th>

                  <th
                    className="p-2 text-left cursor-pointer select-none hover:bg-gray-200"
                    onClick={() => handleSort('username')}
                  >
                    Username {renderSortArrow('username')}
                  </th>

                  <th
                    className="p-2 text-left cursor-pointer select-none hover:bg-gray-200"
                    onClick={() => handleSort('roles')}
                  >
                    Roles {renderSortArrow('roles')}
                  </th>

                  <th
                    className="p-2 text-left cursor-pointer select-none hover:bg-gray-200"
                    onClick={() => handleSort('provider')}
                  >
                    Provider {renderSortArrow('provider')}
                  </th>

                  <th
                    className="p-2 text-left cursor-pointer select-none hover:bg-gray-200"
                    onClick={() => handleSort('createdAt')}
                  >
                    Зареєстрований {renderSortArrow('createdAt')}
                  </th>

                  <th
                    className="p-2 text-left cursor-pointer select-none hover:bg-gray-200"
                    onClick={() => handleSort('isBanned')}
                  >
                    Статус {renderSortArrow('isBanned')}
                  </th>

                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.username || '-'}</td>
                    <td className="p-2">
                      {Array.isArray(u.roles) ? u.roles.join(', ') : '-'}
                    </td>
                    <td className="p-2">{u.provider || '-'}</td>
                    <td className="p-2">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="p-2">
                      <span
                        className={
                          u.isBanned
                            ? 'text-red-600 font-semibold'
                            : 'text-green-600 font-semibold'
                        }
                      >
                        {u.isBanned ? 'Забанений' : 'Активний'}
                      </span>
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
      )}
    </div>
  );
}