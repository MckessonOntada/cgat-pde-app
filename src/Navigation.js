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

import { debugIds, ID } from '@src/constants/id';
import { DEFAULT_INACTIVE_TIMEOUT } from '@src/config/AppConfig';
import LoginCallback from './pages/LoginCallback/LoginCallback';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import NotFound from './pages/error-pages/NotFound';
import ForgotPassword from './pages/forgot-password/forgot-password';
import PublicRoute from './routes/PublicRoute';
import BroadcastHandler from './BroadcastHandler';
import { NotificationsProvider } from './mfe/notification-mfe/context/NotificationsContext';
import Faq from './pages/FooterPages/Faq';
import TermsToUse from './pages/FooterPages/TermsToUse';
import PrivacyNotice from './pages/FooterPages/PrivacyNotice';
import PrivacyNoticePage from './pages/FooterPages/PrivacyNoticeForStateSpecific.';
import ContactUs from './pages/FooterPages/ContactUs';
import ContactUsLoggedIn from './pages/FooterPages/ContactUs/ContactUsLoggedIn';
import Success from './pages/FooterPages/ContactUs/Success';

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
      sessionStorage.setItem('APP_AUTH_TOKEN', `${token.accessToken.tokenType} ${token.accessToken.accessToken}`);
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

      // const redirectTo =
      //   sessionStorage.getItem('USER_ROLE') === 'SYSTEM_ADMIN'
      //     ? AppRoutes.pathUserManagement
      //     : AppRoutes.pathAdmin;

      setTimeout(() => {
        navigate(AppRoutes.pathAppBase);
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
        <BroadcastHandler />
        <Routes>
          <Route exact path={`${AppRoutes.pathPageLogin}`} element={<Login />} />
          <Route exact path={AppRoutes.pathPageLoginCallback} element={<LoginCallback />} />
          <Route path={AppRoutes.pathContactSecure} element={<ContactUsLoggedIn />} />
          <Route path={AppRoutes.pathFaq} element={<Faq />} />
          <Route element={<PublicRoute />}>
            <Route exact path={`${AppRoutes.pathPageForgotPassword}`} element={<ForgotPassword />} />
            <Route path={AppRoutes.pathSignup} element={<SignUp />} />
            <Route path={`${AppRoutes.pathSignin}`} element={<SignIn />} />
            <Route path={AppRoutes.pathTermsOfUse} element={<TermsToUse />} />
            <Route path={AppRoutes.pathPrivacyNotice} element={<PrivacyNotice />} />
            <Route path={AppRoutes.pathContact} element={<ContactUs />} />
            <Route path={AppRoutes.pathContactSuccess} element={<Success />} />
            <Route path={AppRoutes.pathPrivacyNoticeForStateSpecificPrivacyLaws} element={<PrivacyNoticePage />} />
          </Route>

          <Route
            exact
            path="*"
            element={
              <AuthorizedRoute>
                <IdleTimer timeout={timeout}>
                  <NotificationsProvider>
                    <MainLayout />
                  </NotificationsProvider>
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
