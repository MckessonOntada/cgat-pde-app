import React from 'react';
import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import { ORDER_TABS } from './config';

const useOrderCount = () => {
  const { data, isError } = useQuery({
    queryKey: ['summary', 'orderCount'],
    queryFn: async () => OrderService.getOrderCountByStatus(),
    cacheTime: 0
  });

  if (data && !isError) {
    const statusMap = {
      [ORDER_TABS.SUBMITTED_BUY_AND_BILL]: ['SUBMITTED'],
      [ORDER_TABS.PENDING_APPROVAL]: ['APPROVAL_PENDING'],
      [ORDER_TABS.PENDING_SUBMISSION]: ['DELETED', 'REJECTED', 'IN_DRAFT']
    };

    const result = Object.entries(statusMap).reduce((acc, [key, statuses]) => {
      acc[key] = statuses.reduce((sum, status) => {
        const entry = data.find((item) => item.status === status);
        return sum + (entry?.count || 0);
      }, 0);
      return acc;
    }, {});

    return result;
  }

  return {};
};

export default useOrderCount;
