import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { routeConstants } from './constants';
import ManageMaterial from '../ManageMaterial';
import ConfigurationSpMaterial from '../../manage-sp-material/pages/configure-material/ConfigurationSpMaterial';
import MaterialNotificationSettings from '../notification-settings';
import AddRecipient from '../notification-settings/AddRecipient';

function ManageMaterialRoute() {
  return (
    <Routes>
      <Route path={routeConstants.MANAGE_MATERIAL} element={<ManageMaterial />} />
      <Route path={routeConstants.CONFIGURE} element={<ConfigurationSpMaterial />} />
      <Route path={routeConstants.NOTIFICATION_SETTINGS} element={<MaterialNotificationSettings />} />
      <Route path={`${routeConstants.NOTIFICATION_SETTINGS}/${routeConstants.ADD_RECIPIENTS}`} element={<AddRecipient />} />
    </Routes>
  );
}
export default ManageMaterialRoute;
