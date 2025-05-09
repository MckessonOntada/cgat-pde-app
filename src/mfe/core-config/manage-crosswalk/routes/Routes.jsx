import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import List from '../pages/list';
import Index from '../pages';
import Upload from '../pages/upload';
import CreateCrosswalk from '../pages/create';
import { GenericProvider } from '../config/GenericContext';

const ProviderRouter = () => {
  return (
    <GenericProvider>
      <Routes>
        <Route index path={ROUTE_PATHS.DASHBOARD} element={<Index />} />
        <Route path={ROUTE_PATHS.DETAILS} element={<div>Details</div>} />
        <Route path={ROUTE_PATHS.CREATE} element={<CreateCrosswalk />} />
        <Route path={ROUTE_PATHS.UPLOAD} element={<Upload />} />
      </Routes>
    </GenericProvider>
  );
};

export default ProviderRouter;
