import AuthUtils from '@src/util/AuthUtils';
import { MAIN_BASE_URL, USERMANAGEMENT_SERVICE_BASE_URL } from '@src/config/AppConfig';

const constructMainAppUrl = (uri) => `${MAIN_BASE_URL}${uri}`;

const constructUserManagementServiceUrl = (uri) => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const practiceId = AuthUtils.getPracticeId();
  return `${USERMANAGEMENT_SERVICE_BASE_URL}api/practices/${isSystemAdminView ? 1 : practiceId}/${uri}`;
};

const constructUserManagementServicePublicUrl = (uri) => {
  return `${USERMANAGEMENT_SERVICE_BASE_URL}api/${uri}`;
};

const ApiRoutes = Object.freeze({
  GET_CGAT_PDE_OKTA_CONFIG: constructUserManagementServicePublicUrl('public/idpConfig'),
  USERS: () => constructUserManagementServiceUrl(`users`),
  POST_SIGNUP_USER: `${USERMANAGEMENT_SERVICE_BASE_URL}api/users-provisioning-requests`,
  USERS_PROVISIONING: constructUserManagementServiceUrl('users-provisioning-requests'),
  USERS_PROVISIONING_ORGLIST_PUBLIC: constructUserManagementServicePublicUrl('users-provisioning-requests/practices'),
  GET_REFERENCE_LIST: constructUserManagementServiceUrl('reference'),
  GET_JWT_DECODE: constructUserManagementServicePublicUrl('public/jwt'),
  POST_USER_BULK_UPLOAD: constructUserManagementServiceUrl('users/roles'),
  POST_USER_LOGIN: constructUserManagementServiceUrl('users/postLogin'),
  POST_USER_LOGOUT: constructUserManagementServiceUrl('users/postLogout'),
  GET_ROLES: () => constructUserManagementServiceUrl(`roles`),
  GET_ROLE_PERMISSIONS: (roleId) => constructUserManagementServiceUrl(`roles/${roleId}/permissions`),
  ORGANIZATIONS: constructUserManagementServiceUrl('practices'),
  PUBLIC_ORGANIZATIONS: constructUserManagementServicePublicUrl('practices'),
  ACCOUNTS: constructUserManagementServiceUrl('accounts'),
  PUBLIC_ACCOUNTS: constructUserManagementServicePublicUrl('accounts')
});

export default ApiRoutes;
