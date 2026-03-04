import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router';

export default function AdminRouter() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const roles = decoded?.roles || [];

    if (!roles.includes('admin')) {
      return <Navigate to="/profile" />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/login" />;
  }
}