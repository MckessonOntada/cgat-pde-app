import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import CommonService from '../../api/commonService/CommonService';
import CommonUtils from '@src/util/CommonUtils';
import AuthService from '../../api/authService/AuthService';
import { Loader, Button } from '@mckesson/mcp-component-library';
import ErrorComponent from '../../components/error/ErrorComponent';
import useFetchQueryRetry from '@src/hooks/useFetchQueryRetry';

const LoginCallback = () => {
  let { oktaAuth } = useOktaAuth();
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState({
    isError: false,
    header: 'Please reach out to IT team for access.',
    body: ''
  });

  const { refetch: onPostUserLogin } = useFetchQueryRetry(
    [`postUserLogin`],
    () => {
      /* Post login */
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
      const roles = decodedResponse['roles'];
      const username = decodedResponse['userName'];
      const userId = decodedResponse['userId'];

      if (CommonUtils.isNonEmptyArray(roles) && username) {
        sessionStorage.setItem('USER_ROLE', roles[0]);
        sessionStorage.setItem('USERNAME', username);
        sessionStorage.setItem('USER_ID', userId);
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

  const handleRedirect = async () => {
    try {
      const { tokens } = await oktaAuth.token.parseFromUrl();
      const sessionUserName = sessionStorage.getItem('okta-widget-username').toLocaleLowerCase();
      sessionStorage.removeItem('okta-widget-username');
      if (tokens) {
        const hasRole = await checkUserRole(tokens);
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
