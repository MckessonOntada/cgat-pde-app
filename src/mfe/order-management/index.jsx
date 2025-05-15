import React, { useState } from 'react';
import Routes from './routes/Routes';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ManageOrderProvider } from './context/ManageOrderContext';
import AuthUtils from '@src/util/AuthUtils';
import { CONFIG_MODULE_ROUTES } from '../core-config/constants';
import AppRoutes from '@src/routes/AppRoutes';
import { PERMISSIONS_ENUM } from '../user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';

const OrderManagement = () => {
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isSystemAdmin && !location.pathname.includes(AppRoutes.pathSystemConfiguration) && !isCustomerCenter) navigate('/');
  }, []);

  return (
    <div>
      <ManageOrderProvider>
        <Routes />
        <Outlet />
      </ManageOrderProvider>
    </div>
  );
};

export default OrderManagement;
