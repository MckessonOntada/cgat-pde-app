import React from "react";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import { PATHS } from "./constants";
import Home from "../pages/Dashboard";
import UserDetail from "../pages/UserDetail";
import CreateUser from "../pages/CreateUser";
import EditUser from "../pages/CreateUser";
import UserPermissions from "../pages/UserPermissions";
import AddAccounts from "../pages/AddAccounts";
import NotFound from "../../../pages/error-pages/NotFound";
import UploadUsers from "../pages/Dashboard/UploadUsers";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.dashboard} element={<Home />} />
      <Route path={PATHS.userDetail} element={<UserDetail />} />
      <Route path={PATHS.createUser} element={<CreateUser />} />
      <Route path={PATHS.uploadUser} element={<UploadUsers />} />
      <Route path={`${PATHS.editUser}/:userId`} element={<EditUser />} />
      <Route path={`${PATHS.userPermissions}/:userId`} element={<UserPermissions />} />
      <Route path={`${PATHS.addAccounts}/:userId`} element={<AddAccounts />} />
      <Route path={'*'} element={<NotFound />} />
    </ReactRoutes>
  );
};

export default Routes; 