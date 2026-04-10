import React from 'react';
import axios from 'axios';
import ApiRoutes from './ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';
import store from '@src/store/store';
import { openModal } from '@src/store/reducer/modalReducer';
import { Button } from '@mckesson/mcp-component-library';
import { v4 as uuidv4 } from 'uuid';

const axiosInstance = axios.create({});
const channel = new BroadcastChannel('auth_channel');

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
  'X-Correlation-Id': uuidv4(),
  userId: 1
};

export const authToken = (noHeader, noSidHeader, noImpersonation) => {
  if (noHeader) {
    return {};
  }

  const headers = {
    Authorization: sessionStorage.getItem('APP_AUTH_TOKEN') ? `${sessionStorage.getItem('APP_AUTH_TOKEN')}` : ''
  };

  const sessionId = sessionStorage.getItem('sid');

  if (!noImpersonation) {
    const impersonateId = AuthUtils.getImpersonateId();
    if (impersonateId) {
      headers['x-imp-user-id'] = impersonateId;
    }
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
  noImpersonation = false,
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
    ...authToken(noHeader, noSidHeader, noImpersonation)
  };

  const response = axios.request({
    method: httpVerb,
    url: `${endpoint}`,
    headers,
    data,
    responseType
  });

  axios.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      'X-Correlation-Id': uuidv4()
    };

    return config;
  });

  response.then(
    (resp) => successCallback(resp),
    (err) => {
      if (err.response && err.response.status === 401) {
        //AuthService.routeToLogin(); TODO: Route to Login
        //logOutUnAuthorizedUser(err);
        console.log(endpoint, err);
      }
      errorCallback(err);
    }
  );

  return response;
};

const logOutUnAuthorizedUser = (err) => {
  let ignorableURLs = [ApiRoutes.GET_CURRENT_USER];
  let _ignoreLogout = ignorableURLs.some((item) => item === err.request.responseURL);
  if (!_ignoreLogout) {
    const state = {
      title: 'Alert Message',
      body: (
        <div className="MCP-modal-body">
          <p>Your session has expired. Please log in again.</p>
        </div>
      ),
      footer: (
        <div className="controls">
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              channel.postMessage({ type: 'LOGOUT' });
            }}>
            OK
          </Button>
        </div>
      ),
      onClose: () => {
        channel.postMessage({ type: 'LOGOUT' });
      }
    };

    store.dispatch(openModal(state));
  }
};

const HttpResourceService = {
  callRest,
  defaultHeaders,
  apiLoadingStatus
};

export default HttpResourceService;
