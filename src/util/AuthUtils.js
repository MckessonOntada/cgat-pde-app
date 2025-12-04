import CommonService from '@src/api/commonService/CommonService';
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

const getFullName = function () {
  return sessionStorage.getItem(SESSION_CONST.USER_FULL_NAME);
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

const getRoleId = () => {
  return sessionStorage.getItem(SESSION_CONST.ROLE_ID);
};

const getReservedSystemAdminIds = () => {
  const roleIds = process.env.REACT_APP_SYSTEM_ADMIN_ID;
  return roleIds ? roleIds.split(',') : [];
};

const getReservedPhysicianIds = () => {
  const roleIds = process.env.REACT_APP_PHYSICIAN_ID;
  return roleIds ? roleIds.split(',') : [];
};

const isPhysician = (roleName = null, roleId = null) => {
  const resolvedRoleName = roleName || getUserRole();
  const resolvedRoleId = roleId || getRoleId();
  return resolvedRoleName === 'Physician' && getReservedPhysicianIds().includes(String(resolvedRoleId));
};

const isReservedUserRole = () => {
  const reservedUserRoleIds = [process.env.REACT_APP_SYSTEM_ADMIN_ROLE_ID, process.env.REACT_APP_PHYSICIAN_ROLE_ID];
  const currentUserId = getUserId();
  return reservedUserRoleIds.includes(currentUserId);
};

const isSystemAdmin = function () {
  const userRole = getUserRole();
  return userRole === 'System Admin';
};

const isRootAdmin = function () {
  const isImpersonated = getImpersonateId() > 0;
  if (isImpersonated) {
    try {
      const impersonatedByUser = JSON.parse(sessionStorage.getItem('IMPERSONATED_BY_USER'));
      return impersonatedByUser.role?.name === 'System Admin';
    } catch {
      return false;
    }
  } else {
    return getUserRole() === 'System Admin';
  }
};

const isSystemAdminView = function () {
  const impersonateId = getImpersonateId();
  if (impersonateId) {
    return isSystemAdmin() || isCustomerCenter() || isTreatmentCentreExecutive();
  }
  return (isSystemAdmin() || isCustomerCenter() || isTreatmentCentreExecutive()) && !getPracticeId();
};

const setImpersonateId = async (id) => {
  if (!id) throw new Error('Missing impersonate id');

  sessionStorage.setItem('x-imp-user-id', id);
  await CommonService.updateSessionStorage();
};

const removeImpersonateId = async () => {
  sessionStorage.removeItem('x-imp-user-id');
  await CommonService.updateSessionStorage();
};

const getImpersonateId = () => {
  try {
    const impersonatedSelectedId = sessionStorage.getItem('x-imp-user-id');
    return impersonatedSelectedId;
  } catch (error) {}
  return null;
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
  if (routePermissions.length === 0) {
    return true;
  }
  const hasAccess = routePermissions.some((permission) => userPermissions.includes(permission));
  return hasAccess;
};

const isCustomerCenter = function () {
  const userRole = getUserRole();
  return userRole === 'Customer Centre';
};

const isCustomerCenterView = function () {
  const impersonateId = getImpersonateId();
  if (impersonateId) {
    return isCustomerCenter();
  }
  return isCustomerCenter() && !getPracticeId();
};

const isTreatmentCentreExecutive = function () {
  const userRole = getUserRole();
  return userRole === 'Treatment centre Executive';
};

const getImpersonatedByUser = () => {
  const impersonatedByUser = sessionStorage.getItem(SESSION_CONST.IMPERSONATED_BY_USER);
  if (impersonatedByUser) {
    return JSON.parse(impersonatedByUser);
  }
  return null;
};

function getLoggedInUserId() {
  const impersonatedUserId = sessionStorage.getItem('x-imp-user-id');
  if (impersonatedUserId) {
    try {
      const impersonatedUserBy = JSON.parse(sessionStorage.getItem('IMPERSONATED_BY_USER'));
      return impersonatedUserBy?.id || null;
    } catch (error) {
      return null;
    }
  }
  return getUserId();
}

function getOrgName() {
  const selectedOrg = sessionStorage.getItem('selectedOrganization');
  try {
    const parsedOrgDetails = JSON.parse(selectedOrg);
    if (parsedOrgDetails.name) return parsedOrgDetails.name;
  } catch (error) {
    throw new Error('No organization found');
  }
}

const AuthUtils = Object.freeze({
  userHasRole,
  userHasPermission,
  userHasRoutePermission,
  getUserRole,
  getUserId,
  getUserName,
  getFullName,
  getUserPermissions,
  getPracticeId,
  setPracticeId,
  removePracticeId,
  setImpersonateId,
  getImpersonateId,
  removeImpersonateId,
  isSystemAdmin,
  isSystemAdminView,
  isCustomerCenter,
  isCustomerCenterView,
  getImpersonatedByUser,
  isTreatmentCentreExecutive,
  isReservedUserRole,
  isPhysician,
  getLoggedInUserId,
  isRootAdmin,
  getOrgName
});

export default AuthUtils;
