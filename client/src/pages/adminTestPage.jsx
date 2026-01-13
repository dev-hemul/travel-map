import React, { useState } from 'react';

import api from '@/api/api';

const AdminDebugPage = () => {
  const [me, setMe] = useState(null);
  const [adminPing, setAdminPing] = useState(null);
  const [error, setError] = useState(null);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  });

  const loadMe = async () => {
    setError(null);
    setMe(null);
    try {
      const res = await api.get('/users/me', {
        headers: authHeaders(),
        withCredentials: true,
      });
      setMe(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Помилка /users/me');
    }
  };

  const pingAdmin = async () => {
    setError(null);
    setAdminPing(null);
    try {
      const res = await api.get('/admin/ping', {
        headers: authHeaders(),
        withCredentials: true,
      });
      setAdminPing({ status: res.status, data: res.data });
    } catch (e) {
      setAdminPing({
        status: e.response?.status,
        data: e.response?.data,
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-[#744ce9]">
          це сторінка під адмінку, зараз для тесту показування ролей
        </h1>

        <div className="text-sm p-3 rounded border bg-gray-50">
          <div>
            <b>Has accessToken:</b> {String(!!localStorage.getItem('accessToken'))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadMe}
            className="px-4 py-2 rounded bg-[#744ce9] text-white hover:bg-[#5d39b3] transition"
          >
            GET /users/me
          </button>

          <button
            onClick={pingAdmin}
            className="px-4 py-2 rounded border border-[#744ce9] text-[#744ce9] hover:bg-[#744ce9] hover:text-white transition"
          >
            GET /admin/ping
          </button>
        </div>

        {error && (
          <div className="text-sm p-3 rounded border border-red-200 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {me && (
          <div className="text-sm p-3 rounded border">
            <div className="font-semibold mb-2">/users/me response:</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(me, null, 2)}</pre>
          </div>
        )}

        {adminPing && (
          <div className="text-sm p-3 rounded border">
            <div className="font-semibold mb-2">/admin/ping response:</div>
            <div>
              <b>Status:</b> {String(adminPing.status)}
            </div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(adminPing.data, null, 2)}</pre>
            <div className="mt-2 text-gray-500">
              Очікування: <b>200</b> якщо admin, <b>403</b> якщо user, <b>401</b> якщо не
              залогінена.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDebugPage;
