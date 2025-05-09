import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import { ORDER_STATUS, ORDER_TABS } from './config';
import { CHANNEL_TYPE } from '../create/form-segments/Constants';

const useOrderCount = () => {
  const { data, isError } = useQuery({
    queryKey: ['summary', 'orderCount'],
    queryFn: async () => OrderService.getOrderCountByStatus(),
    cacheTime: 0
  });

  if (data && !isError) {
    const result = {
      [ORDER_TABS.SUBMITTED_BUY_AND_BILL]: 0,
      [ORDER_TABS.SUBMITTED_SP]: 0,
      [ORDER_TABS.PENDING_APPROVAL]: 0,
      [ORDER_TABS.PENDING_SUBMISSION]: 0
    };

    data.forEach(
      ({ status, channelType = CHANNEL_TYPE.BUY_AND_BILL, count }) => {
        switch (status) {
          case ORDER_STATUS.SUBMITTED:
            if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
              result[ORDER_TABS.SUBMITTED_BUY_AND_BILL] += count;
            } else if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
              result[ORDER_TABS.SUBMITTED_SP] += count;
            }
            break;

          case ORDER_STATUS.APPROVAL_PENDING:
            result[ORDER_TABS.PENDING_APPROVAL] += count;
            break;

          case ORDER_STATUS.IN_DRAFT:
          case ORDER_STATUS.DELETED:
          case ORDER_STATUS.REJECTED:
            result[ORDER_TABS.PENDING_SUBMISSION] += count;
            break;

          default:
            break;
        }
      }
    );

    return result;
  }

  return null;
};

export default useOrderCount;
