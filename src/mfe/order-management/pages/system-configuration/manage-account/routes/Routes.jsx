import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AccountProvider } from '../context/AccountContext';
import ManageAccount from '..';

const routesConstant = {
  manageAccount: ''
};

function ManageAccountRoute(params) {
  return (
    <AccountProvider>
      <Routes>
        <Route path={routesConstant.manageAccount} element={<ManageAccount />} />
      </Routes>
    </AccountProvider>
  );
}
export default ManageAccountRoute;
