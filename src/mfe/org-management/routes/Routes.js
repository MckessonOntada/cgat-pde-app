import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { PATHS } from './constants';
import Home from '../pages/Dashboard';
import CreateOrganization from '../pages/CreateOrganization';
import ViewOrganization from '../pages/ViewOrganization';
import RolesList from '../pages/role/list';
import RoleCreate from '../pages/role/create';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.dashboard} element={<Home />} />
      <Route path={`${PATHS.editOrg}/:orgId`} element={<CreateOrganization />} />
      <Route path={PATHS.createOrg} element={<CreateOrganization />} />
      <Route path={PATHS.viewOrg} element={<ViewOrganization />} />
      <Route path={PATHS.roles} element={<RolesList />} />
      <Route path={PATHS.createRole} element={<RoleCreate />} />
    </ReactRoutes>
  );
};

export default Routes;
