import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SystemConfiguration from './SystemConfiguration';
import Dashboard from './dashboard';
import AuthUtils from '@src/util/AuthUtils';
import NotFound from '@src/pages/error-pages/NotFound';
const OrgEntryPoint = React.lazy(() => import('@src/mfe/org-management'));
const UsersEntryPoint = React.lazy(() => import('@src/mfe/user-management'));

export default function DashboardRoutes() {
  const isCustomerCenter = AuthUtils.isCustomerCenter();

  return (
    <Routes>
      <Route index element={isCustomerCenter ? <Navigate to="/orders" /> : <Dashboard />} />
      <Route path="home" element={<Dashboard />} />
      <Route
        path={'user/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemAdmin}>
            <UsersEntryPoint />
          </ProtectedRoute>
        }
      />
      <Route
        path={'organization/*'}
        element={
          AuthUtils.isSystemAdmin() && !AuthUtils.isSystemAdminView() ? (
            <Navigate to={'/'} />
          ) : (
            <ProtectedRoute permissions={routePermissionConfig.organization}>
              <OrgEntryPoint />
            </ProtectedRoute>
          )
        }
      />

      <Route
        path={'config/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
            <SystemConfiguration />
          </ProtectedRoute>
        }
      />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}
