import React from 'react';
import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import { PATHS } from './constants';
import PaymentHistory from '../pages/paymentHistory';
import Invoices from '../pages/invoices';
import CustomerSatements from '../pages/customerStatements';
import PaymentMethods from '../pages/paymentMethods';
import NotFound from '../../../pages/error-pages/NotFound';
import { PaymentHistoryProvider } from '../context/PaymentHistoryContext';
import { PaymentsInvoiceProvider } from '../context/PaymentsInvoicesContext';
import { PaymentMethodsProvider } from '../context/PaymentMethodsContext';
import Credits from '../pages/credits';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route index element={<Navigate to={PATHS.invoices}></Navigate>} />
      <Route
        path={PATHS.invoices}
        element={
          <PaymentsInvoiceProvider>
            <Invoices />
          </PaymentsInvoiceProvider>
        }
      />
      <Route path={PATHS.credits} element={<Credits/>} />
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
      <Route
        path={PATHS.paymentMethods + '/*'}
        element={
          <PaymentMethodsProvider>
            <PaymentMethods />
          </PaymentMethodsProvider>
        }
      />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
