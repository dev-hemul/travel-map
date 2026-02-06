import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../api/api';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;    
    ranRef.current = true;

    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (!code) {
        toast.error('Google авторизація не виконана');
        navigate('/login', { replace: true });
        return;
      }

      try {
        const { data } = await api.post('/google', { code }, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        toast.success('Успішний вхід через Google');
        navigate('/profile', { replace: true });
      } catch (err) {
        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.message;
        const serverCode = err?.response?.data?.code;

        if (status === 409) {
          if (serverCode === 'LOCAL_AUTH_ONLY') {
            toast.info('Ця адреса зареєстрована локально. Увійдіть з паролем.');
          } else {
            toast.warning(serverMsg || 'Конфлікт авторизації. Спробуйте інший спосіб входу.');
          }

          localStorage.removeItem('accessToken');
          navigate('/login', { replace: true });
          return;
        }

        const msg =
          serverMsg ||
          (status === 400 && 'Невірний запит до сервера') ||
          (status === 401 && 'Google авторизація не вдалася') ||
          (status === 500 && 'Помилка сервера') ||
          'Не вдалося увійти через Google';

        toast.error(msg);
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
      }
    };

    run();
  }, [navigate]);

  return <div>Signing in with Google…</div>;
}
