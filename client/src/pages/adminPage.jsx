import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import api from '@/api/api';
import AdminToolbar from '@/components/admin/AdminToolbar';
import UsersTable from '@/components/admin/UsersTable';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = async ({ search = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}) => {
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

  const handleSort = field => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(field);
    setSortOrder('asc');
  };

  const handleBan = async email => {
    try {
      await api.post('/admin/ban', { email });
      toast.success('Користувача забанено');

      setUsers(prev =>
        prev.map(user => (user.email === email ? { ...user, isBanned: true } : user))
      );
    } catch {
      toast.error('Не вдалося забанити');
    }
  };

  const handleUnban = async email => {
    try {
      await api.post('/admin/unban', { email });
      toast.success('Користувача розбанено');

      setUsers(prev =>
        prev.map(user => (user.email === email ? { ...user, isBanned: false } : user))
      );
    } catch {
      toast.error('Не вдалося розбанити');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Адміністрування111</h1>

      <AdminToolbar
        showUsers={showUsers}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onToggleUsers={handleToggleUsers}
      />

      {showUsers && (
        <UsersTable
          users={users}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onBan={handleBan}
          onUnban={handleUnban}
        />
      )}
    </div>
  );
}
