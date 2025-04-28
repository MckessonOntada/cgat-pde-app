import UserService from '@src/api/commonService/UserService';
import { useQuery } from 'react-query';
import { ORDER_TABS } from './config';

const useAssignee = (tabVariant, requestParams = {}) => {
  const result = useQuery({
    queryKey: ['assignee', requestParams.query],
    queryFn: async () => UserService.getAssignee(requestParams),
    enable: Boolean(tabVariant && tabVariant === ORDER_TABS.PENDING_APPROVAL)
  });

  return result;
};

export default useAssignee;
