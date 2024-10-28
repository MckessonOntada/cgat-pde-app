import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PATHS } from "../../routes";
import Dashboard from "./Dashboard";

export default function AdminLayout(){
    const { pathname } = useLocation();
    return <div id="admin-layout">
        {
            pathname === PATHS.admin && <Dashboard />
        }
        <Outlet />
    </div>
}