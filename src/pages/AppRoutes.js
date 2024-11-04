/**
 * File to store and export all routing  related information
 * for the application in a common place.
 */
import React from 'react';

const pathAppBase = '';
const pathPageLogin = '/login';
const pathPageLoginCallback = '/login/callback';

//TODO: Determine if Routes are cause of pages rerendering multiple times unnecessarily

const pathProjects = '/projects';
const projectList = React.lazy(() => import('./projects/Projects'));
const routeProjects = { path: pathProjects, element: projectList };


const routes = [
  pathAppBase,
  pathPageLogin,
  pathPageLoginCallback,
  routeProjects,
];

const AppRoutes = Object.freeze({
  routes,
  pathAppBase,
  pathPageLogin,
  pathPageLoginCallback,
  pathProjects,
});

export default AppRoutes;
