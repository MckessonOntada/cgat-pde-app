import ProtectedRoute from '@src/routes/ProtectedRoute';
import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AccountProvider, useAccountContext } from './context/AccountContext';
import Details from './pages/details';
import ReviewPayments from './pages/reviewPayments';
import Confirmation from './pages/confirmation';
import { PATHS as PaymentInvoicesPaths } from '@src/mfe/finance-management/routes';
import PaymentsInvoices from '.';
import ConfirmationPayments from './pages/confirmationPayments';
import CommonUtils from '@src/util/CommonUtils';

function RecordsMainRoutes(props) {
  const { selectedAccount } = useAccountContext();

  return (
    <Routes>
      <Route
        path={'invoices/:billNumber/details'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <Details type={PaymentInvoicesPaths.invoices} />
          </ProtectedRoute>
        }
      />
      {CommonUtils.enableReviewAndPay(selectedAccount) && (
        <Route
          path={'invoices/reviewPayments'}
          element={
            <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
              <ReviewPayments type={PaymentInvoicesPaths.invoices} />
            </ProtectedRoute>
          }
        />
      )}
      <Route
        path={'invoices/ConfirmationPayments'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <ConfirmationPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path={'credits/:billNumber/details'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <Details type={PaymentInvoicesPaths.credits} />
          </ProtectedRoute>
        }
      />
      <Route
        path={'pending-payments/:confirmationNumber/confirmation'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <Confirmation type={PaymentInvoicesPaths.pendingPayments} />
          </ProtectedRoute>
        }
      />
      <Route
        path={'payment-history/:confirmationNumber/confirmation'}
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <Confirmation type={PaymentInvoicesPaths.paymentHistory} />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute permissions={routePermissionConfig.paymentInvoices}>
            <PaymentsInvoices />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default RecordsMainRoutes;
