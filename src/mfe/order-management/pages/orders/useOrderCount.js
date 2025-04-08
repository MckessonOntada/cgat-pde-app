import React from 'react';
import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';

const useOrderCount = () => {
  const result = useQuery({
    queryKey: ['summary', 'orderCount'],
    queryFn: async () => OrderService.getOrderCountByStatus(),
    cacheTime: 0
  });

  return result;
};

export default useOrderCount;
