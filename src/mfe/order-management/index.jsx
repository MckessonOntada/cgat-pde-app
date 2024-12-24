import React, { useState } from 'react';
import Routes from './routes/Routes';
import { Outlet } from 'react-router-dom';
import { ManageOrderProvider } from './context/ManageOrderContext';

const OrderManagement = () => {
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
