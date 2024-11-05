import { OktaAuth } from '@okta/okta-auth-js';

let oktaAuth = null;
let config = null;

const initOkta = () => {
  oktaAuth = new OktaAuth({
    ...config,
    cookies: {
      secure: true
    },
    tokenManager: {
      storage: 'sessionStorage'
    }
  });
};

const getOktaRootObject = () => {
  return oktaAuth;
};

const setConfiguration = (configuration) => {
  config = configuration;
};

const getConfiguration = () => {
  return config;
};

const OktaHelper = {
  initOkta: initOkta,
  getOktaRootObject: getOktaRootObject,
  setConfiguration: setConfiguration,
  getConfiguration: getConfiguration
};

export default OktaHelper;
