import React, { createContext, useContext, useMemo } from 'react';

const PaymentsInvoicesContext = createContext();

export const usePaymentInvoices = () => {
  const context = useContext(PaymentsInvoicesContext);
  if (!context) {
    throw new Error('usePaymentInvoices must be used within a PaymentsInvoiceProvider.');
  }
  return context;
};

export const PaymentsInvoiceProvider = ({ children }) => {
  const ctxValue = useMemo(() => ({}), []);
  return <PaymentsInvoicesContext.Provider value={ctxValue}>{children}</PaymentsInvoicesContext.Provider>;
};
