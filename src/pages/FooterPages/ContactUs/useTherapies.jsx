import { useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';
import AuthUtils from '@src/util/AuthUtils';

function useTherapies(query, reason) {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const {
    data: therapyResponse = {},
    isFetching,
    isFetched
  } = useQuery({
    queryKey: ['fetch-therapies', reason, query, isSystemAdminView],

    queryFn: async () => {
      if (isSystemAdminView) {
        const params = {
          pageNo: 0,
          pageSize: 20,
          channelTypes: 'BUY_AND_BILL,SPECIALITY_PHARMA',
          ...(query && { query })
        };

        return MaterialService.getMaterialList(params);
      }

      return MaterialService.getTherapies({
        pageNo: 0,
        pageSize: 20,
        ...(query && { query })
      });
    },

    keepPreviousData: true,
    refetchOnMount: true,
    select: (response) => {
      const { content = [], totalElements = 0 } = response;

      const therapies = content
        .flatMap(({ channelType, therapies = [] }) =>
          therapies.map((therapy) => ({
            value: therapy.id,
            label: therapy.materialDescription,
            ndc: therapy.ndc,
            channelType,
            isCrosswalked: therapy.isCrosswalked ?? false
          }))
        )
        .filter((option) => option.label);

      return {
        therapies,
        totalElements
      };
    }
  });
  return {
    therapyOptions: therapyResponse.therapies || [],
    therapyTotalElements: therapyResponse.totalElements || 0,
    isFetching,
    isFetched
  };
}

export default useTherapies;
