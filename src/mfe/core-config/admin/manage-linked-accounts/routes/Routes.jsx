import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ManageLinkedAccount from '..';
import { SPAccountProvider } from '@src/mfe/core-config/system-admin/manage-sp-account/context/SPAccountContext';
import { OrgAccountSelectionProvider } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { routeConstants } from '@src/mfe/core-config/system-admin/manage-sp-account/routes/constants';
import AddLinkProvider from '@src/mfe/core-config/system-admin/manage-sp-account/pages/LinkProvider/AddLinkProvider';
import ViewSpAccount from '@src/mfe/core-config/system-admin/manage-sp-account/pages/SPAccounts/SPAccountDetail';
const ManagedLinkedAccounts = () => {
  return (
    <OrgAccountSelectionProvider>
      <SPAccountProvider>
        <Routes>
          <Route index path="/" element={<ManageLinkedAccount />} />
          <Route path={routeConstants.VIEW_SPACCOUNT} element={<ViewSpAccount />} />
          <Route path={`${routeConstants.ADD_LINK_PROVIDER}/:spAccountId`} element={<AddLinkProvider />} />
        </Routes>
      </SPAccountProvider>
    </OrgAccountSelectionProvider>
  );
};

export default ManagedLinkedAccounts;
