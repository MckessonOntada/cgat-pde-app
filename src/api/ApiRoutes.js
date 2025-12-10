import AuthUtils from '@src/util/AuthUtils';
import { USERMANAGEMENT_SERVICE_BASE_URL, ORDERMANAGEMENT_SERVICE_BASE_URL, NOTIFICATION_SERVICE_BASE_URL } from '@src/config/AppConfig';

const constructUserManagementServiceUrl = (uri) => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const practiceId = AuthUtils.getPracticeId();
  return `${USERMANAGEMENT_SERVICE_BASE_URL}api/practices/${isSystemAdminView ? 1 : practiceId}/${uri}`;
};

const constructUserManagementServicePublicUrl = (uri) => `${USERMANAGEMENT_SERVICE_BASE_URL}api/${uri}`;

const constructOrderManagementServiceUrl = (uri) => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const practiceId = AuthUtils.getPracticeId();
  return `${ORDERMANAGEMENT_SERVICE_BASE_URL}api/practices/${isSystemAdminView ? 1 : practiceId}/${uri}`;
};

const constructNotificationServiceUrl = (uri) => `${NOTIFICATION_SERVICE_BASE_URL}${uri}`;

const ApiRoutes = Object.freeze({
  GET_CGAT_PDE_OKTA_CONFIG: constructUserManagementServicePublicUrl('public/idpConfig'),
  USERS: () => constructUserManagementServiceUrl('users'),
  CURRENT_USER: () => `${constructUserManagementServiceUrl('users')}/${AuthUtils.getUserId()}`,
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
  GET_ROLES: () => constructUserManagementServiceUrl('roles'),
  GET_ROLE_PERMISSIONS: (roleId) => constructUserManagementServiceUrl(`roles/${roleId}/permissions`),
  GET_COMMUNICATION_PREFERENCES: (roleId) => constructUserManagementServiceUrl(`roles/${roleId}/communication-preferences`),
  GET_PERMISSIONS: (userType) => constructUserManagementServicePublicUrl(`global/permissions/${userType}`),
  ORGANIZATIONS: constructUserManagementServiceUrl('practices'),
  ORGANIZATION_BASE: () => constructUserManagementServiceUrl(''),
  PUBLIC_ORGANIZATIONS: constructUserManagementServicePublicUrl('practices'),
  ACCOUNTS: constructUserManagementServiceUrl('accounts'),
  PAY_TO_ACCOUNTS: () => constructUserManagementServiceUrl('users/current/paytoaccounts'),
  PUBLIC_ACCOUNTS: constructUserManagementServicePublicUrl('accounts'),
  ORDER: (userId) => constructUserManagementServiceUrl(`users/${userId}`),
  USER_SERVICE_BASE: constructUserManagementServicePublicUrl(''),
  INVOICES_CREDITS_LISTING: (accountNumber, filterCredits) =>
    constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices?filterCredits=${filterCredits}`),
  INVOICES_CREDITS_DETAILS: (accountNumber, id) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/${id}`),
  PENDING_PAYMENTS_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/payments/pending`),
  PAYMENT_HISTORY_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/payments/history`),
  PAYMENT_METHODS_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/payments/method`),
  ORDERS: () => constructOrderManagementServiceUrl('orders'),
  BASE_ORDER_SERVICE: () => constructOrderManagementServiceUrl(''),
  APPROVER_GROUP: () => constructOrderManagementServiceUrl('approver-group'),
  GET_OPEN_INVOICE_BALANCES: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/balances`),
  GET_PAY_AMOUNT_URL: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/review/pay`),
  SET_DEFAULT_PAY_TO_ACCOUNT: (payToAccountId) => constructUserManagementServiceUrl(`users/current/preference/defaultpayto/${payToAccountId}`),
  SAP_ORDERS: () => constructOrderManagementServiceUrl('order'),
  CUSTOMER_STATEMENTS_LISTING: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/statements`),
  EXPORT_CUSTOMER_STATEMENTS: (data) => constructOrderManagementServiceUrl(`account/${data.accountNumber}/statements/${data.docNo}`),
  EXPORT_CUSTOMER_STATEMENTS_EXCEL: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/statements/export`),
  INVENTORY: () => constructOrderManagementServiceUrl('inventory'),
  THERAPIES: () => constructUserManagementServicePublicUrl(`therapies`),
  THERAPIES_BY_ID: (therapyId) => constructUserManagementServicePublicUrl(`therapies/${therapyId}`),
  EXPORT_PAYMENT_HISTORY: (data) => constructOrderManagementServiceUrl(`account/${data.accountNumber}/payments/history/export`),
  EXPORT_INVOICES_EXCEL: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/export`),
  EXPORT_CREDITS_EXCEL: (accountNumber) => constructOrderManagementServiceUrl(`account/${accountNumber}/open-invoices/credit/export`),
  EXPORT_PENDING_PAYMENT_EXCEL: (data) => constructOrderManagementServiceUrl(`account/${data.accountNumber}/payments/pending/export`),
  QUESTIONNAIRE: () => constructUserManagementServicePublicUrl('questionnaires'),
  GET_CATALOG_DATA: () => constructUserManagementServicePublicUrl('catalogs'),
  CATALOGS: () => constructUserManagementServicePublicUrl('catalogs'),
  GET_ALL_MATERIALS: () => constructUserManagementServicePublicUrl('therapies'),
  GET_MATERIAL_BY_ID: (materialId) => constructUserManagementServicePublicUrl(`therapies/${materialId}`),
  GET_MATERIAL_CONFIG_BY_ID: (materials) => constructUserManagementServicePublicUrl(`therapies/config/${materials}`),
  GET_SP_MATERIAL_CONFIG_BY_ID: (materials) => constructUserManagementServicePublicUrl(`therapies/sp/config/${materials}`),
  CONFIGURE_MATERIALS: () => constructUserManagementServicePublicUrl('therapies/config/update'),
  CONFIGURE_SP_MATERIALS: () => constructUserManagementServicePublicUrl('therapies/sp/config'),
  CONFIGURE_SP_MATERIALS_UPDATE_QUANTITY: () => constructUserManagementServicePublicUrl('therapies/config/update-quantity'),
  DELETE_MATERIAL_CONFIG: (ndcnumber) => constructUserManagementServicePublicUrl(`therapies/config/ndc/${ndcnumber}`),
  RESET_PASSWORD: () => constructUserManagementServiceUrl('users/current/reset-password'),
  GLOBAL_CONFIG: () => constructUserManagementServicePublicUrl('global-config'),
  NOTIFICATIONS: () => constructNotificationServiceUrl('in-app-notification/fetch'),
  NOTIFICATIONS_UNREAD_COUNT: () => constructNotificationServiceUrl('in-app-notification/unread/count'),
  NOTIFICATIONS_READ_ALL: () => constructNotificationServiceUrl('in-app-notification/read/all'),
  NOTIFICATIONS_READ_BY_ID: (id) => constructNotificationServiceUrl(`in-app-notification/read/${id}`),
  USER_BASE: constructUserManagementServiceUrl('')
});

export default ApiRoutes;
