import OrderService from '@src/api/commonService/OrderService';
import React from 'react';
import { useQuery } from 'react-query';

export function userOrderPrice(payload, error, callback) {
  const { therapyId, soldToAccountId, shipToAccountId, variant } = payload;
  return useQuery({
    queryKey: ['order', 'orderHeaderDetails', 'price', therapyId, soldToAccountId, shipToAccountId, variant],
    queryFn: async () => OrderService.getPriceDetails(therapyId, soldToAccountId, shipToAccountId, variant),
    enabled: !!therapyId && !!soldToAccountId && !!shipToAccountId && (!!variant || true),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      callback && callback(data);
    },
    onError: error && error
  });
}
