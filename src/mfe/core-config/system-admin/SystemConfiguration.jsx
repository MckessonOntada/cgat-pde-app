import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageCrossWalk from './manage-crosswalk';
import ManageSPCatalog from './manage-sp-catalog';
import ManageMaterial from './manage-material/ManageMaterial';
import { ManageMaterialProvider } from '@src/mfe/core-config/system-admin/manage-material/context/ManageMaterialContext';
import ManageCatalogRoute from './manage-catalog/routes/Routes';
import { OrgAccountSelectionProvider } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { QuestionnaireProvider } from '@src/mfe/core-config/system-admin/manage-questionnaire/context/QuestionnaireContext';
import Questionnaire from './manage-questionnaire';
import ManageAccountRoute from './manage-account/routes/Routes';
import { SPMaterialProvider } from './manage-sp-material/context/SPMaterialContext';
import ManageSPMaterialRoute from './manage-sp-material/routes/Routes';
import ManageSPAccountRoute from './manage-sp-account/routes/Routes';
import { SystemConfigDashboard } from './SystemConfigDashboard';
import NotFound from '@src/pages/error-pages/NotFound';
import ManageMaterialRoute from './manage-material/routes/Routes';

export default function SystemConfiguration() {
  return (
    <Routes>
      <Route index element={<SystemConfigDashboard />} />
      <Route
        path={'crosswalk/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
            <ManageCrossWalk />
          </ProtectedRoute>
        }
      />

      <Route
        path={'sp-catalog/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
            <ManageSPCatalog />
          </ProtectedRoute>
        }
      />
      <Route
        path={'manage-material/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
            <ManageMaterialProvider>
              <ManageMaterialRoute />
            </ManageMaterialProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'manage-catalog/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.catalog}>
            <OrgAccountSelectionProvider showAccountsSelect={true}>
              <ManageCatalogRoute />
            </OrgAccountSelectionProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={`questionnaire/*`}
        element={
          <ProtectedRoute permissions={routePermissionConfig.questionnaireConfiguration}>
            <QuestionnaireProvider>
              <Questionnaire />
            </QuestionnaireProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'manage-account/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
            <OrgAccountSelectionProvider allAccounts={true} enableAcct={false}>
              <ManageAccountRoute />
            </OrgAccountSelectionProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'manage-sp-material/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.spMaterial}>
            <ManageMaterialProvider>
              <SPMaterialProvider>
                <ManageSPMaterialRoute />
              </SPMaterialProvider>
            </ManageMaterialProvider>
          </ProtectedRoute>
        }
      />

      <Route
        path={'manage-sp-account/*'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.systemConfiguration}>
            <OrgAccountSelectionProvider allAccounts={true} enableAcct={false} defaultFirstOrgSelected={true}>
              <ManageSPAccountRoute />
            </OrgAccountSelectionProvider>
          </ProtectedRoute>
        }
      />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}
