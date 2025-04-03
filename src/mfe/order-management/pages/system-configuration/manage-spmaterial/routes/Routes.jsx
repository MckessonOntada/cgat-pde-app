import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageSPMaterial from '..';
import { routeConstants } from './constants';

function ManageSPMaterialRoute() {
  return (
    <Routes>
      <Route path={routeConstants.MANAGESPMATERIAL} element={<ManageSPMaterial />} />
    </Routes>
  );
}
export default ManageSPMaterialRoute;
