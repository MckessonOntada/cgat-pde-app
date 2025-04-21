import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageSPAccount from '..';
import AddSPAccount from '../pages/SPAccounts/AddSPAccount';
import EditSPAccount from '../pages/SPAccounts/AddSPAccount';
import ViewSpAccount from '../pages/SPAccounts/SPAccountDetail';

import { routeConstants } from './constants';
import { SPAccountProvider } from '../context/SPAccountContext';
import AddLinkProvider from '../pages/LinkProvider/AddLinkProvider';

function ManageSPAccountRoute() {
  return (
    <SPAccountProvider>
      <Routes>
        <Route path={routeConstants.MANAGESPACCOUNT} element={<ManageSPAccount />} />
        <Route path={routeConstants.ADD_SPACCOUNT} element={<AddSPAccount />} />
        <Route path={routeConstants.VIEW_SPACCOUNT} element={<ViewSpAccount />} />
        <Route path={`${routeConstants.EDIT_SPACCOUNT}/:spAccountId`} element={<EditSPAccount />} />
        <Route path={`${routeConstants.ADD_LINK_PROVIDER}/:spAccountId`} element={<AddLinkProvider />} />
      </Routes>
    </SPAccountProvider>
  );
}
export default ManageSPAccountRoute;
