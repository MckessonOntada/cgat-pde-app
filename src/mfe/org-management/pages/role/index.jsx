import React from 'react';
import { RoleProvider } from '../../context/RoleContext';
import RolesList from './list';
import RoleDetails from './manage/RoleDetails';
import RolePermissions from './manage/RolePermissions';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import NotFound from '@src/pages/error-pages/NotFound';
import RoleDetail from '../role/detail';
import NotificationRoles from './manage/NotificationRols';

const Role = () => {
  return (
    <RoleProvider>
      <Routes>
        <Route path="/" index element={<RolesList />} />
        <Route path={PATHS.createRole} element={<RoleDetails />} />
        <Route path={PATHS.editRole} element={<RoleDetails />} />
        <Route path={PATHS.permissions} element={<RolePermissions />} />
        <Route path={PATHS.notificationPermissions} element={<NotificationRoles />} />
        <Route path={':roleId'} element={<RoleDetail />} />
        <Route path={'*'} element={<NotFound />} />
      </Routes>
    </RoleProvider>
  );
};
export default Role;
