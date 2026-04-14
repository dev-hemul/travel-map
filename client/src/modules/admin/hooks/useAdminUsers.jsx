import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useDebounce } from '../../../hooks/useDebounce.jsx';
import apiAdmin from '../api/apiAdmin';

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (!showUsers) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await apiAdmin.get('/users', {
          params: {
            search: debouncedSearch,
            sortBy,
            sortOrder,
            page,
          },
        });

        setUsers(res.data.users || []);
        setPages(res.data.pages || 1);
      } catch (e) {
        console.error(e);
        toast.error('Не вдалося завантажити користувачів');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch, sortBy, sortOrder, showUsers, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortOrder]);

  const toggleUsers = () => {
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

  const banUser = async (email) => {
    try {
      await apiAdmin.post('/ban', { email });

      setUsers((prev) =>
        prev.map((u) =>
          u.email === email ? { ...u, isBanned: true } : u
        )
      );
        setTimeout(() => {
          toast.success('Користувача забанено');
        }, 0);
    } catch {
      toast.error('Не вдалося забанити');
    }
  };

  const unbanUser = async (email) => {
    try {
      await apiAdmin.post('/unban', { email });

      setUsers((prev) =>
        prev.map((u) =>
          u.email === email ? { ...u, isBanned: false } : u
        )
      );
      setTimeout(() => {
        toast.success('Користувача розбанено');
      }, 0);
    } catch {
      toast.error('Не вдалося розбанити');
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await apiAdmin.post('/role', { userId, role });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, roles: [role] } : u
        )
      );

      setTimeout(() => {
        toast.success('Роль оновлено');
      }, 0);

    } catch {
      toast.error('Не вдалося змінити роль');
    }
  };

  const updateStatus = async (userId, status) => {
    try {
      await apiAdmin.post('/status', { userId, status });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, statuses: [status] } : u
        )
      );
      setTimeout(() => {
        toast.success('Статус оновлено');
      }, 0);
    } catch {
      toast.error('Не вдалося змінити статус');
    }
  };

  return {
    users,
    loading,
    search,
    setSearch,
    showUsers,
    toggleUsers,
    sortBy,
    sortOrder,
    handleSort,
    banUser,
    unbanUser,
    updateRole, 
    updateStatus,
    page,
    setPage,
    pages,
  };
};