/**
 * File to store and export all routing  related information
 * for the application in a common place.
 */
import React from 'react';
import { RoutePaths } from './constants';
import { Outlet } from 'react-router-dom';

//TODO: Determine if Routes are cause of pages rerendering multiple times unnecessarily

const AdminPage = React.lazy(() => import('../pages/Admin'));
const routeAdmin = { path: RoutePaths.pathAdmin, element: AdminPage };

const UserPage = React.lazy(() => import('../mfe/user-management'))
// const routeUserManagement = { path: RoutePaths.pathUserManagement, element: Outlet, childr}

const routes = [
  RoutePaths.pathAppBase,
  RoutePaths.pathPageLogin,
  RoutePaths.pathPageLoginCallback,
  routeAdmin,
  // routeUserManagement
];

const AppRoutes = Object.freeze({
  routes,
  ...RoutePaths
});

export default AppRoutes;
