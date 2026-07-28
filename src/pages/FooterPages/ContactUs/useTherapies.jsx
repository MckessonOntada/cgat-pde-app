import { useQuery } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';

function useTherapies(query) {
  const { data: therapies = [], isFetching } = useQuery({
    queryKey: `fetch-therapies-${query}`,
    queryFn: async () => {
      return MaterialService.getTherapies({
        pageNo: 0,
        pageSize: 8,
        ...(query && { query })
      });
    },

    select: (response) => {
      const { content = [] } = response;

      return content
        .flatMap(({ channelType, tradeName, therapies = [] }) =>
          therapies.map((therapy) => ({
            value: therapy.id,
            label: therapies.length === 1 ? tradeName : therapy.materialDescription,
            ndc: therapy.ndc,
            channelType: channelType,
            isCrosswalked: therapy.isCrosswalked
          }))
        )
        .filter((option) => option.label);
    }
  });

  return {
    therapyOptions: therapies,
    isFetching
  };
}

export default useTherapies;
