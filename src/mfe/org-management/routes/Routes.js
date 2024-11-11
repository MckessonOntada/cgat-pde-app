import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { PATHS } from './constants';
import Home from '../pages/Dashboard';
import CreateOrganization from '../pages/CreateOrganization';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.dashboard} element={<Home />} />
      <Route path={PATHS.createOrg} element={<CreateOrganization />} />
    </ReactRoutes>
  );
};

export default Routes;
