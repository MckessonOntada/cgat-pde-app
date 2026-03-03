import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SystemConfiguration from './SystemConfiguration';
import Dashboard from './dashboard';
import AuthUtils from '@src/util/AuthUtils';
import NotFound from '@src/pages/error-pages/NotFound';
import { CSReviewOrders } from './cs-review-orders';
import { WidgetProvider } from '@src/context/WidgetContext';
const OrgEntryPoint = React.lazy(() => import('@src/mfe/org-management'));
const UsersEntryPoint = React.lazy(() => import('@src/mfe/user-management'));
const INITIAL_STATE = {
  orcaPatient: null,
  isVerified: false
};
export default function DashboardRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
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
      <Route
        path={'orders/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
            <WidgetProvider initialState={INITIAL_STATE}>
              <CSReviewOrders />
            </WidgetProvider>
          </ProtectedRoute>
        }
      />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}
