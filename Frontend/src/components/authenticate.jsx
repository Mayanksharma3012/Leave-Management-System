import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProtectedRoute({ setUserData, loginRole, requiredRole }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isActive = true;
    const endpoint = loginRole === 'employee'
      ? '/user/me'
      : loginRole === 'manager'
        ? '/manager/me'
        : null;

    if (!endpoint) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return undefined;
    }

    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      withCredentials: true
    })
      .then((res) => {
        if (!isActive) return;
        setUserData(res.data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        if (isActive) setIsAuthenticated(false);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loginRole, setUserData]);

  if (isLoading) {
    return <p>Checking login...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loginRole !== requiredRole) {
    return <Navigate to={`/${loginRole}/dashboard`} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;