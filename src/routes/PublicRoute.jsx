import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '@mckesson/mcp-component-library';

export default function PublicRoute() {
  let { authState } = useOktaAuth();
  if (!authState) {
    return <Loader type={'screen'} />;
  }
  return authState.isAuthenticated ? <Navigate to={'/'} replace /> : <Outlet />;
}
