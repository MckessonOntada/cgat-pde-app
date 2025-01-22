import React, { useState } from 'react';
import Routes from './routes/Routes';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ManageOrderProvider } from './context/ManageOrderContext';
import AuthUtils from '@src/util/AuthUtils';
import { CONFIG_MODULE_ROUTES } from './pages/system-configuration/constants';
import AppRoutes from '@src/routes/AppRoutes';

const OrderManagement = () => {
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isSystemAdmin && !location.pathname.includes(AppRoutes.pathSystemConfiguration)) navigate('/');
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
