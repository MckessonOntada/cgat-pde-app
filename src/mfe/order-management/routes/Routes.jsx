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

function OrderManagementRoutes() {
  return (
    <Routes>
      <Route path={routesConfig.index} element={<OrderIndex />} />
      <Route path={`create-order`} element={<TherapySelection />} />
      <Route path={`edit-order/:orderId`} element={<TherapySelection />} />
      <Route path={`:therapyId/account-selection`} element={<AccountSelection />} />
      <Route path={`:therapyId/:accountId/patient-details`} element={<PatientDetails />} />
      <Route path={`:therapyId/:accountId/additional-details`} element={<AdditionalDetails />} />
      <Route path={`:therapyId/:accountId/summary`} element={<Summary />} />

      <Route path={routesConfig.viewDetails} element={<OrderSummary />} />
      <Route path={routesConfig.reviewOrder} element={<div></div>} />
      <Route path={`${routesConfig.status}/:orderId`} element={<OrderStatus />} />
    </Routes>
  );
}

export default OrderManagementRoutes;
