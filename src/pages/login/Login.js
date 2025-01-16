import React, { useRef, useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignIn from '@okta/okta-signin-widget';
import { Heading } from '@mckesson/mcp-component-library';
import { debugIds, ID } from '@src/constants/id';
import AuthService from '@src/api/authService/AuthService';
import CommonService from '@src/api/commonService/CommonService';
import OktaHelper from '@src/config/OktaHelper';
import '@okta/okta-signin-widget/css/okta-sign-in.min.css';
import './assets/styles/Login.css';
import style from './assets/styles/Login.module.scss';
import useFetchQueryRetry from '@src/hooks/useFetchQueryRetry';
import AppLogo from '@src/assets/image/app-logo.svg';
import AuthUtils from '@src/util/AuthUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as McKessonLogo } from '@src/assets/image/McKesson_logo.svg';
import { useTranslate } from '@src/translations/useTranslation';
import Footer from './Footer';


const Login = () => {
  const widgetRef = useRef();
  const { t } = useTranslate();
  const [widgetReady, setWidgetReady] = useState(false); // TODO: What does this accomplish if state isn't being used?
  const {
    organization: { setOrganization, selectedOrganization }
  } = useSessionFeatures();
  let oktaConfig = OktaHelper.getConfiguration();
  let { oktaAuth } = useOktaAuth();
  const navigate = useNavigate();

  const { refetch: onPostUserLogin } = useFetchQueryRetry(
    [`postUserLogin`],
    async () => {
      /*post login*/
      //Fetching organization details if the loggedin user is not system admin.
      if (!AuthUtils.isSystemAdmin()) {
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

  useEffect(() => {
    if (!widgetRef.current) {
      return false;
    }

    const { issuer, clientId, redirectUri, scopes } = oktaConfig;

    const widget = new OktaSignIn({
      baseUrl: issuer.split('/oauth2')[0],
      clientId,
      redirectUri,
      logo: AppLogo,
      authParams: {
        issuer,
        scopes
      },
      // helpLinks: {
      //   custom: [
      //     {
      //       text: 'New User',
      //       href: '/signup',
      //       className: 'signup-link'
      //     }
      //   ]
      // },
      customButtons: [
        {
          title: 'NEW USER?',
          className: style.customSignUpButton,
          click: function () {
            navigate('/signup');
          }
        }
      ],
      features: {
        showPasswordToggleOnSignInPage: true,
        registration: true,
        rememberMe: true
      },
      i18n: {
        en: {
          'primaryauth.username.placeholder': 'Enter your username or email address',
          'password.forgot.email.or.username.placeholder': 'Enter your username or email address',
          'account.unlock.email.or.username.placeholder': 'Enter your username or email address',
          'errors.E0000004': 'Invalid email address or password',
          help: 'Need help signing in?'
        },
        es: {
          'primaryauth.username.placeholder': 's_Enter your username or email address',
          'password.forgot.email.or.username.placeholder': 's_Enter your username or email address',
          'account.unlock.email.or.username.placeholder': 's_Enter your username or email address',
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
        const userData = await validateTokenAndUpdateSessionStorage(response);
        if (response.status === 'SUCCESS') {
          if (userData.roleExist) {
            sessionStorage.setItem('sid', response.tokens.idToken.idToken);
            oktaAuth.handleLoginRedirect(response.tokens);
            onPostUserLogin(userData);
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

    const validateTokenAndUpdateSessionStorage = async (response) => {
      try {
        const accessToken = response.tokens.accessToken;
        sessionStorage.setItem('APP_AUTH_TOKEN', `${accessToken.tokenType} ${accessToken.accessToken}`);

        const userDetails = await CommonService.updateSessionStorage();

        return { ...userDetails, roleExist: true };
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
      <div className={`${style.loginWrap} max-container`}>
        <div className={style.loginHeader}>
          <McKessonLogo aria-hidden="true" focusable="false" title={t('company.logoAltText')} />
           <Heading as="h2"><span>{t('login.header.1')} </span>{t('login.header.2')}</Heading>
          <p><span>{t('login.page.desc.1')} </span>{t('login.page.desc.2')}</p>
        </div>
        <div className={style.loginContainor}>
          <p className={style.lWelcome}>{t('login.welcome')}</p>
          <Heading as="h3" className={style.lHead}>{t('login.ordringPortal')}</Heading>
          <p className={style.lDetails}>{t('login.details')}</p>
          <div className={'w-100'} ref={widgetRef} id={debugIds(ID.LOGIN, ID.WIDGET)}></div>
          <p className={style.lNote}><span>{t('login.note')}: </span>{t('login.details')}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
