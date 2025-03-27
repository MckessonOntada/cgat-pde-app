import { useQuery } from 'react-query';
import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

export const getSPMaterialList = async (requestParams) => {
  //   const { data, isLoading, isError, error, refetch } = useQuery({
  //     queryKey: ['SPMaterials', requestParams],
  //     queryFn: async () => {
  //       const url = '';
  //       const response = await HttpResourceService.callRest(fullUrl, httpVerb.GET, {});
  //       return response.data;
  //     },
  //     refetchOnWindowFocus: false,
  //     enabled
  //   });
  const result = await import('../../mfe/order-management/pages/system-configuration/manage-spmaterial/mockData/SPMaterialData');

  return {
    data: result.default.content || [],
    totalElements: result.default.content?.totalElements,
    totalPages: result.default.content?.totalPages
  };
};

async function getSPMaterialListById(spMaterialId) {
  if (!spMaterialId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');

  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function saveSPMaterialDetails(payload) {}

async function deactivateSPMaterial(spMaterialId) {
  if (!spMaterialId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');
  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  if (res.data) {
    return res.data;
  }

  return {};
}

async function updateSPMaterial(spMaterialId, requestBody) {
  if (!spMaterialId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');

  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, requestBody);

  if (res.data) {
    return res.data;
  }

  return {};
}

const SPMaterialService = Object.freeze({
  getSPMaterialList,
  getSPMaterialListById,
  saveSPMaterialDetails,
  deactivateSPMaterial,
  updateSPMaterial
});

export default SPMaterialService;
