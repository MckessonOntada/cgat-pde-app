import React from 'react';
import { useQuery } from 'react-query';
import { CHANNEL_TYPE } from '../Constants';
import ProviderService from '@src/api/commonService/ProviderService';
import CommonUtils from '@src/util/CommonUtils';

function useProvider(params) {
  const { orderDetails, query, status } = params;
  const {
    data: providers = [],
    isFetching,
    refetch
  } = useQuery({
    queryKey: `fetch-providers-${orderDetails.id}-${query}`,
    queryFn: async () =>
      ProviderService.getAllProviders({
        channelType: orderDetails.channelType,
        query,
        ...(status && { status })
      }),
    select: (response) => {
      const { content = null } = response;
      if (content && Array.isArray(content)) {
        const transformedProviders = content.map((provider) => {
          const { name, address } = provider;
          return {
            id: provider.id,
            ...provider,
            fullname: CommonUtils.getFullName(name),
            detailedAddress: CommonUtils.getDetailedAddress(address)
          };
        });
        if (orderDetails.provider) {
          const { name, address } = orderDetails.provider;
          const preselectedProvider = {
            ...orderDetails.provider,
            fullname: CommonUtils.getFullName(name),
            detailedAddress: CommonUtils.getDetailedAddress(address)
          };
          transformedProviders.unshift(preselectedProvider);
        }
        return transformedProviders;
      }
      return [];
    },
    enabled: Boolean(orderDetails.id && orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA)
  });

  return {
    providers,
    isFetching,
    totalProviders: providers?.length
  };
}

export default useProvider;
