import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import Upload from '../pages/upload';
import Index from '../pages';
import Provider from '../pages/create';
import ProviderDetails from '../pages/view';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import LinkSpAccount from '../pages/link/LinkSpAccount';
import { LinkSpAccountProvider } from '../context/LinkSpAccountContext';

const ProviderRouter = () => {
  return (
    <Routes>
      <Route index path={ROUTE_PATHS.DASHBOARD} element={<Index />} />
      <Route
        path={`:id/${ROUTE_PATHS.VIEW}`}
        element={
          <ProtectedRoute
            permissions={[PERMISSIONS_ENUM.MANAGE_PROVIDERS.VIEW_PROVIDER]}>
            <ProviderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.CREATE}
        element={
          <ProtectedRoute
            permissions={[PERMISSIONS_ENUM.MANAGE_PROVIDERS.ADD_PROVIDER]}>
            <Provider />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:id/${ROUTE_PATHS.EDIT}`}
        element={
          <ProtectedRoute
            permissions={[PERMISSIONS_ENUM.MANAGE_PROVIDERS.EDIT_PROVIDER]}>
            <Provider isEditOperation={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.UPLOAD_PROVIDERS}
        element={
          <ProtectedRoute
            permissions={[PERMISSIONS_ENUM.MANAGE_PROVIDERS.UPLOAD_PROVIDER]}>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTE_PATHS.LINK_SP_ACCOUNTS}
        element={
          <LinkSpAccountProvider>
            <LinkSpAccount />
          </LinkSpAccountProvider>
        }
      />
    </Routes>
  );
};

export default ProviderRouter;
