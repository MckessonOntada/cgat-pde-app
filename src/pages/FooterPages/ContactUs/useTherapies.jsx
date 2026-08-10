import { useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';
import AuthUtils from '@src/util/AuthUtils';

function useTherapies(query, reason, setAlert) {
  const isSystemUser = AuthUtils.isSystemAdmin() || AuthUtils.isCustomerCenter() || AuthUtils.isTreatmentCentreExecutive();
  const {
    data: therapyResponse = {},
    isFetching,
    isFetched,
    isError
  } = useQuery({
    queryKey: ['fetch-therapies', reason, query, isSystemUser],

    queryFn: async () => {
      if (isSystemUser) {
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
    onError: () => {
      setAlert({
        type: 'error',
        key: 'THERAPY_API_ERROR',
        description: 'contactUs.defaultErrorMessage'
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
    isFetched,
    isError
  };
}

export default useTherapies;
