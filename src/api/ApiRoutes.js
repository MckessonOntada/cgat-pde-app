import { MAIN_BASE_URL, USERMANAGEMENT_SERVICE_BASE_URL } from '../config/AppConfig';

const constructMainAppUrl = (uri) => `${MAIN_BASE_URL}${uri}`;
const constructUserManagementServiceUrl = (uri) => `${USERMANAGEMENT_SERVICE_BASE_URL}${uri}`;

const ApiRoutes = Object.freeze({
  GET_CGAT_PDE_OKTA_CONFIG: constructUserManagementServiceUrl('public/idpConfig'),
  GET_USERS_LIST: constructUserManagementServiceUrl('practices'),
  GET_REFERENCE_LIST: constructUserManagementServiceUrl('reference'),
  GET_JWT_DECODE: constructUserManagementServiceUrl('public/jwt'),
  POST_USER_BULK_UPLOAD: constructUserManagementServiceUrl('users/roles'),
  POST_USER_LOGIN: constructUserManagementServiceUrl('users/postLogin'),
  POST_USER_LOGOUT: constructUserManagementServiceUrl('users/postLogout')
});

export default ApiRoutes;
