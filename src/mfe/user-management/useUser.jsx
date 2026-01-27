import UserService from '@src/api/commonService/UserService';
import { useQuery } from 'react-query';

export default function useUser(userId, requestParams = {}, isPending = false) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => UserService.getUserDetails(userId, requestParams, isPending),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false
  });
}
