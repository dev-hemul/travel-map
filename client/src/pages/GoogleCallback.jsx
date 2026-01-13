import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

      const { data } = await axios.post(
        'http://localhost:4000/api/google',
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
