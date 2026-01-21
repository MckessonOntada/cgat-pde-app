import { Route, Routes } from 'react-router-dom';
import React from 'react';
import ManageSPMaterial from '..';
import { OrgAccountSelectionProvider } from '../../manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { SPAccountProvider } from '../../manage-sp-account/context/SPAccountContext';
import AssociatedSPAccount from '../pages/AssociatedSPAccount';
import AddDiagnosisCode from '../pages/diagnosis-code-config/AddDiagnosisCode';
import DiagnosisConfiguration from '../pages/diagnosis-code-config/DiagnosisConfiguration';
import { routeConstants } from './constants';
import ConfigurationSpMaterial from '../pages/configure-material/ConfigurationSpMaterial';
import { ManageMaterialProvider } from '../../manage-material/context/ManageMaterialContext';

function ManageSPMaterialRoute() {
  return (
    <Routes>
      <Route path={routeConstants.MANAGE_SP_MATERIAL} element={<ManageSPMaterial />} />
      <Route path={routeConstants.DIAGNOSIS_CODE} element={<DiagnosisConfiguration />} />
      <Route
        path={routeConstants.CONFIGURE}
        element={
          <ManageMaterialProvider>
            <ConfigurationSpMaterial />
          </ManageMaterialProvider>
        }
      />
      <Route path={`${routeConstants.DIAGNOSIS_CODE}/${routeConstants.ADD_DIAGNOSIS_CODES}`} element={<AddDiagnosisCode />} />
      <Route
        path={routeConstants.ASSOCIATED_ACCOUNT}
        element={
          <OrgAccountSelectionProvider enableOrg={false} enableAcct={false} defaultFirstOrgSelected={false} enableConfigure={false}>
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
