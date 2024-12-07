import ErrorComponent from '@src/components/error/ErrorComponent';
import AuthUtils from '@src/util/AuthUtils';
import React from 'react';
import { Button } from '@mckesson/mcp-component-library';

const ProtectedRoute = (props) => {
  const { isDashboard = false, permissions } = props;

  if (!isDashboard && !AuthUtils.userHasRoutePermission(permissions)) {
    return (
      <ErrorComponent
        variant="center"
        type="access-denied"
        header="Access Denied"
        body="You do not have permission to access this page. "
        bodyFooter={
          <Button data-testid="deny-back-button" variant="text" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        }
      />
    );
  }

  return props.children;
};

export default ProtectedRoute;
