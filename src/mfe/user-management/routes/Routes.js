import React from 'react';
import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import { PATHS } from './constants';
import Home from '../pages/Dashboard';
import UserDetail from '../pages/UserDetail';
import ReviewUser from '../pages/UserDetail/ReviewUser';
import CreateUser from '../pages/CreateUser';
import EditUser from '../pages/CreateUser';
import UserPermissions from '../pages/UserPermissions';
import AddAccounts from '../pages/AddAccounts';
import NotFound from '../../../pages/error-pages/NotFound';
import UploadUsers from '../pages/Dashboard/UploadUsers';
import NotificationPreferenceDetails from '../pages/UserDetail/NotificationPreferenceDetails';
import MaterialSelection from '../pages/CreateUser/MaterialSelection';
import { UserProvider } from '../context/UserContext';
import CreateUserWrapper from '../pages/CreateUser/CreateUserWrapper';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route
        path={PATHS.DASHBOARD}
        element={
          <UserProvider>
            <Home />
          </UserProvider>
        }
      />
      <Route path={PATHS.USER_DETAILS} element={<UserDetail />} />
      {/* 
      <Route path={PATHS.CREATE_USER} element={<CreateUser />} />
      <Route path={`:userId/${PATHS.PERMISSIONS}`} element={<UserPermissions />} />
      <Route path={`:userId/${PATHS.MATERIAL}`} element={<MaterialSelection />} />
      <Route path={`:userId/${PATHS.ACCOUNTS}`} element={<AddAccounts />} /> */}

      {/* CREATE USER FLOW */}
      <Route path={PATHS.CREATE_USER} element={<CreateUserWrapper />}>
        <Route index element={<Navigate to={PATHS.PERSONAL} replace />} />
        <Route path={PATHS.PERSONAL} element={<CreateUser />} />
        <Route path=":userId/permissions" element={<UserPermissions />} />
        <Route path=":userId/materials" element={<MaterialSelection />} />
        <Route path=":userId/accounts" element={<AddAccounts />} />
      </Route>

      {/* EDIT USER FLOW */}
      <Route path=":userId/edit" element={<CreateUserWrapper />}>
        <Route index element={<Navigate to={PATHS.PERSONAL} replace />} />
        <Route path={PATHS.PERSONAL} element={<CreateUser />} />
        <Route path={PATHS.PERMISSIONS} element={<UserPermissions />} />
        <Route path={PATHS.MATERIAL} element={<MaterialSelection />} />
        <Route path={PATHS.ACCOUNTS} element={<AddAccounts />} />
      </Route>

      <Route path={PATHS.UPLOAD_USER} element={<UploadUsers />} />
      <Route path={`:userId/${PATHS.REVIEW_USER}`} element={<ReviewUser />} />
      <Route path={`:userId/${PATHS.NOTIFICATION_PREFERENCES}`} element={<NotificationPreferenceDetails />} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
