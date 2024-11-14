import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import { PATHS } from "./constants";
import Home from "../pages/Dashboard";
import UserDetail from "../pages/UserDetail";
import CreateUser from "../pages/CreateUser";
import EditUser from "../pages/CreateUser";
import UserPermissions from "../pages/UserPermissions";
import AddAccounts from "../pages/AddAccounts";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.dashboard} element={<Home />} />
      <Route path={PATHS.userDetail} element={<UserDetail />} />
      <Route path={PATHS.createUser} element={<CreateUser />} />
      <Route path={PATHS.editUser} element={<EditUser />} />
      <Route path={PATHS.userPermissions} element={<UserPermissions />} />
      <Route path={PATHS.addAccounts} element={<AddAccounts />} />
    </ReactRoutes>
  );
};

export default Routes; 