import { OrderProvider } from '@src/mfe/order-management/context/OrderContext';
import Summary from '@src/mfe/order-management/pages/create/form-segments/summary';
import OrcaPatientDetails from '@src/mfe/order-management/pages/create/form-segments/summary/orca-patient-details/OrcaPatientDetails';
import UploadOrderDocument from '@src/mfe/order-management/pages/create/form-segments/upload-document';
import OrderIndex from '@src/mfe/order-management/pages/orders';
import { OrderLoader } from '@src/mfe/order-management/routes/Routes';
import NotFound from '@src/pages/error-pages/NotFound';
import ProtectedRoute from '@src/routes/ProtectedRoute';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const CSReviewOrders = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <OrderProvider isCSReviewOrdersPage={true}>
            <OrderIndex isCSReviewOrdersPage={true} />
          </OrderProvider>
        }
      />
      <Route path=":orderId" element={<OrderLoader />}>
        <Route
          path={`summary`}
          element={
            <ProtectedRoute permissions={[]}>
              <Summary />
            </ProtectedRoute>
          }
        />
        <Route
          path={`verification/:manufacturer`}
          element={
            <ProtectedRoute permissions={[]}>
              <OrcaPatientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path={`documents/upload`}
          element={
            <ProtectedRoute permissions={[]}>
              <UploadOrderDocument />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
};
