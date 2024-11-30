import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { PATHS } from './constants';
import Home from '../pages/Dashboard';
import CreateOrganization from '../pages/CreateOrganization';
import ViewOrganization from '../pages/ViewOrganization';
import Role from '../pages/role';
import NotFound from '../../../pages/error-pages/NotFound';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.dashboard} element={<Home />} />
      <Route path={`${PATHS.editOrg}/:orgId`} element={<CreateOrganization />} />
      <Route path={PATHS.createOrg} element={<CreateOrganization />} />
      <Route path={PATHS.viewOrg} element={<ViewOrganization />} />
      <Route
        path={`${PATHS.roles}/*`}
        element={<Role />}
      />
      <Route path="*" element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
