import { SESSION_CONST } from '@src/constants/SessionConstants';
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
  return sessionStorage.getItem(SESSION_CONST.USER_PERMISSIONS)?.split(',');
};

const getPracticeId = function () {
  return sessionStorage.getItem(SESSION_CONST.SELECTED_PRACTICE_ID);
};

const setPracticeId = function (practiceId) {
  return sessionStorage.setItem(SESSION_CONST.SELECTED_PRACTICE_ID, practiceId);
};

const removePracticeId = function () {
  return sessionStorage.removeItem(SESSION_CONST.SELECTED_PRACTICE_ID);
};

const isSystemAdmin = function () {
  const userRole = getUserRole();
  return userRole === 'System Admin';
};

const isSystemAdminView = function () {
  return isSystemAdmin() && !getPracticeId();
};

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
const userHasRoutePermission = function (routePermissions) {
  const userPermissions = getUserPermissions() || [];
  const hasAccess = routePermissions.some((permission) => userPermissions.includes(permission));
  return hasAccess;
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
  setPracticeId,
  removePracticeId,
  isSystemAdmin,
  isSystemAdminView
});

export default AuthUtils;
