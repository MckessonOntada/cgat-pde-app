import React, { useState } from 'react';
import Routes from './routes/Routes';
import { Outlet } from 'react-router-dom';
import { OrderProvider } from './context';

const OrderManagement = () => {
    return (
        <div>
            <OrderProvider>
                <Routes />
                <Outlet />
            </OrderProvider>
        </div>
    )
}

export default OrderManagement;




