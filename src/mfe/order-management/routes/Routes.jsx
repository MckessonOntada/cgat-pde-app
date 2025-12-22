import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routesConfig } from './constants';
import OrderIndex from './../pages/orders';
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
import UploadOrderDocument from '../pages/create/form-segments/upload-document';
import Payer from '../pages/create/form-segments/payers-details';
import FinalizeOrder from '../pages/create/form-segments/finalize-order';
import OrcaPatientDetails from '../pages/create/form-segments/summary/orca-patient-details/OrcaPatientDetails';

function OrderManagementRoutes() {
  const orderPermissions = [
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.THERAPY_SELECTION,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.ACCOUNT_SELECTION,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_PATIENTS_DETAILS,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_ADDITIONAL_DETAILS,
    PERMISSIONS_ENUM.CREATE_NEW_ORDER.SUBMIT_ORDER,
    PERMISSIONS_ENUM.ORDER_MANAGEMENT.VIEW_ORDERS
  ];
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
          <ProtectedRoute permissions={orderPermissions}>
            <TherapyProvider>
              <TherapySelection />
            </TherapyProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={`edit-order/:orderId`}
        element={
          <ProtectedRoute permissions={orderPermissions}>
            <TherapyProvider>
              <TherapySelection />
            </TherapyProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/accounts`}
        element={
          <ProtectedRoute permissions={orderPermissions}>
            <AccountSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/patient`}
        element={
          <ProtectedRoute permissions={orderPermissions}>
            <PatientDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/payer`}
        element={
          <ProtectedRoute permissions={orderPermissions}>
            <Payer />
          </ProtectedRoute>
        }
      />
      <Route
        path={`:orderId/additional-details`}
        element={
          <ProtectedRoute permissions={orderPermissions}>
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
        path={`:orderId/orca-patient-details`}
        element={
          <ProtectedRoute permissions={[]}>
            <OrcaPatientDetails />
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
        path={`:orderId/upload-document`}
        element={
          <ProtectedRoute permissions={[]}>
            <UploadOrderDocument />
          </ProtectedRoute>
        }
      />

      <Route
        path={`:orderId/finalize-order`}
        element={
          <ProtectedRoute permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.REVIEW_ORDER]}>
            <FinalizeOrder />
          </ProtectedRoute>
        }
      />

      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}

export default OrderManagementRoutes;
