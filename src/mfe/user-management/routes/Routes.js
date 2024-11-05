import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import { PATHS } from "./constants";
import Home from "../pages/Dashboard";
import UserDetail from "../pages/UserDetail";
import CreateUser from "../pages/CreateUser";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.dashboard} element={<Home />} />
      <Route path={PATHS.userDetail} element={<UserDetail />} />
      <Route path={PATHS.createUser} element={<CreateUser />} />
    </ReactRoutes>
  );
};

export default Routes;
