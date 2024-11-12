import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routesConfig } from './constants';
import OrderIndex from './../pages/orders';
import OrderCreate from './../pages/create';
import OrderSummary from '../pages/orders/OrderSummary';

function OrderManagementRoutes() {
  return (
    <Routes>
      <Route path={routesConfig.index} element={<OrderIndex />} />
      <Route path={routesConfig.createNew} element={<OrderCreate />} />
      <Route path={routesConfig.viewDetails} element={<OrderSummary />} />
      <Route path={routesConfig.reviewOrder} element={<div></div>} />
    </Routes>
  );
}

export default OrderManagementRoutes;
