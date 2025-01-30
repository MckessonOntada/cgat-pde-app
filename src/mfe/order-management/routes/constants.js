export const routesConfig = {
  index: '',
  resume: 'create-order',
  createOrder: 'create-order',
  editOrder: ':orderId/edit-order',
  reviewOrder: 'review-order',
  summary: 'summary',
  confirmation: 'order-confirmed',
  status: 'status',
  systemConfiguration : 'system-configuration'
};

export const ORDER_STAGES = {
  THERAPY_SELECTION: 0,
  ACCOUNT_DETAILS: 1,
  PATIENT_DETAILS: 2,
  ADDITIONAL_DETAILS: 3,
  ORDER_SUMMARY: 4
};
export const ORDER_MODE = {
  CREATE: 0,
  EDIT: 1
};
