import React from 'react';
import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import { Loader } from '@mckesson/mcp-component-library';
import { useNavigate } from 'react-router-dom';

const useOrder = (orderId) => {
  const navigate = useNavigate();

  const result = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => OrderService.getOrderById(orderId),
    cacheTime: 0,
    enabled: Boolean(orderId),
    select: (result) => {
      if (result) {
        Object.entries(result).forEach((entry) => {
          const [key, value] = entry;
          if (value === null) {
            result[key] = undefined;
          }
        });
        const { accountDetails, provider } = result;
        if (accountDetails?.soldToAccount?.channelType) {
          result.channelType = accountDetails.soldToAccount.channelType;
        }
        if (provider) {
          provider.id = +provider.id;
        }
      }

      return result;
    },
    onError: (error) => {
      if (error.status === 404) {
        navigate('/orders', {
          state: {
            alert: {
              type: 'error',
              description: 'Order details not found.'
            }
          }
        });
      }
    }
  });

  if (result.isFetching) {
    return { isLoader: <Loader type={'screen'} /> };
  }

  return result;
};

export default useOrder;
