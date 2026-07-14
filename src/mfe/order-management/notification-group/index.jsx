import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateNotificationGroup from './CreateNotificationGroup';
import NotificationList from './NotificationList';
import { ROUTE_PATH } from './config';
import { TableProvider } from '@src/context/TableContext';
import NotificationService from '@src/api/commonService/NotificationService';
import NotificationGroupDetails from './NotificationGroupDetail';

function NotificationGroup() {
  return (
    <Routes>
      <Route
        path={ROUTE_PATH.LIST}
        element={
          <TableProvider
            fetchFn={NotificationService.getNotificationGroups}
            allowedSort={['name', 'createdBy', 'createdAt']}
            defaultSort={{ sortBy: 'createdAt', sortOrder: 'desc' }}
          >
            <NotificationList />
          </TableProvider>
        }
        index
      />
      <Route path={ROUTE_PATH.CREATE} element={<CreateNotificationGroup />} />
      <Route path={ROUTE_PATH.VIEW} element={<NotificationGroupDetails />} />
      <Route path={ROUTE_PATH.EDIT} element={<CreateNotificationGroup mode={'edit'} />} />
    </Routes>
  );
}

export default NotificationGroup;
