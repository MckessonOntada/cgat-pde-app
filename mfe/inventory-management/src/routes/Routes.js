import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import { PATHS } from "./constants";
import Home from "../pages/Home";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.home} element={<Home />} />
      {/* Add new routes here */}
    </ReactRoutes>
  );
};

export default Routes;
