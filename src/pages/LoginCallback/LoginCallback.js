import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import CommonService from '../../api/commonService/CommonService';
import CommonUtils from '@src/util/CommonUtils';
import AuthService from '../../api/authService/AuthService';
import { Loader, Button } from '@mckesson/mcp-component-library';
import ErrorComponent from '../../components/error/ErrorComponent';
import useFetchQueryRetry from '@src/hooks/useFetchQueryRetry';
import AuthUtils from '@src/util/AuthUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSessionFeatures from '@src/hooks/useSessionFeatures';

const LoginCallback = () => {
  let { oktaAuth } = useOktaAuth();
  const [isFetched, setIsFetched] = useState(false);
  const {
    organization: { setOrganization, selectedOrganization }
  } = useSessionFeatures();
  const [error, setError] = useState({
    isError: false,
    header: 'Please reach out to IT team for access.',
    body: ''
  });

  const { refetch: onPostUserLogin } = useFetchQueryRetry(
    [`postUserLogin`],
    async () => {
      /*post login*/
      //Fetching organization details if the loggedin user is not system admin.
      if (!AuthUtils.isSystemAdmin() && !AuthUtils.isCustomerCenter() && !AuthUtils.isTreatmentCentreExecutive()) {
        const _practiceId = AuthUtils.getPracticeId();
        const res = await HttpResourceService.callRest(`${ApiRoutes.PUBLIC_ORGANIZATIONS}/${_practiceId}`, httpVerb.GET, {});
        if (res?.data) {
          setOrganization(res.data);
        }
      }
    },
    {
      enabled: false,
      retry: 5
    }
  );

  const checkUserRole = async (response) => {
    try {
      const accessToken = response.accessToken;
      sessionStorage.setItem('APP_AUTH_TOKEN', `${accessToken.tokenType} ${accessToken.accessToken}`);

      const decodedResponse = await CommonService.getLoggedInUser();
      if (!decodedResponse) {
        setIsFetched(true);
        setError({ ...error, isError: true });
        return false;
      }
      const roles = decodedResponse['role']['name'];
      const username = decodedResponse['userName'];
      const userId = decodedResponse['id'];
      const activeUserPermissions = decodedResponse['permissions'];
      const roleId = decodedResponse['role']['id'];
      const userFullName = `${decodedResponse?.name.lastName}, ${decodedResponse?.name.firstName}${
        decodedResponse?.name.middleName ? ' ' + decodedResponse.name.middleName : ''
      }`;
      const activeUserPracticeId = decodedResponse['practiceId'];
      const channelType = decodedResponse['channelType'];

      if (username) {
        sessionStorage.setItem('USER_ROLE', roles);
        sessionStorage.setItem('USERNAME', username);
        sessionStorage.setItem('USER_ID', userId);
        sessionStorage.setItem('USER_PERMISSIONS', activeUserPermissions);
        sessionStorage.setItem('USER_FULL_NAME', userFullName);
        sessionStorage.setItem('ROLE_ID', roleId);
        if (roles === 'Customer Centre') {
          sessionStorage.setItem('CHANNEL_TYPE', channelType);
        }
        if (roles !== 'System Administrator' && roles !== 'Customer Centre' && roles !== 'Treatment Centre Executive') {
          AuthUtils.setPracticeId(activeUserPracticeId);
        }
        return true;
      } else {
        setIsFetched(true);
        setError({ ...error, isError: true });
        return false;
      }
    } catch (err) {
      setIsFetched(true);
      setError({ ...error, isError: true });
      console.error(err);
    }
  };

  const logout = () => {
    AuthService.userLogout(oktaAuth);
  };

  const handleMagicLinkLogin = async (otp, state) => {
    try {
      //OPTIONAL: Validate same browser
      const storedState = sessionStorage.getItem('okta-state');

      if (storedState && storedState !== state) {
        setError({
          ...error,
          isError: true,
          header: 'Please use the same browser/device or enter OTP manually.'
        });
        setIsFetched(true);
        return;
      }

      // 👉 Call Okta IDX API to verify OTP
      const transaction = await oktaAuth.idx.parseEmailVerifyCallback({
        otp: otp,
        state: state
      });

      if (transaction.status === 'SUCCESS') {
        const tokens = transaction.tokens;

        const hasRole = await checkUserRole(tokens);

        sessionStorage.setItem('sid', tokens?.idToken?.idToken || '');

        onPostUserLogin();

        if (hasRole) {
          oktaAuth.handleLoginRedirect(tokens);
        } else {
          setError({ ...error, isError: true });
        }
      } else {
        setError({
          ...error,
          isError: true,
          header: 'Invalid or expired magic link. Please try again.'
        });
      }

      setIsFetched(true);
    } catch (err) {
      console.error(err);
      setError({
        ...error,
        isError: true,
        header: 'Magic link authentication failed.'
      });
      setIsFetched(true);
    }
  };

  const handleRedirect = async () => {
    try {
      const searchParams = new URL(window.location.href).searchParams;

      const otp = searchParams.get('otp');
      const state = searchParams.get('state');
      debugger;
      // 👉 MAGIC LINK FLOW
      if (otp && state) {
        await handleMagicLinkLogin(otp, state);
        return;
      }
      const { tokens } = await oktaAuth.token.parseFromUrl();
      const sessionUserName = sessionStorage.getItem('okta-widget-username').toLocaleLowerCase();
      sessionStorage.removeItem('okta-widget-username');
      if (tokens) {
        const hasRole = await checkUserRole(tokens);
        sessionStorage.setItem('sid', tokens?.idToken?.idToken || '');
        const userInfo = await oktaAuth.token.getUserInfo(tokens.accessToken, tokens.idToken);
        onPostUserLogin();
        if (userInfo.email.toLocaleLowerCase() !== sessionUserName) {
          setError({
            ...error,
            isError: true,
            header: 'Login failed, new user on shared device detected. Please close and re-open the browser to continue.'
          });
          setIsFetched(true);
          return;
        }
        if (hasRole) {
          setIsFetched(true);
          oktaAuth.handleLoginRedirect(tokens);
        } else {
          setError({ ...error, isError: true });
          setIsFetched(true);
        }
      }
    } catch (err) {
      setIsFetched(true);
      setError({ ...error, isError: true });
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleRedirect();
      } catch (err) {
        setIsFetched(true);
        setError({ ...error, isError: true });
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {!isFetched && <Loader variant="text" type="screen" />}
      {error.isError && (
        <ErrorComponent
          variant="center"
          type="text"
          header={error.header}
          body={error.body}
          bodyFooter={
            <Button
              onClick={() => {
                logout();
              }}>
              Back to Sign In
            </Button>
          }
        />
      )}
    </div>
  );
};

export default LoginCallback;
