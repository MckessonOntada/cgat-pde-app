/**
 * File to store and export all routing  related information
 * for the application in a common place.
 */
import React from 'react';
import { RoutePaths } from './constants';


//TODO: Determine if Routes are cause of pages rerendering multiple times unnecessarily

const dashBoardPage = React.lazy(() => import('../pages/Admin'));
const routeAdmin = { path: RoutePaths.pathAppBase, element: dashBoardPage };

const routes = [
  RoutePaths.pathAppBase,
  RoutePaths.pathPageLogin,
  RoutePaths.pathPageLoginCallback,
  routeAdmin
];

const AppRoutes = Object.freeze({
  routes,
  ...RoutePaths
});

export default AppRoutes;
