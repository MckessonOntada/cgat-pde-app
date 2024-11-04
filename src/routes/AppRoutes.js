/**
 * File to store and export all routing  related information
 * for the application in a common place.
 */
import React from 'react';

const pathAppBase = '';
const pathPageLogin = '/login';
const pathPageLoginCallback = '/login/callback';

//TODO: Determine if Routes are cause of pages rerendering multiple times unnecessarily

const pathAdmin = '/admin';
const AdminPage = React.lazy(() => import('../pages/Admin'));
const routeAdmin = { path: pathAdmin, element: AdminPage };

const pathUserManagement = '/user'
const UserPage = React.lazy(() => import('../mfe/user-management'))
const routeUserManagement = { path: pathUserManagement, element: UserPage}

const routes = [
  pathAppBase,
  pathPageLogin,
  pathPageLoginCallback,
  routeAdmin,
  routeUserManagement
];

const AppRoutes = Object.freeze({
  routes,
  pathAppBase,
  pathPageLogin,
  pathPageLoginCallback,
  pathAdmin,
  pathUserManagement
});

export default AppRoutes;
