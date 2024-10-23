import { Route, Routes as ReactRoutes } from "react-router-dom";
import { PATHS } from "./constants";
import Home from "../pages/Home";
import {App as UsersEntryPoint} from "@mfe/user-management";
import OrdersEntryPoint from "@mfe/order-management";
import InventoryEntryPoint from "@mfe/inventory-management";
import OrganizationEntryPoint from "@mfe/org-management";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route path={PATHS.home} element={<Home />} />
      <Route path={PATHS.users} element={<UsersEntryPoint />} />
      <Route path={PATHS.orders} element={<OrdersEntryPoint />} />
      <Route path={PATHS.inventory} element={<InventoryEntryPoint />} />
      <Route path={PATHS.organization} element={<OrganizationEntryPoint />} />
      {/* Add new routes here */}
    </ReactRoutes>
  );
};

export default Routes;
