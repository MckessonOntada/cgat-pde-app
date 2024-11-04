import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import AppRoutes from "../../routes/AppRoutes";

export default function Admin(){
    const { pathname } = useLocation();
    return <div id="admin-layout">
        {
            pathname === AppRoutes.pathAdmin && <Dashboard />
        }
        <Outlet />
    </div>
}