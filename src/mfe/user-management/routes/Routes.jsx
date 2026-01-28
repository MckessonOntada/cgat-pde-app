import React from 'react';
import { Route, Routes as ReactRoutes, Navigate, useLocation, Outlet } from 'react-router-dom';
import { PATHS } from './constants';
import Home from '../pages/Dashboard';
import UserDetail from '../pages/UserDetail';
import ReviewUser from '../pages/UserDetail/ReviewUser';
import CreateUser from '../pages/CreateUser';
import UserPermissions from '../pages/UserPermissions';
import AddAccounts from '../pages/AddAccounts';
import NotFound from '../../../pages/error-pages/NotFound';
import UploadUsers from '../pages/Dashboard/UploadUsers';
import NotificationPreferenceDetails from '../pages/UserDetail/NotificationPreferenceDetails';
import MaterialSelection from '../pages/CreateUser/MaterialSelection';
import { UserProvider } from '../context/UserContext';
import CreateUserWrapper from '../pages/CreateUser/CreateUserWrapper';
import UserLoader from '../UserLoader';
import MaterialWrapper from '../pages/CreateUser/MaterialWrapper';

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
      <Route path={PATHS.CREATE} element={<UserLoader />}>
        <Route path="" element={<CreateUserWrapper />}>
          <Route index element={<Navigate to={PATHS.PERSONAL} replace />} />
          <Route path={PATHS.PERSONAL} element={<CreateUser />} />
          <Route path={`:userId/${PATHS.PERSONAL}`} element={<CreateUser />} />
          <Route path={`:userId/${PATHS.PERMISSIONS}`} element={<UserPermissions />} />
          <Route path={`:userId/${PATHS.ACCOUNTS}`} element={<AddAccounts />} />
          <Route
            path={`:userId/${PATHS.MATERIAL}`}
            element={
              <MaterialWrapper listingMode="EXCLUDED">
                <MaterialSelection />
              </MaterialWrapper>
            }
          />
        </Route>
      </Route>

      <Route path=":userId" element={<UserLoader />}>
        <Route index element={<UserDetail />} />
        <Route path={`${PATHS.REVIEW}`} element={<ReviewUser />} />
        <Route path={PATHS.EDIT} element={<CreateUserWrapper />}>
          <Route index element={<Navigate to={`${PATHS.PERSONAL}${location.search}`} replace />} />
          <Route path={PATHS.PERSONAL} element={<CreateUser />} />
          <Route path={PATHS.PERMISSIONS} element={<UserPermissions />} />
          <Route path={PATHS.ACCOUNTS} element={<AddAccounts />} />
          <Route
            path={PATHS.MATERIAL}
            element={
              <MaterialWrapper listingMode="EXCLUDED">
                <MaterialSelection />
              </MaterialWrapper>
            }
          />
          <Route path={`${PATHS.NOTIFICATION_PREFERENCES}`} element={<NotificationPreferenceDetails />} />
        </Route>
      </Route>

      <Route path={PATHS.UPLOAD} element={<UploadUsers />} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
