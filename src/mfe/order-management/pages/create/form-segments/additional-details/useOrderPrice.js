import React from 'react';
import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import { CHANNEL_TYPE } from '../Constants';

export function useOrderPrice(payload, error, callback) {
  const { trade = {}, soldToAccountId, shipToAccountId, variant, channelType } = payload;
  const isEnabled = !!trade.ndc && !!soldToAccountId && !!shipToAccountId && channelType === CHANNEL_TYPE.BUY_AND_BILL;

  return useQuery({
    queryKey: ['order', 'orderHeaderDetails', 'price', trade.ndc, soldToAccountId, shipToAccountId, variant || 'default-variant'],
    queryFn: async () => OrderService.getPriceDetails(trade.ndc, soldToAccountId, shipToAccountId, variant),
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      callback && callback(data);
    },
    onError: error && error
  });
}
