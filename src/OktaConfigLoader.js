import React from 'react';
import { useQuery } from 'react-query';

import { Loader } from '@mckesson/mcp-component-library';
import AuthService from './api/authService/AuthService';
import { apiLoadingStatus } from './api/HttpResourceService';
import AppRoutes from './routes/AppRoutes';

import OktaHelper from './config/OktaHelper';

const OktaConfigLoader = (props) => {
  const { children } = props;

  const { status: idpConfigApiStatus } = useQuery(
    'getIDPConfig',
    () => AuthService.getIDPConfig(),
    {
      onSuccess: (res) => {
        const finalConfig = {
          ...res,
          redirectUri: window.location.origin + AppRoutes.pathAppBase + res.redirectUri,
          issuer: [res.baseUrl, res.protocol, res.authServerId].join('/'),
          scopes: res.scopes.split(','),
          // clientId: "0oai0ea2r7JOHfVud1d7"
        };
        OktaHelper.setConfiguration(finalConfig);
        OktaHelper.initOkta();
      }
    }
  );

  if (idpConfigApiStatus === apiLoadingStatus.LOADING) {
    return <Loader type={'screen'} />;
  }

  return children;
};

export default OktaConfigLoader;
