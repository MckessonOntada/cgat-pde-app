import AuthUtils from '@src/util/AuthUtils';

const usePermission = () => {
  const userPermissions = AuthUtils.getUserPermissions();
  if (!userPermissions) return;

  const hasAllPermission = (permissions = []) => {
    // let _hasPermission = true;
    permissions.forEach((permission) => {
      if (!userPermissions.includes(permission)) {
        return false;
      }
    });

    return true;
  };

  const hasAnyPermission = (permissions = []) => {
    // permissions.forEach((permission) => {
    //   return userPermissions.includes(permission);
    // });
    return permissions.some((item) => userPermissions.includes(item));
  };

  const hasPermission = (permission) => {
    if (permission && Array.isArray(permission)) {
      permission.forEach((p) => {
        return userPermissions?.includes(p);
      });
    }
    return userPermissions?.includes(permission);
  };

  return { hasAllPermission, hasAnyPermission, hasPermission };
};

export default usePermission;
