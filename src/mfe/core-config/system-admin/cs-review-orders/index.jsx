import { OrderProvider } from '@src/mfe/order-management/context/OrderContext';
import OrderIndex from '@src/mfe/order-management/pages/orders';
import React from 'react';

export const CSReviewOrders = () => {
  return (
    <OrderProvider isCSReviewOrdersPage={true}>
      <OrderIndex isCSReviewOrdersPage={true} />
    </OrderProvider>
  );
};
