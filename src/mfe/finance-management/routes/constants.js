export const PATHS = {
  invoices: 'invoices',
  credits: 'credits',
  pendingPayments: 'pending-payments',
  paymentHistory: 'payment-history',
  customerStatements: 'customer-statements',
  paymentMethods: 'payment-methods'
};

export const tabListData = [
  {
    id: 1,
    configName: 'INVOICES',
    isActive: true,
    isActiveTab: true,
    sequence: 1,
    labelForMobile: 'INVOICES',
    path: PATHS.invoices
  },
  ,
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
    configName: 'PENDING PAYMENTS',
    isActive: true,
    isActiveTab: false,
    sequence: 3,
    labelForMobile: 'PENDING PAYMENTS',
    path: PATHS.pendingPayments
  },
  {
    id: 4,
    configName: 'PAYMENT HISTORY',
    isActive: true,
    isActiveTab: false,
    sequence: 4,
    labelForMobile: 'PAYMENT HISTORY',
    path: PATHS.paymentHistory
  },
  {
    id: 5,
    configName: 'CUSTOMER STATEMENTS',
    isActive: true,
    isActiveTab: false,
    sequence: 5,
    labelForMobile: 'CUSTOMER STATEMENTS',
    path: PATHS.customerStatements
  },
  {
    id: 6,
    configName: 'PAYMENT METHODS',
    isActive: true,
    isActiveTab: false,
    sequence: 6,
    labelForMobile: 'PAYMENT METHODS',
    path: PATHS.paymentMethods
  }
];
