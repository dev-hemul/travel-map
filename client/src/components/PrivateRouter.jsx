import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRouter = () => {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRouter;
