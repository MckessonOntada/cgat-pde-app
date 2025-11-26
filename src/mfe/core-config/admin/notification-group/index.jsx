import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateNotificationGroup from './CreateNotificationGroup';
import NotificationList from './NotificationList';

function NotificationGroup() {
  return (
    <Routes>
      <Route index element={<NotificationList />} />
      {/* <Route path={'create'} element={<CreateNotificationGroup />} />
      <Route path={':id'} element={<div>View</div>} />
      <Route path={':id/edit'} element={<div>Edit</div>} /> */}
    </Routes>
  );
}

export default NotificationGroup;
