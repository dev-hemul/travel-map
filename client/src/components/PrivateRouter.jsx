import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouter = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRouter;