import { SESSION_CONST } from '@src/constants/SessionConstants';
import { permission } from 'process';
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
  const ghostId = getGhostId();
  if (ghostId) {
    return isSystemAdmin();
  }
  return isSystemAdmin() && !getPracticeId();
};

const setGhost = (details) => {
  const { id, name, permissions, practiceId, role, ...rest } = details;
  if (!id) throw new Error('Missing ghost id');
  if (!permissions) throw new Error('Missing permissions');
  if (!Array.isArray(permissions)) throw new Error('Invalid permission object. Permission can be list only.');

  const ghostDetails = { id, name, rest };
  const existingPermissions = sessionStorage.getItem('USER_PERMISSIONS');
  const existingPracticeId = sessionStorage.getItem('SELECTED_PRACTICE_ID');
  const existingROLE = sessionStorage.getItem('USER_ROLE');

  sessionStorage.setItem('GHOST_DETAILS', JSON.stringify(ghostDetails));
  sessionStorage.setItem('USER_PERMISSIONS', permissions);
  sessionStorage.setItem('__USER_PERMISSIONS__', existingPermissions);
  sessionStorage.setItem('USER_ROLE', role);
  sessionStorage.setItem('__USER_ROLE__', existingROLE);
  sessionStorage.setItem('SELECTED_PRACTICE_ID', practiceId);
  sessionStorage.setItem('__SELECTED_PRACTICE_ID__', existingPracticeId);
};

const removeGhost = () => {
  const originalPermissions = sessionStorage.getItem('__USER_PERMISSIONS__');
  const originalPracticeId = sessionStorage.getItem('__SELECTED_PRACTICE_ID__');
  const originalRole = sessionStorage.getItem('__USER_ROLE__');

  sessionStorage.setItem('USER_PERMISSIONS', originalPermissions);
  sessionStorage.setItem('SELECTED_PRACTICE_ID', originalPracticeId);
  sessionStorage.setItem('USER_ROLE', originalRole);
  sessionStorage.removeItem('GHOST_DETAILS');
  sessionStorage.removeItem('__USER_PERMISSIONS__');
  sessionStorage.removeItem('__USER_ROLE__');
  sessionStorage.removeItem('__SELECTED_PRACTICE_ID__');
};

const getGhostDetails = () => {
  try {
    const ghostDetails = JSON.parse(sessionStorage.getItem('GHOST_DETAILS'));
    return ghostDetails;
  } catch (error) {}
};

const getGhostId = () => {
  try {
    const ghostDetails = JSON.parse(sessionStorage.getItem('GHOST_DETAILS'));
    return ghostDetails?.id;
  } catch (error) {}
};

/**
 * @description - Check if the user has a specific permission
 * @param {any} permission - The input to check.
 * @returns {boolean} - True if the user has specific permission, false otherwise.
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
 * @returns {boolean} - True if the user has specific permission, false otherwise.
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
  setGhost,
  getGhostId,
  removeGhost,
  getGhostDetails,
  isSystemAdmin,
  isSystemAdminView
});

export default AuthUtils;
