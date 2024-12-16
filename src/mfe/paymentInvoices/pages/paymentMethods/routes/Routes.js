import React from 'react';
import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import { PATHS } from './constants';
import NotFound from '@src/pages/error-pages/NotFound';
import BankAccounts from '../pages/bankAccounts';
import CreditCards from '../pages/creditCards';
import { PaymentHistoryProvider } from '@src/mfe/paymentInvoices/context/PaymentHistoryContext';

const Routes = () => {
  return (
    <ReactRoutes>
      <Route index element={<Navigate to={PATHS.bankAccounts}></Navigate>} />
      <Route path={PATHS.bankAccounts} element={<BankAccounts/>} />
      <Route path={PATHS.creditCards} element={<PaymentHistoryProvider><CreditCards/></PaymentHistoryProvider>} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes;
