import OrderService from '@src/api/commonService/OrderService';
import React from 'react';
import { useQuery } from 'react-query';

export function useOrderPrice(payload, error, callback) {
  const { therapyId, soldToAccountId, shipToAccountId, variant } = payload;
  const isEnabled = !!therapyId && !!soldToAccountId && !!shipToAccountId;

  return useQuery({
    queryKey: ['order', 'orderHeaderDetails', 'price', therapyId, soldToAccountId, shipToAccountId, variant || 'default-variant'],
    queryFn: async () => OrderService.getPriceDetails(therapyId, soldToAccountId, shipToAccountId, variant),
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      callback && callback(data);
    },
    onError: error && error
  });
}
