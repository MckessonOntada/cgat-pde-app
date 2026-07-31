import { useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';

function useTherapies(query) {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { data: therapyResponse = {}, isFetching } = useQuery({
    queryKey: ['fetch-therapies', query, isSystemAdminView],
    queryFn: async () => {
      if (isSystemAdminView) {
        const params = {
          pageNo: 0,
          pageSize: 20,
          channelTypes: 'BUY_AND_BILL,SPECIALITY_PHARMA'.toString(),
          ...(query && { query })
        };

        const res = await HttpResourceService.callRest(`${ApiRoutes.GET_ALL_MATERIALS()}?${serializeParams(params)}`, httpVerb.GET, {});

        return res.data;
      }

      return MaterialService.getTherapies({
        pageNo: 0,
        pageSize: 20,
        ...(query && { query })
      });
    },

    select: (response) => {
      const { content = [], totalElements = 0 } = response;

      const therapies = content
        .flatMap(({ channelType, tradeName, therapies = [] }) =>
          therapies.map((therapy) => ({
            value: therapy.id,
            label: therapies.length === 1 ? tradeName : therapy.materialDescription,
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
    isFetching
  };
}

export default useTherapies;
