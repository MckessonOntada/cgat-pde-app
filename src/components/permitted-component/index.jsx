import usePermission from '@src/hooks/usePermissions';
import React from 'react';

function PermittedComponent(props) {
  const { permissions } = props;
  const { hasPermission, hasAnyPermission } = usePermission();
  let _hasPermission;
  if (permissions && Array.isArray(permissions)) {
    _hasPermission = hasAnyPermission(permissions);
  } else {
    _hasPermission = hasPermission(permissions);
  }
  if (!_hasPermission || !permissions) return null;
  return props.children;
}

export default PermittedComponent;
