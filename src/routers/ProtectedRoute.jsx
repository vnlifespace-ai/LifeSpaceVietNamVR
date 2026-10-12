import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { isAuthenticated } from '../api/auth';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login page if no access_token is present
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
