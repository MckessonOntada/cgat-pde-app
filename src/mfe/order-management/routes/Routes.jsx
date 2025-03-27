import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routesConfig } from './constants';
import OrderIndex from './../pages/orders';
import OrderSummary from '../pages/orders/OrderSummary';
import OrderStatus from '../pages/orders/status/OrderStatus';
import TherapySelection from '../pages/create/form-segments/therapy-selection';
import AccountSelection from '../pages/create/form-segments/account-selection/AccountSelection';
import PatientDetails from '../pages/create/form-segments/patient-details';
import Summary from '../pages/create/form-segments/summary';
import AdditionalDetails from '../pages/create/form-segments/additional-details';
import NotFound from '../../../pages/error-pages/NotFound';
import { TherapyProvider } from '../context/TherapyContext';
import { OrderProvider } from '../context/OrderContext';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import { CONFIG_MODULE_ROUTES } from '../pages/system-configuration/constants';
import ManageCatalog from '../pages/system-configuration/manage-catalog';
import { OrgAccountSelectionProvider } from '../components/orgAccountSelection/context/OrgAccountSelectionContext';
import { CatalogProvider } from '../pages/system-configuration/manage-catalog/context/CatalogContext';
import ManageCatalogRoute from '../pages/system-configuration/manage-catalog/routes/Routes';
import ManageAccountRoute from '../pages/system-configuration/manage-account/routes/Routes';
import ManageMaterial from '../pages/system-configuration/manageMaterial/ManageMaterial';
import { ManageMaterialProvider } from '../context/ManageMaterialContext';
import Questionnaire from '../questionnaire';
import { QuestionnaireProvider } from '../context/QuestionnaireContext';
import ManageSPMaterialRoute from '../pages/system-configuration/manage-spmaterial/routes/Routes';
import { SPMaterialProvider } from '../pages/system-configuration/manage-spmaterial/context/SPMaterialContext';
import ManageSPAccountRoute from '../pages/system-configuration/manage-spaccount/routes/Routes';

function OrderManagementRoutes() {
  const addEditPermission = [PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_ORDERS, PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS];
  return (
    <Routes>
      <Route
        path={routesConfig.index}
        element={
          <OrderProvider>
            <OrderIndex />
          </OrderProvider>
        }
      />
      <Route
        path={`create-order`}
        element={
          <ProtectedRoute permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_ORDERS]}>
            <TherapyProvider>
              <TherapySelection />
            </TherapyProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={`edit-order/:orderId`}
        element={
          <ProtectedRoute permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS]}>
            <TherapyProvider>
              <TherapySelection />
            </TherapyProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/accounts`}
        element={
          <ProtectedRoute permissions={addEditPermission}>
            <AccountSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/patient`}
        element={
          <ProtectedRoute permissions={addEditPermission}>
            <PatientDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/additional-details`}
        element={
          <ProtectedRoute permissions={addEditPermission}>
            <AdditionalDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/summary`}
        element={
          <ProtectedRoute permissions={[]}>
            <Summary />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/order-confirmed`}
        element={
          <ProtectedRoute permissions={[]}>
            <OrderStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path={`system-configuration/${CONFIG_MODULE_ROUTES.MANAGE_MATERIAL}`}
        element={
          <ManageMaterialProvider>
            <ManageMaterial />
          </ManageMaterialProvider>
        }
      />
      <Route
        path={`system-configuration/${CONFIG_MODULE_ROUTES.MANAGE_CATALOG}/*`}
        element={
          <OrgAccountSelectionProvider showAccountsSelect={true}>
            <ManageCatalogRoute />
          </OrgAccountSelectionProvider>
        }
      />
      <Route
        path={`system-configuration/${CONFIG_MODULE_ROUTES.MANAGE_QUESTIONNAIRE}/*`}
        element={
          <QuestionnaireProvider>
            <Questionnaire />
          </QuestionnaireProvider>
        }
      />
      <Route
        path={`system-configuration/${CONFIG_MODULE_ROUTES.MANAGE_ACCOUNT}`}
        element={
          <OrgAccountSelectionProvider showAccountsSelect={true}>
            <ManageAccountRoute />
          </OrgAccountSelectionProvider>
        }
      />
      <Route
        path={`system-configuration/${CONFIG_MODULE_ROUTES.MANAGE_SPMATERIAL}/*`}
        element={
          <SPMaterialProvider>
            <ManageSPMaterialRoute />
          </SPMaterialProvider>
        }
      />

      <Route
        path={`system-configuration/${CONFIG_MODULE_ROUTES.MANAGE_SPACCOUNT}/*`}
        element={
          <OrgAccountSelectionProvider defaultFirstOrgSelected={true} showAccountsSelect={true}>
            <ManageSPAccountRoute />
          </OrgAccountSelectionProvider>
        }
      />
      <Route path={routesConfig.viewDetails} element={<OrderSummary />} />
      <Route path={routesConfig.reviewOrder} element={<div></div>} />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}

export default OrderManagementRoutes;
