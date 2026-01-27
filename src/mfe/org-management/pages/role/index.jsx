import React from 'react';
import { RoleProvider } from '../../context/RoleContext';
import RolesList from './list';
import RoleDetails from './manage/RoleDetails';
import RolePermissions from './manage/RolePermissions';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import NotFound from '@src/pages/error-pages/NotFound';
import RoleDetail from '../role/detail';
import NotificationRolePreferences from './manage/NotificationRolePreferences';
import { WidgetProvider } from '@src/context/WidgetContext';

const INITIAL_STATE = {
  selectedRole: ''
};

const Role = () => {
  return (
    <WidgetProvider initialState={INITIAL_STATE}>
      <RoleProvider>
        <Routes>
          <Route path="/" index element={<RolesList />} />
          <Route path={PATHS.createRole} element={<RoleDetails />} />
          <Route path={PATHS.editRole} element={<RoleDetails />} />
          <Route path={PATHS.permissions} element={<RolePermissions />} />
          <Route path={PATHS.notificationPermissions} element={<NotificationRolePreferences />} />
          <Route path={':roleId'} element={<RoleDetail />} />
          <Route path={'*'} element={<NotFound />} />
        </Routes>
      </RoleProvider>
    </WidgetProvider>
  );
};
export default Role;
