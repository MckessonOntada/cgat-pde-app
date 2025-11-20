import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
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

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.DASHBOARD} element={<Home />} />
      <Route path={PATHS.userDetail} element={<UserDetail />} />
      <Route path={PATHS.createUser} element={<CreateUser />} />
      <Route path={PATHS.UPLOAD_USER} element={<UploadUsers />} />
      <Route path={`:userId/${PATHS.REVIEW_USER}`} element={<ReviewUser />} />
      <Route path={`:userId/${PATHS.EDIT}`} element={<EditUser />} />
      <Route path={`:userId/${PATHS.NOTIFICATION_PREFERENCES}`} element={<NotificationPreferenceDetails />} />
      <Route path={`:userId/${PATHS.PERMISSIONS}`} element={<UserPermissions />} />
      <Route path={`:userId/${PATHS.MATERIAL}`} element={<MaterialSelection />} />
      <Route path={`:userId/${PATHS.ADD_ACCOUNTS}`} element={<AddAccounts />} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
