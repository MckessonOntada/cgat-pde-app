import { SESSION_CONST } from '../constants/SessionConstants';
/**
 * @description - Check if the user has a specific role
 * @param {any} role - The input to check.
 * @returns {boolean} - True if the user has speicific role, false otherwise.
 */
const userHasRole = function (role) {
  return sessionStorage.getItem(SESSION_CONST.USER_ROLE) == role;
};

const getUserRole = function () {
  return sessionStorage.getItem(SESSION_CONST.USER_ROLE);
};

const getUserId = function () {
  return sessionStorage.getItem(SESSION_CONST.USER_ID);
};

const getUserName = function () {
  return sessionStorage.getItem(SESSION_CONST.USERNAME);
};

const getUserPermissions = function () {
  return sessionStorage.getItem(SESSION_CONST.USER_PERMISSIONS);
};

const getPracticeId = function () {
  return sessionStorage.getItem(SESSION_CONST.SELECTED_PRACTICE_ID);
}

const isSystemAdmin = function (){
  const userRole = getUserRole();
  return userRole === 'SYSTEM_ADMIN';
}

const isSystemAdminView = function (){
  return isSystemAdmin() && !getPracticeId();
}

/**
 * @description - Check if the user has a specific permission
 * @param {any} permission - The input to check.
 * @returns {boolean} - True if the user has speicific permission, false otherwise.
 */
const userHasPermission = function (permission) {
  // const role = sessionStorage.getItem(SESSION_CONST.USER_ROLE);
  // if (role && PermissionConfig[role][permission] !== undefined) {
  //   return PermissionConfig[role][permission];
  // }
  return true;
};

/**
 * @description - Check if the user has a specific permission
 * @param {any} pathname - The input to check.
 * @returns {boolean} - True if the user has speicific permission, false otherwise.
 */
const userHasRoutePermission = function (pathname) {
  switch (pathname) {
    case '/userManagement':
    case '/userManagement/userUpload':
      return userHasPermission('userManagementRoute');

    case pathname.match(/^\/projects\/\w+\/patientUpload$/)?.[0]: // Regular expression for the path '/projects/:studyId/patientUpload
      return userHasPermission('patientUploadRoute');

    case '/admin':
    case '/admin/content':
      return userHasPermission('contentConsoleView');
  }
  return true;
};

const AuthUtils = Object.freeze({
  userHasRole,
  userHasPermission,
  userHasRoutePermission,
  getUserRole,
  getUserId,
  getUserName,
  getUserPermissions,
  getPracticeId,
  isSystemAdmin,
  isSystemAdminView
});

export default AuthUtils;
