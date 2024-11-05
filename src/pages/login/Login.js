import React, { useRef, useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignIn from '@okta/okta-signin-widget';

import { debugIds, ID } from '../../common/constants/id';
import AuthService from '../../api/authService/AuthService';
import CommonService from '../../api/commonService/CommonService';
import CommonUtils from '../../common/util/CommonUtils';
import OktaHelper from '../../config/OktaHelper';
import '@okta/okta-signin-widget/css/okta-sign-in.min.css';
import './assets/styles/Login.css';
import style from './assets/styles/Login.module.scss';
import useFetchQueryRetry from '../../common/hooks/useFetchQueryRetry';

const Login = () => {
  const widgetRef = useRef();
  const [widgetReady, setWidgetReady] = useState(false); // TODO: What does this accomplish if state isn't being used?

  let oktaConfig = OktaHelper.getConfiguration();
  let { oktaAuth } = useOktaAuth();
  const { refetch: onPostUserLogin } = useFetchQueryRetry(
    [`postUserLogin`],
    () => { /*post login*/ },
    {
      enabled: false,
      retry: 5
    }
  );

  useEffect(() => {
    if (!widgetRef.current) {
      return false;
    }

    const { issuer, clientId, redirectUri, scopes } = oktaConfig;

    const widget = new OktaSignIn({
      baseUrl: issuer.split('/oauth2')[0],
      clientId,
      redirectUri,
      // logo: OrgLogo, our logo
      authParams: {
        issuer,
        scopes
      },
      features: {
        showPasswordToggleOnSignInPage: true,
        registration: false,
        rememberMe: true
      },
      i18n: {
        en: {
          'primaryauth.username.placeholder': 'Email Address',
          'password.forgot.email.or.username.placeholder': 'Email Address',
          'account.unlock.email.or.username.placeholder': 'Email Address',
          'errors.E0000004': 'Invalid email address or password',
          help: 'Need help signing in?'
        },
        es: {
          'primaryauth.username.placeholder': 's_Email Address',
          'password.forgot.email.or.username.placeholder': 's_Email Address',
          'account.unlock.email.or.username.placeholder': 's_Email Address',
          'errors.E0000004': 's_Invalid email address or password',
          help: 'S_Need help signing in?'
        }
      },
      transformUsername: (username) => {
        sessionStorage.setItem('okta-widget-username', username);
        return username;
      }
    });

    widget.renderEl(
      { el: widgetRef.current },
      async (response) => {
        const hasRole = await checkUserRole(response);
        if (response.status === 'SUCCESS') {
          if (hasRole) {
            sessionStorage.setItem('sid', response.tokens.idToken.idToken);
            oktaAuth.handleLoginRedirect(response.tokens);
            onPostUserLogin();
          } else {
            const customErrorMessage = 'Please reach out to IT team for access.';
            let formTag = document.getElementsByTagName('form');
            if (formTag.length > 0) {
              formTag[0].innerHTML = `
                  <div data-se="o-form-content" class="o-form-content o-form-theme clearfix">
                    <div class="o-form-info-container"></div>
                    <div class="o-form-error-container" data-se="o-form-error-container" role="alert">
                      <div class="ion-messages-container"></div>
                      <div data-se="callout" class="infobox clearfix infobox-error">
                        <span data-se="icon" class="icon error-16"></span>
                        <div>${customErrorMessage}</div>
                      </div>
                    </div>
                    <div class="o-form-fieldset-container" data-se="o-form-fieldset-container"></div>
                  </div>`;
            } else {
              logout();
            }
          }
        } else {
          console.error('Authentication failed:', response);
        }
      },
      (err) => {
        throw err;
      }
    );

    const logout = () => {
      AuthService.userLogout(oktaAuth);
    };

    const checkUserRole = async (response) => {
      try {
        const accessToken = response.tokens.accessToken;
        sessionStorage.setItem(
          'APP_AUTH_TOKEN',
          `${accessToken.tokenType} ${accessToken.accessToken}`
        );

        const decodedResponse = await CommonService.getJwtDecode();
        const roles = decodedResponse['roles'];
        const username = decodedResponse['userName'];
        const userId = decodedResponse['userId'];

        if (CommonUtils.isNonEmptyArray(roles) && username) {
          sessionStorage.setItem('USER_ROLE', roles[0]);
          sessionStorage.setItem('USERNAME', username);
          sessionStorage.setItem('USER_ID', userId);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        throw Error(error);
      }
    };

    widget.on('ready', () => {
      setWidgetReady(true);
    });

    widget.on('afterRender', (aa) => {
      const forgotPasswordLink = document.querySelector('.auth-footer .js-forgot-password');
      if (forgotPasswordLink) {
        forgotPasswordLink.style.display = 'none';
      }
      const helpLink = document.querySelector('.auth-footer .js-help');
      if (helpLink) {
        helpLink.style.display = 'none';
      }
    });

    // Clean up the OktaSignIn instance on component unmount
    return () => {
      widget.remove();
    };
  }, [oktaAuth]);

  return (
    <div className={style.oktaRoot} id={debugIds(ID.LOGIN, ID.CONTAINER)}>
      <div className={'w-100'} ref={widgetRef} id={debugIds(ID.LOGIN, ID.WIDGET)}></div>
    </div>
  );
};

export default Login;
