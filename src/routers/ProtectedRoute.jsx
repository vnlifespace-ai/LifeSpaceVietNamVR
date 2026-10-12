import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { isAuthenticated } from '../api/auth';
import { getSelectedOrganization } from '../api/organization';

/**
 * ProtectedRoute
 * - If not authenticated → redirect to /login
 * - If authenticated but no organization selected AND not already on /organizations → redirect to /organizations
 */
export default function ProtectedRoute({ children, requireOrg = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Pages that require an org to be selected first
  if (requireOrg && !getSelectedOrganization()) {
    return <Navigate to="/organizations" replace />;
  }

  return children ? children : <Outlet />;
}
