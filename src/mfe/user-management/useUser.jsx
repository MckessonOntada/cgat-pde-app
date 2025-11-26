import UserService from '@src/api/commonService/UserService';
import { useQuery } from 'react-query';

export default function useUser(userId, requestParams, isPending, select) {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => UserService.getUserDetails(userId, requestParams, isPending),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false
  });

  return {
    isLoading,
    data,
    refetch
  };
}
