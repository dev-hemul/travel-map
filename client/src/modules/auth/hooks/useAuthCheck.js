import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

import api from '@/api/api';

export const useAuthCheck = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsReady(true);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now + 60) {
          const res = await api.post('/refresh-token', {}, { withCredentials: true });
          localStorage.setItem('accessToken', res.data.accessToken);
        }
      } catch {
        localStorage.removeItem('accessToken');
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp < now + 60) {
            api
              .post('/refresh-token', {}, { withCredentials: true })
              .then(res => localStorage.setItem('accessToken', res.data.accessToken))
              .catch(() => localStorage.removeItem('accessToken'));
          }
        } catch {
          localStorage.removeItem('accessToken');
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return isReady;
};
