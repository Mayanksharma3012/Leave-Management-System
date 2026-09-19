import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProtectedRoute({setUserData}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/user/me`,
      { withCredentials: true }
    )
      .then((res) => {
        setUserData(res.data.user);
        setIsAuthenticated(true)
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>Checking login...</p>;
  }

  return isAuthenticated 
    ? <Outlet /> // display whichever page was requested
    : <Navigate to="/login" replace />; // if not authenticated send them to /login
}

export default ProtectedRoute;