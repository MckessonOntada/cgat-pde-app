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
import { PaymentsCreditsProvider } from '../context/PaymentsCreditsContext';
import Credits from '../pages/credits';
import { PendingPaymentsProvider } from '../context/PendingPaymentsContext';
import PendingPayments from '../pages/pendingPayments';

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
      <Route
        path={PATHS.credits}
        element={
          <PaymentsCreditsProvider>
            <Credits />
          </PaymentsCreditsProvider>
        }
      />
      <Route
        path={PATHS.pendingPayments}
        element={
          <PendingPaymentsProvider>
            <PendingPayments />
          </PendingPaymentsProvider>
        }
      />
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
