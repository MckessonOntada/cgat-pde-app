import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageProviders from './manage-providers';
import Role from '@src/mfe/org-management/pages/role';
import ManageApprovers from '@src/mfe/order-management/manageApprovers';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';

function AdminRoutes() {
  return (
    <Routes>
      <Route index element={''}></Route>
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
    </Routes>
  );
}

export default AdminRoutes;
