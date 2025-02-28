import AppRoutes from './routes/AppRoutes';
import OktaHelper from './config/OktaHelper';

const OktaConfigLoader = (props) => {
  const { children } = props;

  console.log('REACT_APP_OKTA_AUTH_SERVER_ID', process.env.REACT_APP_OKTA_AUTH_SERVER_ID);
  console.log('REACT_APP_OKTA_CLIENT_ID', process.env.REACT_APP_OKTA_CLIENT_ID);
  
  const res = {
    baseUrl: 'https://ikmg2.oktapreview.com',
    protocol: 'oauth2',
    authServerId: process.env.REACT_APP_OKTA_AUTH_SERVER_ID,
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
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
