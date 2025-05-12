import React from 'react';
import { useQuery } from 'react-query';
import { CHANNEL_TYPE } from '../Constants';
import ProviderService from '@src/api/commonService/ProviderService';
import CommonUtils from '@src/util/CommonUtils';

function useProvider(params) {
  const { channelType } = params;
  const {
    data: providers = [],
    isFetching,
    refetch
  } = useQuery({
    queryKey: `fetch-providers-${JSON.stringify(params)}`,
    queryFn: async () => ProviderService.getAllProviders(params),
    select: (response) => {
      if (response.content && Array.isArray(response.content)) {
        const beautifiedProviders = response.content.map((provider) => {
          const { name, address } = provider;
          return {
            id: provider.id,
            ...provider,
            fullname: CommonUtils.getFullName(name),
            detailedAddress: CommonUtils.getDetailedAddress(address)
          };
        });
        return beautifiedProviders;
      }
      return [];
    },
    enabled: Boolean(channelType === CHANNEL_TYPE.SPECIALTY_PHARMA)
  });

  return {
    providers,
    isFetching,
    totalProviders: providers?.length
  };
}

export default useProvider;
