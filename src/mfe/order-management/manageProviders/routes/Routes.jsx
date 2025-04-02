import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import ProviderList from '../pages/list';

const ProviderRouter = () => {
  return (
    <Routes>
      <Route index path={ROUTE_PATHS.DASHBOARD} element={<ProviderList />} />
      <Route path={ROUTE_PATHS.DETAILS} element={<div>Details</div>} />
      <Route path={ROUTE_PATHS.CREATE} element={<div>Create</div>} />
      <Route path={ROUTE_PATHS.UPLOAD_PROVIDERS} element={<div>UPLOAD</div>} />
    </Routes>
  );
};

export default ProviderRouter;
