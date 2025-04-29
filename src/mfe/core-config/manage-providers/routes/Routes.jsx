import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import Upload from '../pages/upload';
import Index from '../pages';
import Provider from '../pages/create';
import ProviderDetails from '../pages/view';

const ProviderRouter = () => {
  return (
    <Routes>
      <Route index path={ROUTE_PATHS.DASHBOARD} element={<Index />} />
      <Route path={`${ROUTE_PATHS.VIEW}/:id`} element={<ProviderDetails />} />
      <Route path={ROUTE_PATHS.CREATE} element={<Provider />} />
      <Route
        path={`${ROUTE_PATHS.EDIT}/:id`}
        element={<Provider isEditOperation={true} />}
      />
      <Route path={ROUTE_PATHS.UPLOAD_PROVIDERS} element={<Upload />} />
      <Route path={ROUTE_PATHS.LINK_SP_ACCOUNTS} element={<div>Waiting</div>} />
    </Routes>
  );
};

export default ProviderRouter;
