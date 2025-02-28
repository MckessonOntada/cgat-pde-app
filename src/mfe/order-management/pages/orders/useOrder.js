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

  if (result.data) {
    Object.entries(result.data).forEach((entry) => {
      const [key, value] = entry;
      if (value === null) {
        result.data[key] = undefined;
      }
    });
  }

  return result;
};

export default useOrder;
