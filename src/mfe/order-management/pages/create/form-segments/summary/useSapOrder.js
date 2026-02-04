import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import { ORDER_STATUS } from '../../../orders/config';

function useSapOrder(payload, onSuccess, onError) {
  const { sapOrderId, salesOrgId, status, isSPOrder } = payload;

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
    enabled: Boolean(!isSPOrder && sapOrderId && salesOrgId && !isCustomerCentreUser && status === ORDER_STATUS.SUBMITTED),
    refetchOnWindowFocus: false
  });

  return { data, isLoading, refetch };
}

export default useSapOrder;
