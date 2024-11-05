import React, { Suspense, useEffect } from 'react';

import { Security, useOktaAuth } from '@okta/okta-react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';

import OktaHelper from './config/OktaHelper';
import AuthService from './api/authService/AuthService';
import AppRoutes from './routes/AppRoutes';
import { Loader } from '@mckesson/mcp-component-library';
import Login from './pages/login/Login';
import MainLayout from './pages/MainLayout';

import { debugIds, ID } from './common/constants/id';
import { DEFAULT_INACTIVE_TIMEOUT } from './config/AppConfig';
import LoginCallback from './pages/LoginCallback/LoginCallback';

function AuthorizedRoute({ children }) {
  let { authState } = useOktaAuth();

  if (!authState) {
    return <Loader type={'screen'} />;
  }

  if (!authState.isAuthenticated) {
    // not logged in so redirect to login page with the return url
    return <Navigate to={AppRoutes.pathPageLogin} replace />;
  }

  // authorized so return child components
  return children;
}

function IdleTimer({ children, timeout }) {
  let { oktaAuth } = useOktaAuth();

  useEffect(() => {
    let token;
    let expiresIn;
    let tokenInterval;

    const getToken = async () => {
      try {
        token = await oktaAuth.tokenManager.getTokens();
        if (token && token.accessToken) {
          expiresIn = token.accessToken.expiresAt - Math.floor(Date.now() / 1000);
          refreshToken();
          tokenInterval = setInterval(getToken, (expiresIn + 1) * 1000);
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    const refreshToken = () => {
      console.info('renew token');
      sessionStorage.setItem(
        'APP_AUTH_TOKEN',
        `${token.accessToken.tokenType} ${token.accessToken.accessToken}`
      );
    };

    getToken();

    return () => clearInterval(tokenInterval);
  }, []);

  const onIdle = () => {
    AuthService.userLogout(oktaAuth);
  };

  useIdleTimer({
    onIdle,
    timeout,
    crossTab: true,
    leaderElection: true,
    syncTimers: 200
  });

  return children;
}

const Navigation = () => {
  const navigate = useNavigate();
  const oktaAuthObj = OktaHelper.getOktaRootObject();
  let timeout = DEFAULT_INACTIVE_TIMEOUT * 60 * 1000; // Minute to milliseconds

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    const authState = _oktaAuth?.authStateManager?._authState;

    if (authState?.isAuthenticated) {
      AuthService.setAppAuthToken(authState);

      const redirectTo =
        sessionStorage.getItem('USER_ROLE') === 'SYSTEM_ADMIN'
          ? AppRoutes.pathUserManagement
          : AppRoutes.pathAdmin;

      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    }
  };

  return (
    <Security oktaAuth={oktaAuthObj} restoreOriginalUri={restoreOriginalUri}>
      <Suspense
        fallback={
          <div id={debugIds(ID.LOADER)}>
            <Loader type={'screen'} />
          </div>
        }>
        <Routes>
          <Route exact path={`${AppRoutes.pathPageLogin}`} element={<Login />} />
          <Route exact path={AppRoutes.pathPageLoginCallback} element={<LoginCallback />} />
          <Route
            exact
            path="*"
            element={
              <AuthorizedRoute>
                <IdleTimer timeout={timeout}>
                  <MainLayout />
                </IdleTimer>
              </AuthorizedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Security>
  );
};

export default Navigation;
