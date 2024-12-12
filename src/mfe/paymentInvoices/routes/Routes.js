import React from 'react';
import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import { PATHS } from './constants';
import PaymentHistory from '../pages/paymentHistory';
import CustomerSatements from '../pages/customerStatements';
import NotFound from '../../../pages/error-pages/NotFound';
import { PaymentHistoryProvider } from '../context/PaymentHistoryContext';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route index element={<Navigate to={PATHS.invoices}></Navigate>} />
      <Route path={PATHS.invoices} element={<h6>Invoices</h6>} />
      <Route path={PATHS.credits} element={<h6>Credits</h6>} />
      <Route path={PATHS.pendingPayments} element={<h6>Pending Payments</h6>} />
      <Route
        path={PATHS.paymentHistory}
        element={
          <PaymentHistoryProvider>
            <PaymentHistory />
          </PaymentHistoryProvider>
        }
      />
      <Route path={PATHS.customerStatements} element={<CustomerSatements />} />
      <Route path={PATHS.paymentMethods} element={<h6>Payment Methods</h6>} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
