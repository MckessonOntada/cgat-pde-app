import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import ServiceUtil from './ServiceUtil';

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

async function getUnassignedDiagnosisCodes(spProductId, params) {
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes?${serializeParams(params)}`;

  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getAssignedDiagnosisCodes(spProductId, params) {
  if (!spProductId) {
    throw new Error('Missing required params. SP product id is required.');
  }
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function removeAssignedDiagnosisCode(spProductId, codes) {
  if (!codes || !Array.isArray(codes)) throw new Error("Invalid sp product id's. Provide an array of sp product id's");
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes`;

  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, codes);
  if (res.data) {
    return res.data;
  }
  return [];
}

async function addDiagnosisCode(spProductId, productIds) {
  if (!productIds || !Array.isArray(productIds)) throw new Error("Invalid sp product id's. Provide an array of sp product id's");
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spProductId)}/diagnosis-codes`;

  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, productIds);
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
  if (!spMaterialId) throw new Error('SP Material ID is missing. SP Material ID is required to fetch details.');
  const url = `${ApiRoutes.GET_SP_MATERIAL_CONFIG_BY_ID(spMaterialId)}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getSPMaterial(requestParams) {
  console.log('Calling this method');
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

async function getAllMaterials(userId, params = { listingMode: 'ALL' }) {
  const url = `${ApiRoutes.THERAPIES()}/user/${userId}?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);

  if (res.data) {
    return ServiceUtil.transformTherapies(res.data);
  }
  return [];
}

async function restrictMaterial(userId, materialIds) {
  const url = `${ApiRoutes.ORDER(userId)}/restrict-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, materialIds);
  return res;
}

async function unlinkMaterial(userId, materialIds) {
  const url = `${ApiRoutes.ORDER(userId)}/restrict-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, materialIds);
  return res;
}

const MaterialService = Object.freeze({
  getMaterialById,
  getMaterialConfigById,
  deleteMaterialConfig,
  getMaterialList,
  getSPMaterialById,
  getSPMaterial,
  getManufacturerListSPMaterial,
  deleteSPMaterialConfig,
  getUnassignedDiagnosisCodes,
  getAssignedDiagnosisCodes,
  removeAssignedDiagnosisCode,
  addDiagnosisCode,
  getAllMaterials,
  restrictMaterial,
  unlinkMaterial
});

export default MaterialService;
