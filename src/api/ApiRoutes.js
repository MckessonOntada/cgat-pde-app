import AuthUtils from '@src/util/AuthUtils';

//import { MAIN_BASE_URL, USERMANAGEMENT_SERVICE_BASE_URL, ORDER_MANAGEMENT_SERVICE_BASE_URL } from '@src/config/AppConfig';

import { MAIN_BASE_URL, USERMANAGEMENT_SERVICE_BASE_URL, ORDERMANAGEMENT_SERVICE_BASE_URL } from '@src/config/AppConfig';

const constructMainAppUrl = (uri) => `${MAIN_BASE_URL}${uri}`;

const constructUserManagementServiceUrl = (uri) => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const practiceId = AuthUtils.getPracticeId();
  return `${USERMANAGEMENT_SERVICE_BASE_URL}api/practices/${isSystemAdminView ? 1 : practiceId}/${uri}`;
};

const constructUserManagementServicePublicUrl = (uri) => {
  return `${USERMANAGEMENT_SERVICE_BASE_URL}api/${uri}`;
};

const constructOrderManagementServiceUrl = (uri) => {
  //const practiceId = AuthUtils.getPracticeId();
  //return `${ORDER_MANAGEMENT_SERVICE_BASE_URL}api/practices/${practiceId}/${uri}`;

  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const practiceId = AuthUtils.getPracticeId();
  return `${ORDERMANAGEMENT_SERVICE_BASE_URL}api/practices/${isSystemAdminView ? 1 : practiceId}/${uri}`;
};

const ApiRoutes = Object.freeze({
  GET_CGAT_PDE_OKTA_CONFIG: constructUserManagementServicePublicUrl('public/idpConfig'),
  USERS: () => constructUserManagementServiceUrl(`users`),
  LOGO: `${USERMANAGEMENT_SERVICE_BASE_URL}api/practice`,
  POST_SIGNUP_USER: `${USERMANAGEMENT_SERVICE_BASE_URL}api/users-provisioning-requests`,
  USERS_PROVISIONING: () => constructUserManagementServiceUrl('users-provisioning-requests'),
  USERS_PROVISIONING_ORGLIST_PUBLIC: constructUserManagementServicePublicUrl('users-provisioning-requests/practices'),
  GET_REFERENCE_LIST: constructUserManagementServiceUrl('reference'),
  GET_JWT_DECODE: constructUserManagementServicePublicUrl('public/jwt'),
  GET_CURRENT_USER: constructUserManagementServicePublicUrl('user/current'),
  POST_USER_BULK_UPLOAD: constructUserManagementServiceUrl('users/roles'),
  POST_USER_LOGIN: constructUserManagementServiceUrl('users/postLogin'),
  POST_USER_LOGOUT: constructUserManagementServiceUrl('users/postLogout'),
  GET_ROLES: () => constructUserManagementServiceUrl(`roles`),
  GET_ROLE_PERMISSIONS: (roleId) => constructUserManagementServiceUrl(`roles/${roleId}/permissions`),
  ORGANIZATIONS: constructUserManagementServiceUrl('practices'),
  PUBLIC_ORGANIZATIONS: constructUserManagementServicePublicUrl('practices'),
  ACCOUNTS: constructUserManagementServiceUrl('accounts'),
  PAY_TO_ACCOUNTS: () => constructUserManagementServiceUrl('users/current/paytoaccounts'),
  PUBLIC_ACCOUNTS: constructUserManagementServicePublicUrl('accounts'),
  ORDER: (userId) => constructUserManagementServiceUrl(`users/${userId}`),
  INVOICES_CREDITS_LISTING: (accountNumber, filterCredits) =>
    constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices?filterCredits=${filterCredits}`),
  INVOICES_CREDITS_DETAILS: (accountNumber, id) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/${id}`),
  PENDING_PAYMENTS_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/payments/pending`),
  PAYMENT_HISTORY_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/payments/history`),
  PAYMENT_METHODS_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/payments/method`),
  ORDERS: () => constructOrderManagementServiceUrl('orders'),
  APPROVER_GROUP: () => constructOrderManagementServiceUrl(`approver-group`),
  GET_OPEN_INVOICE_BALANCES: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/balances`),
  SET_DEFAULT_PAY_TO_ACCOUNT: (payToAccountId) =>
    constructUserManagementServiceUrl(`users/current/preference/defaultpayto/${payToAccountId}`),
  ORDER: (userId) => constructUserManagementServiceUrl(`users/${userId}`),
  CUSTOMER_STATEMENTS_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/statements`),
  EXPORT_CUSTOMER_STATEMENTS: (data) => constructOrderManagementServiceUrl(`account/${data.accountNumber}/statements/${data.docNo}`),
  EXPORT_CUSTOMER_STATEMENTS_EXCEL: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/statements/export`),
  INVENTORY: () => constructOrderManagementServiceUrl(`inventory`),
  THERAPIES: (therapyId) => constructUserManagementServicePublicUrl(`therapies/${therapyId}`),
  EXPORT_PAYMENT_HISTORY: (data) => constructOrderManagementServiceUrl(`account/${data.accountNumber}/payments/history/export`),
  EXPORT_INVOICES_EXCEL: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/export`),
  EXPORT_CREDITS_EXCEL: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/credit/export`),
  EXPORT_PENDING_PAYMENT_EXCEL: (data) =>constructOrderManagementServiceUrl(`account/${data.accountNumber}/payments/pending/export`),
  CATALOGS: () => constructUserManagementServicePublicUrl(`catalogs`),
  THERAPIES: () => constructUserManagementServicePublicUrl(`therapies`),
  QUESTIONNAIRE: () => constructUserManagementServicePublicUrl(`questionnaires`),
});

export default ApiRoutes;
