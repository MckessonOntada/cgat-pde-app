import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';

const useOrder = (orderId) => {
  const result = useQuery({
    queryKey: ['summary', orderId],
    queryFn: async () => OrderService.getOrderById(orderId),
    enabled: Boolean(orderId)
  });

  return result;
};

export default useOrder;
