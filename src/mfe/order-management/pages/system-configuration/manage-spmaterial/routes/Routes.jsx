import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageSPMaterial from '..';
import AddSPMaterial from '../pages/AddSPMaterial';
import EditSPMaterial from '../pages/AddSPMaterial';
import UploadSPMaterial from '../pages/UploadSPMaterial';
import { routeConstants } from './constants';

function ManageSPMaterialRoute() {
  return (
    <Routes>
      <Route path={routeConstants.MANAGESPMATERIAL} element={<ManageSPMaterial />} />
      <Route path={routeConstants.ADD_SPMATERIAL} element={<AddSPMaterial />} />
      <Route path={routeConstants.UPLOAD_SPMATERIAL} element={<UploadSPMaterial />} />
      <Route path={`${routeConstants.EDIT_SPMATERIAL}/:spMaterialId`} element={<EditSPMaterial />} />
    </Routes>
  );
}
export default ManageSPMaterialRoute;
