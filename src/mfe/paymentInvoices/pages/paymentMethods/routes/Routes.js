import React from 'react';
import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import { PATHS } from './constants';
import NotFound from '@src/pages/error-pages/NotFound';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route index element={<Navigate to={PATHS.bankAccounts}></Navigate>} />
      <Route path={PATHS.bankAccounts} element={<h6>bankAccounts</h6>} />
      <Route path={PATHS.creditCards} element={<h6>creditCards</h6>} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
