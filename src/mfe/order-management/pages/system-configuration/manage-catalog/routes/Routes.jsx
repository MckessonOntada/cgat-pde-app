import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CatalogProvider } from '../context/CatalogContext';
import ManageCatalog from '..';
import ViewCatalogConfig from '../pages/ViewCatalogConfig';

const rotesConstant = {
  manageCatalog: '',
  viewCatalog: 'view-catalog'
};

function ManageCatalogRoute(params) {
  return (
    <CatalogProvider>
      <Routes>
        <Route path={rotesConstant.manageCatalog} element={<ManageCatalog />} />
        <Route path={rotesConstant.viewCatalog} element={<ViewCatalogConfig />} />
      </Routes>
    </CatalogProvider>
  );
}
export default ManageCatalogRoute;
