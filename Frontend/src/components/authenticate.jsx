import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function PublicOnlyRoute({ loginRole, setLoginRole }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticatedRole, setAuthenticatedRole] = useState(null);

  useEffect(() => {
    let isActive = true;

    const checkRole = async (role) => {
      const endpoint = role === 'employee' ? '/user/me' : '/manager/me';
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        withCredentials: true
      });
      return role;
    };

    const checkSession = async () => {
      const preferredRoles = loginRole
        ? [loginRole, loginRole === 'employee' ? 'manager' : 'employee']
        : ['employee', 'manager'];

      for (const role of preferredRoles) {
        try {
          await checkRole(role);
          if (!isActive) return;
          setLoginRole(role);
          setAuthenticatedRole(role);
          return;
        } catch {
          // Try the other account type before rendering the public page.
        }
      }

      if (isActive) setAuthenticatedRole(null);
    };

    setIsLoading(true);
    checkSession().finally(() => {
      if (isActive) setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [loginRole, setLoginRole]);

  if (isLoading) return <p>Checking login...</p>;
  if (authenticatedRole) return <Navigate to={`/${authenticatedRole}/dashboard`} replace />;
  return <Outlet />;
}

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