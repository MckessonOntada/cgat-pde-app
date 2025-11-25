import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { routeConstants } from './constants';
import ManageMaterial from '../ManageMaterial';
import ConfigurationSpMaterial from '../../manage-sp-material/pages/configure-material/ConfigurationSpMaterial';

function ManageMaterialRoute() {
  return (
    <Routes>
      <Route path={routeConstants.MANAGE_MATERIAL} element={<ManageMaterial />} />
      <Route path={routeConstants.CONFIGURE} element={<ConfigurationSpMaterial />} />
    </Routes>
  );
}
export default ManageMaterialRoute;
