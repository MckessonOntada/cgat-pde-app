export const PATHS = {
  invoices: 'invoices',
  invoicesHistory: 'invoices-history',
  credits: 'credits',
  pendingPayments: 'pending-payments',
  paymentHistory: 'payment-history',
  customerStatements: 'customer-statements',
  paymentMethods: 'payment-methods'
};

export const tabListData = [
  {
    id: 1,
    configName: 'OPEN INVOICES',
    isActive: true,
    isActiveTab: true,
    sequence: 1,
    labelForMobile: 'OPEN INVOICES',
    path: PATHS.invoices
  },
  {
    id: 2,
    configName: 'CREDITS',
    isActive: true,
    isActiveTab: false,
    sequence: 2,
    labelForMobile: 'CREDITS',
    path: PATHS.credits
  },
  {
    id: 3,
    configName: 'SCHEDULED PAYMENTS',
    isActive: true,
    isActiveTab: false,
    sequence: 3,
    labelForMobile: 'SCHEDULED PAYMENTS',
    path: PATHS.pendingPayments
  },
  {
    id: 4,
    configName: 'INVOICES HISTORY',
    isActive: true,
    isActiveTab: false,
    sequence: 4,
    labelForMobile: 'INVOICES HISTORY',
    path: PATHS.invoicesHistory
  },
  {
    id: 5,
    configName: 'PAYMENT HISTORY',
    isActive: true,
    isActiveTab: false,
    sequence: 5,
    labelForMobile: 'PAYMENT HISTORY',
    path: PATHS.paymentHistory
  },
  {
    id: 6,
    configName: 'CUSTOMER STATEMENTS',
    isActive: true,
    isActiveTab: false,
    sequence: 6,
    labelForMobile: 'CUSTOMER STATEMENTS',
    path: PATHS.customerStatements
  },
  {
    id: 7,
    configName: 'PAYMENT METHODS',
    isActive: true,
    isActiveTab: false,
    sequence: 7,
    labelForMobile: 'PAYMENT METHODS',
    path: PATHS.paymentMethods
  }
];
