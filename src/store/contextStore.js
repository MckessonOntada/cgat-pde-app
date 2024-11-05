import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

let htmlRoot = document.getElementById('HTMLRoot');
export let lang = htmlRoot ? htmlRoot.getAttribute('lang') : 'en';
//export let SF_ID = localStorage.getItem('SF_ID');
//export let refreshToken = localStorage.getItem('APP_REFRESH_TOKEN');
const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

let appdetails = {
  'app-version': '1.0',
  //'x-context-detail': `${localStorage.getItem('SR_ID')}::${localStorage.getItem('SP_ID')}`,
  'Content-Type': 'application/json;charset=utf-8',
  'Accept-Language': lang,
  //Authorization: localStorage.getItem('APP_AUTH_TOKEN'),
  'x-user-timezone': timeZone
};
const setAppDetails = () => {
  appdetails = {
    'app-version': '2.0',
    //'x-context-detail': `${localStorage.getItem('SR_ID')}::${localStorage.getItem('SP_ID')}`,
    'Content-Type': 'application/json;charset=utf-8',
    'Accept-Language': lang,
    //Authorization: localStorage.getItem('APP_AUTH_TOKEN'),
    'x-user-timezone': timeZone
  };
  //SF_ID = localStorage.getItem('SF_ID');
  lang = htmlRoot ? htmlRoot.getAttribute('lang') : 'en';
};
const ContainerDetailsProvider = createContext([
  appdetails,
  () => {
    setAppDetails();
  }
]);

export function ContainerDetails({ children }) {
  return (
    <ContainerDetailsProvider.Provider value={useState(appdetails)}>
      {children}
    </ContainerDetailsProvider.Provider>
  );
}
ContainerDetails.propTypes = {
  children: PropTypes.any.isRequired
};

export function useDetails() {
  return useContext(ContainerDetailsProvider);
}
