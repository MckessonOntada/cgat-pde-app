import React from "react";
import { Routes } from "./routes";
import { UserProvider } from './context/UserContext';

const UserManagement = () => {
  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
};

export default UserManagement;
