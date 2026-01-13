
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/api'


export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (!code) {
        navigate('/login');
        return;
      }

      const { data } = await api.post(
        '/google',
        { code },
        { withCredentials: true }
      );

      localStorage.setItem('accessToken', data.accessToken);
      navigate('/profile');
    };

    run().catch(() => navigate('/login'));
  }, [navigate]);

  return <div>Signing in with Google…</div>;
}
