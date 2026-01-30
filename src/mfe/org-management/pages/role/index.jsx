import React from 'react';
import Roles from './list';
import RoleDetails from './manage/RoleDetails';
import RolePermissions from './manage/RolePermissions';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from '@src/pages/error-pages/NotFound';
import NotificationRolePreferences from './manage/NotificationRolePreferences';
import { WidgetProvider } from '@src/context/WidgetContext';
import RoleLoader from './manage/RoleLoader';
import RoleProfile from './detail/RoleProfile';
import { TableProvider } from '@src/context/TableContext';
import RoleService from '@src/api/commonService/RoleService';

const INITIAL_STATE = {
  selectedRole: '',
  roleDetails: null,
  createWizardSteps: {
    details: false,
    permissions: false,
    notificationPreferences: false
  }
};

const Role = () => {
  return (
    <WidgetProvider initialState={INITIAL_STATE}>
      <Routes>
        <Route
          path="/"
          index
          element={
            <TableProvider
              defaultFilters={{
                status: ''
              }}
              allowedSort={['name']}
              defaultSort={{
                sortBy: 'name',
                sortOrder: 'ASC'
              }}
              fetchFn={RoleService.getAllRoles}>
              <Roles />
            </TableProvider>
          }
        />
        <Route path="create" element={<RoleLoader />}>
          <Route index element={<Navigate to={'details'} replace />} />
          <Route path={'details'} element={<RoleDetails />} />
          <Route path={':roleId/details'} element={<RoleDetails />} />
          <Route path={`:roleId/permissions`} element={<RolePermissions />} />
          <Route path={`:roleId/notification-preferences`} element={<NotificationRolePreferences />} />
        </Route>
        <Route path=":roleId" element={<RoleLoader />}>
          <Route index element={<RoleProfile />} />
          <Route path={'edit'}>
            <Route index element={<Navigate to={'details'} replace />} />
            <Route path={'details'} element={<RoleDetails />} />
            <Route path={'permissions'} element={<RolePermissions />} />
            <Route path={'notification-preferences'} element={<NotificationRolePreferences />} />
          </Route>
        </Route>
        <Route path={'*'} element={<NotFound />} />
      </Routes>
    </WidgetProvider>
  );
};
export default Role;
