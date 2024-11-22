import AuthUtils from '../common/util/AuthUtils';
import { MAIN_BASE_URL, USERMANAGEMENT_SERVICE_BASE_URL } from '../config/AppConfig';

const constructMainAppUrl = (uri) => `${MAIN_BASE_URL}${uri}`;
const constructUserManagementServiceUrl = (uri) => `${USERMANAGEMENT_SERVICE_BASE_URL}api/${uri}`;

const ApiRoutes = Object.freeze({
  GET_CGAT_PDE_OKTA_CONFIG: constructUserManagementServiceUrl('public/idpConfig'),
  USERS: () => {
    // TODO : Refactor
    const userRole = AuthUtils.getUserRole();
    const isSystemAdmin = userRole === 'SYSTEM_ADMIN';
    const practiceId = AuthUtils.getPracticeId();
    return constructUserManagementServiceUrl(`practices/${isSystemAdmin ? 1 : practiceId}/users`)
  },
  GET_REFERENCE_LIST: constructUserManagementServiceUrl('reference'),
  GET_JWT_DECODE: constructUserManagementServiceUrl('public/jwt'),
  POST_USER_BULK_UPLOAD: constructUserManagementServiceUrl('users/roles'),
  POST_USER_LOGIN: constructUserManagementServiceUrl('users/postLogin'),
  POST_USER_LOGOUT: constructUserManagementServiceUrl('users/postLogout'),
  getRoles: () => {
    const userRole = AuthUtils.getUserRole();
    const isSystemAdmin = userRole === 'SYSTEM_ADMIN';
    const practiceId = AuthUtils.getPracticeId();
    return constructUserManagementServiceUrl(`practices/${isSystemAdmin ? 1 : practiceId}/roles`)
  }
});

export default ApiRoutes;
