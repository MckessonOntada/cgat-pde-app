import AuthUtils from '@src/util/AuthUtils';

const usePermission = () => {
  const userPermissions = AuthUtils.getUserPermissions();

  const hasAllPermission = (permissions = []) => {
    // let _hasPermission = true;
    permissions.forEach((permission) => {
        if(!userPermissions.includes(permission)){
            return false;
        }
    });

    return true;
  };

  const hasAnyPermission = (permissions = []) => {
    permissions.forEach((permission) => {
      return userPermissions.includes(permission);
    });

    return false;
  };

  const hasPermission = (permission = "") => {
    return userPermissions.includes(permission);
  };

  return { hasAllPermission, hasAnyPermission, hasPermission };
};

export default usePermission;
