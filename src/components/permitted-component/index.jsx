import usePermission from '@src/hooks/usePermissions';
import React from 'react';

function PermittedComponent(props) {
  const { permissions } = props;
  const { hasPermission } = usePermission();
  const _hasPermission = hasPermission(permissions);
  if (!_hasPermission || !permissions) return null;
  return props.children;
}

export default PermittedComponent;
