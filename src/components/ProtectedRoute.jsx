import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !isAdmin) {
    // Redirect to login page with the return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;