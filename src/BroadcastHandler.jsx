import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect } from 'react';
import AuthService from './api/authService/AuthService';

function BroadcastHandler(props) {
  const { oktaAuth } = useOktaAuth();

  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel');

    channel.onmessage = (event) => {
      if (event.data.type === 'LOGOUT') {
        AuthService.userLogout(oktaAuth);
      }
    };

    return () => channel.close();
  }, []);
  return <></>;
}
export default BroadcastHandler;
