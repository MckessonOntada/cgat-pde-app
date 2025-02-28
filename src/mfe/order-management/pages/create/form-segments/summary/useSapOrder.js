import OrderService from '@src/api/commonService/OrderService';
import React from 'react';
import { useQuery } from 'react-query';
import { StatusEnum } from '../../../orders/constants';

function useSapOrder(payload, onSuccess, onError) {
  const { sapOrderId, salesOrgId, status } = payload;
  console.log(sapOrderId && salesOrgId && status === 'SUBMITTED');
  return useQuery({
    queryKey: ['sap-order-status', sapOrderId, salesOrgId],
    queryFn: async () => OrderService.getOrderStatusFromSAP(sapOrderId, salesOrgId),
    onSuccess: (result) => {
      const { finalStatus } = result;
      if (finalStatus) onSuccess(finalStatus);
      else onError();
    },
    onError: () => {
      onError();
    },
    enabled: Boolean(sapOrderId && salesOrgId && status === 'SUBMITTED'),
    refetchOnWindowFocus: false
  });
}

export default useSapOrder;
