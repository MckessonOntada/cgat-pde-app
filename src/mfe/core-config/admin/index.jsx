import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageProviders from './manage-providers';
import Role from '@src/mfe/org-management/pages/role';
import ManageApprovers from '@src/mfe/order-management/manageApprovers';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import AdminLayout from '@src/mfe/core-config/admin/AdminIndex';
import NotFound from '@src/pages/error-pages/NotFound';
import ManagedLinkedAccounts from './manage-linked-accounts/routes/Routes';
import NotificationGroup from '../../order-management/notification-group';
const UsersEntryPoint = React.lazy(() => import('@src/mfe/user-management'));

function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminLayout />}></Route>
      <Route
        path={'user/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.users}>
            <UsersEntryPoint />
          </ProtectedRoute>
        }
      />

      <Route
        path={'providers/*'}
        element={
          <ProtectedRoute permissions={Object.values(PERMISSIONS_ENUM.MANAGE_PROVIDERS)}>
            <ManageProviders />
          </ProtectedRoute>
        }
      />
      <Route
        path={`organization/roles/*`}
        element={
          <ProtectedRoute permissions={routePermissionConfig.roles}>
            <Role />
          </ProtectedRoute>
        }
      />
      <Route
        path={`approver-group/*`}
        element={
          <ProtectedRoute permissions={routePermissionConfig.approvergroups}>
            <ManageApprovers />
          </ProtectedRoute>
        }
      />
      <Route path={`notification-group/*`} element={<NotificationGroup />} />
      <Route
        path={`linked-accounts/*`}
        element={
          <ProtectedRoute permissions={Object.values(PERMISSIONS_ENUM.MANAGE_LINKED_ACCOUNTS)}>
            <ManagedLinkedAccounts />
          </ProtectedRoute>
        }
      />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
