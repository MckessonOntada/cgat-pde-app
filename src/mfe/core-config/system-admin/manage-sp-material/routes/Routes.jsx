import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageSPMaterial from '..';
import { routeConstants } from './constants';
import AssociatedSPAccount from '../pages/AssociatedSPAccount';
import { SPAccountProvider } from '../../manage-sp-account/context/SPAccountContext';
import { OrgAccountSelectionProvider } from '../../manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';

function ManageSPMaterialRoute() {
  return (
    <Routes>
      <Route path={routeConstants.MANAGESPMATERIAL} element={<ManageSPMaterial />} />
      <Route
        path={routeConstants.ASSOCIATED_ACCOUNT}
        element={
          <OrgAccountSelectionProvider allAccounts={true} enableOrg={false} enableAcct={false} defaultFirstOrgSelected={false} enableConfigure={false}>
            <SPAccountProvider isSpMaterial={true}>
              <AssociatedSPAccount />
            </SPAccountProvider>
          </OrgAccountSelectionProvider>
        }
      />
    </Routes>
  );
}
export default ManageSPMaterialRoute;
