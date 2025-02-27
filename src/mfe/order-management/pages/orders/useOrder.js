import React from 'react';
import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import { Loader } from '@mckesson/mcp-component-library';

const useOrder = (orderId) => {
  const result = useQuery({
    queryKey: ['summary', orderId],
    queryFn: async () => OrderService.getOrderById(orderId),
    cacheTime: 0,
    enabled: Boolean(orderId)
  });

  if (result.isFetching) {
    return { isLoader: <Loader type={'screen'} /> };
  }
  return result;
};

export default useOrder;
