import AppRoutes from './routes/AppRoutes';
import OktaHelper from './config/OktaHelper';
import { REACT_APP_OKTA_AUTH_SERVER_ID, REACT_APP_OKTA_BASE_URL, REACT_APP_OKTA_CLIENT_ID, REACT_APP_OKTA_LOGIN_URL } from './config/AppConfig';

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
    // clientId: "0oai0ea2r7JOHfVud1d7"
  };
  OktaHelper.setConfiguration(finalConfig);
  OktaHelper.initOkta();

  // const { status: idpConfigApiStatus } = useQuery('getIDPConfig', () => AuthService.getIDPConfig(), {
  //   onSuccess: (res) => {
  //     const finalConfig = {
  //       ...res,
  //       redirectUri: window.location.origin + AppRoutes.pathAppBase + res.redirectUri,
  //       issuer: [res.baseUrl, res.protocol, res.authServerId].join('/'),
  //       scopes: res.scopes.split(',')
  //       // clientId: "0oai0ea2r7JOHfVud1d7"
  //     };
  //     OktaHelper.setConfiguration(finalConfig);
  //     OktaHelper.initOkta();
  //   },
  //   refetchOnWindowFocus: false
  // });

  // if (idpConfigApiStatus === apiLoadingStatus.LOADING) {
  //   return <Loader type={'screen'} />;
  // }

  return children;
};

export default OktaConfigLoader;
