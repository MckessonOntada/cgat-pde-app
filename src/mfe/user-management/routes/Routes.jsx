import React from 'react';
import { Route, Routes as ReactRoutes, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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
      <Route path={PATHS.USER_DETAILS}>
        <Route index element={<UserDetail />} />
        <Route path={`:userId/${PATHS.REVIEW_USER}`} element={<ReviewUser />} />
        <Route path={`:userId/${PATHS.NOTIFICATION_PREFERENCES}`} element={<NotificationPreferenceDetails />} />
      </Route>

      <Route path={PATHS.CREATE_USER} element={<CreateUserWrapper />}>
        <Route index element={<Navigate to={PATHS.PERSONAL} replace />} />
        <Route path={PATHS.PERSONAL} element={<CreateUser />} />
        <Route path=":userId/permissions" element={<UserPermissions />} />
        <Route path=":userId/accounts" element={<AddAccounts />} />
        <Route path=":userId/materials" element={<MaterialSelection />} />
      </Route>

      <Route path=":userId/edit" element={<CreateUserWrapper />}>
        <Route index element={<Navigate to={`${PATHS.PERSONAL}${location.search}`} replace />} />
        <Route path={PATHS.PERSONAL} element={<CreateUser />} />
        <Route path={PATHS.PERMISSIONS} element={<UserPermissions />} />
        <Route path={PATHS.ACCOUNTS} element={<AddAccounts />} />
        <Route path={PATHS.MATERIAL} element={<MaterialSelection />} />
      </Route>

      <Route path={PATHS.UPLOAD_USER} element={<UploadUsers />} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
