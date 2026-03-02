import { ToastContainer } from 'react-toastify';

import AppRoutes from '@/app/routes/routes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthCheck } from '@/modules/auth/hooks/useAuthCheck';

function App() {
  const isReady = useAuthCheck();

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 relative">
      <ToastContainer position="top-center" autoClose={2000} />
      <AppRoutes />
    </div>
  );
}

export default App;
