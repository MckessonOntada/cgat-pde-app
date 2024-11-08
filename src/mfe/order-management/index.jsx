import React, { useState } from 'react';
import Routes from './routes/Routes';
import { Outlet } from 'react-router-dom';

const OrderManagement = () => {
    return (
        <div>
            <Routes />
            <Outlet />
        </div>
    )
}

export default OrderManagement;




