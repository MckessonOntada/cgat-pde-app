import OrderService from '@src/api/commonService/OrderService';

const { useQuery } = require('react-query');

const useOrderList = ({ params = {}, onSuccess = () => {} }) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => OrderService.getOrders(params),
    onSuccess,
    onError: console.log,
    enabled: Boolean(params.pageNo) && Number.isInteger(params)
  });
};

export default useOrderList;
