import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getMaterialById(id) {
  const url = `${ApiRoutes.GET_MATERIAL_BY_ID(id)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getMaterialConfigById(id) {
  const url = `${ApiRoutes.GET_MATERIAL_CONFIG_BY_ID(id)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function deleteMaterialConfig(id) {
  const url = `${ApiRoutes.DELETE_MATERIAL_CONFIG(id)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

export const getMaterialList = async (requestParams) => {
  const url = `${ApiRoutes.GET_ALL_MATERIALS()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
};

async function getSPMaterialById(spMaterialId, requestParams) {
  if (!spMaterialId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spMaterialId)}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getSPMaterial(requestParams) {
  const url = `${ApiRoutes.THERAPIES()}/type/speciality-pharma?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}
async function getManufacturerListSPMaterial(status) {
  const url = `${ApiRoutes.THERAPIES()}/manufacturers?status=${status}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function deleteSPMaterialConfig(id) {
  const url = `${ApiRoutes.CONFIGURE_SP_MATERIALS()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

const MaterialService = Object.freeze({
  getMaterialById,
  getMaterialConfigById,
  deleteMaterialConfig,
  getMaterialList,
  getSPMaterialById,
  getSPMaterial,
  getManufacturerListSPMaterial,
  deleteSPMaterialConfig
});

export default MaterialService;
