import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../api/api';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (!code) {
        toast.error('Google авторизація не виконана');
        navigate('/login');
        return;
      }

      try {
        const { data } = await api.post('/google', { code }, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        toast.success('Успішний вхід через Google');
        navigate('/profile');
      } catch (err) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          (status === 400 && 'Невірний запит до сервера') ||
          (status === 401 && 'Google авторизація не вдалася') ||
          (status === 500 && 'Помилка сервера') ||
          'Не вдалося увійти через Google';

        toast.error(msg);
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    };

    run();
  }, [navigate]);

  return <div>Signing in with Google…</div>;
}
