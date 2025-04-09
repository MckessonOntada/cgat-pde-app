import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './constants';
import Index from '../pages';
import Upload from '../pages/upload';

const SPCatalogRouter = () => {
  return (
    <Routes>
      <Route index path={ROUTE_PATHS.DASHBOARD} element={<Index />} />
      <Route path={ROUTE_PATHS.DETAILS} element={<div>Details</div>} />
      <Route path={ROUTE_PATHS.CREATE} element={<div>Create</div>} />
      <Route path={ROUTE_PATHS.UPLOAD} element={<Upload />} />
    </Routes>
  );
};

export default SPCatalogRouter;
