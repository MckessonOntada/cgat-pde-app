import React, { useEffect } from 'react';
import { Route, Routes as ReactRoutes, Navigate, useNavigate } from 'react-router-dom';
import { PATHS } from './constants';
import PaymentHistory from '../pages/paymentHistory';
import Invoices from '../pages/invoices';
import CustomerStatements from '../pages/customerStatements';
import PaymentMethods from '../pages/paymentMethods';
import NotFound from '../../../pages/error-pages/NotFound';
import { PaymentHistoryProvider } from '../context/PaymentHistoryContext';
import { PaymentsInvoiceProvider } from '../context/PaymentsInvoicesContext';
import { PaymentMethodsProvider } from '../context/PaymentMethodsContext';
import { PaymentsCreditsProvider } from '../context/PaymentsCreditsContext';
import Credits from '../pages/credits';
import { PendingPaymentsProvider } from '../context/PendingPaymentsContext';
import PendingPayments from '../pages/pendingPayments';
import { useAccountContext } from '../context/AccountContext';
import CommonUtils from '@src/util/CommonUtils';
import { CustomerStatementsProvider } from '../context/CustomerStatementsContext';

const Routes = () => {
  const { selectedAccount } = useAccountContext();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (CommonUtils.isNonEmptyObject(selectedAccount)) {
  //     navigate('/record/invoice');
  //   }
  // }, [selectedAccount]);
  return CommonUtils.isNonEmptyObject(selectedAccount) ? (
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
      <Route
        path={PATHS.customerStatements}
        element={
          <CustomerStatementsProvider>
            <CustomerStatements />
          </CustomerStatementsProvider>
        }
      />
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
  ) : null;
};

export default Routes;
