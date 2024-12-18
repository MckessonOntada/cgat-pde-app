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

function OrderManagementRoutes() {
  return (
    <Routes>
      <Route path={routesConfig.index} element={<OrderIndex />} />
      <Route
        path={`create-order`}
        element={
          <TherapyProvider>
            <TherapySelection />
          </TherapyProvider>
        }
      />
      <Route
        path={`edit-order/:orderId`}
        element={
          <TherapyProvider>
            <TherapySelection />
          </TherapyProvider>
        }
      />

      <Route path={`:orderId/accounts`} element={<AccountSelection />} />
      <Route path={`:orderId/patient`} element={<PatientDetails />} />
      <Route path={`:orderId/additionalDetails`} element={<AdditionalDetails />} />
      <Route path={`:orderId/summary`} element={<Summary />} />

      <Route path={routesConfig.viewDetails} element={<OrderSummary />} />
      <Route path={routesConfig.reviewOrder} element={<div></div>} />
      <Route path={`${routesConfig.status}/:orderId`} element={<OrderStatus />} />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}

export default OrderManagementRoutes;
