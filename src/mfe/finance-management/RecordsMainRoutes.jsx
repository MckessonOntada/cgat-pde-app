import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AccountProvider } from './context/AccountContext';
import Details from './pages/details';
import ReviewPayments from './pages/reviewPayments';
import Confirmation from './pages/confirmation';
import { PATHS as PaymentInvoicesPaths } from '@src/mfe/finance-management/routes';
import PaymentsInvoices from '.';
import ConfirmationPayments from './pages/confirmationPayments';

function RecordsMainRoutes(props) {
  return (
    <Routes>
      <Route
        path={'invoices/:billNumber/details'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <AccountProvider>
              <Details type={PaymentInvoicesPaths.invoices} />
            </AccountProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'invoices/reviewPayments'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <AccountProvider>
              <ReviewPayments type={PaymentInvoicesPaths.invoices} />
            </AccountProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'invoices/ConfirmationPayments'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <AccountProvider>
              <ConfirmationPayments />
            </AccountProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'credits/:billNumber/details'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <AccountProvider>
              <Details type={PaymentInvoicesPaths.credits} />
            </AccountProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'pending-payments/:confirmationNumber/confirmation'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <AccountProvider>
              <Confirmation type={PaymentInvoicesPaths.pendingPayments} />
            </AccountProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path={'payment-history/:confirmationNumber/confirmation'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <AccountProvider>
              <Confirmation type={PaymentInvoicesPaths.paymentHistory} />
            </AccountProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <AccountProvider>
              <PaymentsInvoices />
            </AccountProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default RecordsMainRoutes;
