import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import { StatusEnum } from '../../../orders/constants';

function useSapOrder(payload, onSuccess, onError) {
  const { sapOrderId, salesOrgId, status } = payload;

  const { data, isLoading, refetch } = useQuery({
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
    enabled: Boolean(sapOrderId && salesOrgId && status === StatusEnum.SUBMITTED),
    refetchOnWindowFocus: false
  });

  return { data, isLoading, refetch };
}

export default useSapOrder;
