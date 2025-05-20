/**
 * File to store and export all routing  related information
 * for the application in a common place.
 */
import React from 'react';
import { RoutePaths } from './constants';

//TODO: Determine if Routes are cause of pages rerendering multiple times unnecessarily

const dashBoardPage = React.lazy(() => import('@src/mfe/core-config/system-admin'));
const routeDashBoard = { path: RoutePaths.pathAppBase, element: dashBoardPage, isDashboard: true };

const routes = [RoutePaths.pathAppBase, RoutePaths.pathPageLogin, RoutePaths.pathPageLoginCallback, routeDashBoard];

const AppRoutes = Object.freeze({
  routes,
  ...RoutePaths
});

export default AppRoutes;
