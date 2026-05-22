import HttpResourceService, { httpVerb, defaultHeaders } from '../HttpResourceService';
import ApiRoutes from '../ApiRoutes';
import AppRoutes from '../../routes/AppRoutes';

const getAppAuthToken = () => sessionStorage.getItem('APP_AUTH_TOKEN');

const setAppAuthToken = (authState) => {
  sessionStorage.setItem('APP_AUTH_TOKEN', `${authState.accessToken.tokenType} ${authState.accessToken.accessToken}`);
};

const clearLocalStorage = () => {
  sessionStorage.clear();
};

const removeAuthDetails = () => {
  localStorage.clear();
  sessionStorage.clear();
};

const routeToLogin = () => {
  removeAuthDetails();
};

const setLanguage = (data) => {
  localStorage.setItem('APP_LOCALE', data);
};

const getIDPConfig = async () => {
  try {
    const { data } = await HttpResourceService.callRest(ApiRoutes.GET_CGAT_PDE_OKTA_CONFIG, httpVerb.GET, null, defaultHeaders, false, true);
    return data;
  } catch (error) {
    throw Error('Unable to fetch practice okta details.', error);
  }
};

const userLogout = async (oktaAuth) => {
  removeAuthDetails();
  oktaAuth.tokenManager.clear();
  oktaAuth.signOut({
    postLogoutRedirectUri: `${window.location.origin}${AppRoutes.pathPageLogin}`
  });
};

const AuthService = Object.freeze({
  getIDPConfig,
  getAppAuthToken,
  clearLocalStorage,
  removeAuthDetails,
  routeToLogin,
  setLanguage,
  setAppAuthToken,
  userLogout
});

export default AuthService;
