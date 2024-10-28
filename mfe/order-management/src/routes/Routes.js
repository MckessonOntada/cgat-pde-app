 
 
import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import { PATHS } from "./constants";
import Home from "../pages/Dashboard"; 
const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.dashboard} element={<Home />} /> 
    </ReactRoutes>
  );
};

export default Routes;
