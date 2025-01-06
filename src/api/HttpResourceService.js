import axios from 'axios';
import ApiRoutes from './ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';

const axiosInstance = axios.create({});

export const httpVerb = {
  GET: 'get',
  POST: 'post',
  PATCH: 'patch',
  PUT: 'put',
  DELETE: 'delete'
};

export const apiLoadingStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success'
};

export const defaultHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
  'Accept-Language': 'en',
  userId: 1
};

export const authToken = (noHeader, noSidHeader) => {
  if (noHeader) {
    return {};
  }

  const headers = {
    Authorization: sessionStorage.getItem('APP_AUTH_TOKEN') ? `${sessionStorage.getItem('APP_AUTH_TOKEN')}` : ''
  };

  const sessionId = sessionStorage.getItem('sid');

  const impersonateId = AuthUtils.getImpersonateId();
  if (impersonateId) {
    headers['x-imp-user-id'] = impersonateId;
  }

  if (!noSidHeader && sessionId) {
    headers['Session-Id'] = sessionId;
  }

  return headers;
};

const callRest = function (
  endpoint,
  httpVerb = 'get',
  data,
  headers,
  noHeader = false,
  noSidHeader = false,
  responseType = 'json',
  successCallback = (resp) => resp,
  errorCallback = (err) => {
    console.log(err);
  }
) {
  const customHeaders = { ...headers };

  headers = {
    ...defaultHeaders,
    ...customHeaders,
    ...authToken(noHeader, noSidHeader)
  };

  const response = axios.request({
    method: httpVerb,
    url: `${endpoint}`,
    headers,
    data,
    responseType
  });

  response.then(
    (resp) => successCallback(resp),
    (err) => {
      if (err.response && err.response.status === 401) {
        //AuthService.routeToLogin(); TODO: Route to Login
      }
      errorCallback(err);
    }
  );

  return response;
};

const HttpResourceService = Object.freeze({
  callRest,
  defaultHeaders,
  apiLoadingStatus
});

export default HttpResourceService;
