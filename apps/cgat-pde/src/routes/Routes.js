import { lazy, Suspense } from "react";
import { ADMIN_PATHS, PATHS } from "./constants";
import Home from "../pages/Home";
import { Route, Routes as ReactRoutes, Navigate } from "react-router-dom";
import SignUp from "../components/common/session/Signup.jsx";
import Layout from "./Layout.jsx";
import LoginForm from "../components/common/session/Login.jsx";

const AdminLayout = lazy(() => import("../pages/AdminLayout/index"))
const UsersEntryPoint = lazy(() =>
  import("@mfe/user-management").then((module) => ({ default: module.App }))
)
const OrdersEntryPoint = lazy(() => import("@mfe/order-management").then((module) => ({ default: module.App })));
const InventoryEntryPoint = lazy(() => import("@mfe/inventory-management").then((module) => ({ default: module.App })));
const OrganizationEntryPoint = lazy(() => import("@mfe/org-management").then((module) => ({ default: module.App })));


const Routes = () => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <ReactRoutes>
        <Route element={<Layout />}>
          <Route path={PATHS.home} element={<Home />} />
          <Route path={PATHS.orders} element={<OrdersEntryPoint />} />
          <Route path={PATHS.inventory} element={<InventoryEntryPoint />} />
          <Route path={PATHS.organization} element={<OrganizationEntryPoint />} />
          <Route path={PATHS.admin} element={<AdminLayout />}>
            <Route path={ADMIN_PATHS.users} element={<UsersEntryPoint />} />
          </Route>
        </Route>
        <Route path={PATHS.session}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path={PATHS.login} element={<LoginForm />} />
          <Route path={PATHS.signup} element={<SignUp />} />
        </Route>
      </ReactRoutes>
    </Suspense>
  );
};



export default Routes;
