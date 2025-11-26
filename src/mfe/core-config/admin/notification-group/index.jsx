import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateNotificationGroup from './CreateNotificationGroup';
import NotificationList from './NotificationList';
import { ROUTE_PATH } from './config';
import { TableProvider } from '@src/context/TableContext';

function NotificationGroup() {
  return (
    <Routes>
      <Route
        path={ROUTE_PATH.LIST}
        element={
          <TableProvider
            fetchFn={() => {
              return {
                content: [
                  {
                    groupName: 'Appointment Alerts',
                    createdBy: 'Dr. Mehta',
                    createdOn: '01/12/2025'
                  },
                  {
                    groupName: 'Lab Report Updates',
                    createdBy: 'System Admin',
                    createdOn: '02/03/2025'
                  },
                  {
                    groupName: 'Billing Reminders',
                    createdBy: 'Finance Team',
                    createdOn: '18/03/2025'
                  },
                  {
                    groupName: 'Critical Patient Alerts',
                    createdBy: 'Nurse Supervisor',
                    createdOn: '04/07/2025'
                  },
                  {
                    groupName: 'General Notifications',
                    createdBy: 'Admin',
                    createdOn: '22/05/2025'
                  }
                ]
              };
            }}>
            <NotificationList />
          </TableProvider>
        }
        index
      />
      <Route path={ROUTE_PATH.CREATE} element={<CreateNotificationGroup />} />
      <Route path={ROUTE_PATH.VIEW} element={<div>View</div>} />
      <Route path={ROUTE_PATH.EDIT} element={<div>Edit</div>} />
    </Routes>
  );
}

export default NotificationGroup;
