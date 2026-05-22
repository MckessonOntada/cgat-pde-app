import AppRoutes from './routes/AppRoutes';
import OktaHelper from './config/OktaHelper';
import { REACT_APP_OKTA_AUTH_SERVER_ID, REACT_APP_OKTA_BASE_URL, REACT_APP_OKTA_CLIENT_ID } from './config/AppConfig';

const OktaConfigLoader = (props) => {
  const { children } = props;
  const res = {
    baseUrl: REACT_APP_OKTA_BASE_URL,
    protocol: 'oauth2',
    authServerId: REACT_APP_OKTA_AUTH_SERVER_ID,
    clientId: REACT_APP_OKTA_CLIENT_ID,
    redirectUri: '/login/callback',
    endSessionRedirectUri: '/login',
    scopes: 'openid,email,profile,offline_access',
    state: {
      LANGUAGE: 'en'
    }
  };

  const finalConfig = {
    ...res,
    redirectUri: window.location.origin + AppRoutes.pathAppBase + res.redirectUri,
    issuer: [res.baseUrl, res.protocol, res.authServerId].join('/'),
    scopes: res.scopes.split(',')
  };
  OktaHelper.setConfiguration(finalConfig);
  OktaHelper.initOkta();

  return children;
};

export default OktaConfigLoader;
