export const routesConfig = {
  index: '',
  resume: 'create-order',
  createOrder: 'create',
  editOrder: ':orderId/edit-order',
  reviewOrder: 'review-order',
  summary: 'summary',
  confirmation: 'order-confirmed',
  status: 'status',
  systemConfiguration: 'system-configuration'
};

export const ORDER_STAGES = {
  THERAPY_SELECTION: 1,
  ACCOUNT_DETAILS: 2,
  PATIENT_DETAILS: 3,
  PAYER_DETAILS: 4,
  ADDITIONAL_DETAILS: 5,
  ORDER_SUMMARY: 6
};
export const ORDER_MODE = {
  CREATE: 0,
  EDIT: 1
};
