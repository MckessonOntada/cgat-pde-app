import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import ServiceUtil from './ServiceUtil';
import { USERMANAGEMENT_SERVICE_BASE_URL } from '@src/config/AppConfig';

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

async function updateMaterialConfigBnb(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }
  const url = `${ApiRoutes.THERAPIES()}/config/update`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res?.data) {
    return res.data;
  }
  return {};
}

async function getMaterialConfigByNdc(channelType, ndc) {
  if (!ndc) {
    throw new Error('Invalid NDC no.');
  }
  const url = `${ApiRoutes.THERAPIES()}/config/ndc/${ndc}?channelType=${channelType}`;

  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data;
  }
  return [];
}

async function updateSPMaterialConfig(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }

  const url = `${ApiRoutes.THERAPIES()}/sp/config/update`;

  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);

  if (res?.data) {
    return res.data;
  }
  return {};
}
async function getSpMaterialConfigByMaterialNumber(channelType, materialNo) {
  if (!materialNo) {
    throw new Error('Invalid Material no.');
  }
  const url = `${ApiRoutes.THERAPIES()}/sp/config/${materialNo}?channelType=${channelType}`;

  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data;
  }
  return [];
}

async function getAllMaterials(userId, params = { listingMode: 'ALL' }) {
  const url = `${ApiRoutes.THERAPIES()}/user/${userId}?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);

  if (res.data) {
    res.data.content = ServiceUtil.transformTherapies(res.data.content || []);
    return res.data;
  }
  return [];
}

async function getAllMaterialsForCustomerCentre(userId, params = { listingMode: 'ALL' }) {
  const url = `${ApiRoutes.THERAPIES()}/customer-user/${userId}?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);

  if (res.data) {
    res.data.content = ServiceUtil.transformTherapies(res.data.content || []);
    return res.data;
  }
  return [];
}

async function restrictMaterial(userId, materialIds) {
  const url = `${ApiRoutes.ORDER(userId)}/restrict-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, materialIds);
  return res;
}

async function unrestrictMaterial(userId, materialIds) {
  const url = `${ApiRoutes.USERS()}/${userId}/material-restrictions`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, materialIds);
  return res;
}

async function addMaterial(userId, materialIds) {
  const url = `${ApiRoutes.USER_SERVICE_BASE}user/${userId}/link-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, materialIds);
  return res;
}

async function unlinkMaterial(userId, materialIds) {
  const url = `${ApiRoutes.ORDER(userId)}/restrict-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, materialIds);
  return res;
}

async function unlinkCustomerCentreMaterials(userId, materialIds) {
  const url = `${ApiRoutes.USER_SERVICE_BASE}user/${userId}/unlink-materials`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, materialIds);
  return res;
}

//demo service method for notification group
export const getTherapies = async (requestParams) => {
  const url = `${ApiRoutes.USERS()}/current/therapies?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
};
export const getUsers = async (requestParams) => {
  const url = `${ApiRoutes.USERS()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
};

async function getManufacturers(channelType) {
  if (!channelType) {
    throw new Error('Invalid channel type.');
  }
  const url = `${ApiRoutes.THERAPIES()}/manufacturer?channelType=${channelType}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

//Notification Settings
const constructUserManagementServicePublicUrl = (uri) => `${USERMANAGEMENT_SERVICE_BASE_URL}api/${uri}`;

async function createMaterialNotificationConfig(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }

  const url = constructUserManagementServicePublicUrl('material-notification-configs');
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);

  return res?.data || {};
}

async function getMaterialNotificationConfig(requestParams) {
  if (!requestParams || typeof requestParams !== 'object') {
    throw new Error('Invalid request parameters. A valid object is required.');
  }

  const url = `${constructUserManagementServicePublicUrl('material-notification-configs')}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  return res?.data || {};
}

async function updateMaterialNotificationConfig(configId, payload) {
  if (!configId) {
    throw new Error('Notification configuration ID is required.');
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }

  const url = constructUserManagementServicePublicUrl(`material-notification-configs/${configId}`);
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, payload);

  return res?.data || {};
}

async function updateMaterialNotificationRecipient(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }

  const url = constructUserManagementServicePublicUrl('material-notification-configs/recipients');
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, payload);

  return res?.data || {};
}

async function deleteMaterialNotificationRecipient(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }

  const url = constructUserManagementServicePublicUrl('material-notification-configs/recipients');
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, payload);

  return res?.data || {};
}
async function addMaterialNotificationRecipients(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }

  const url = constructUserManagementServicePublicUrl('material-notification-configs/recipients');
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  return res?.data || {};
}
async function updateMaterialNotificationConfigsBulk(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload. A valid JSON object is required.');
  }

  const url = constructUserManagementServicePublicUrl('material-notification-configs/config/update');
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);

  return res?.data || {};
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
  updateMaterialConfigBnb,
  updateSPMaterialConfig,
  getMaterialConfigByNdc,
  getSpMaterialConfigByMaterialNumber,
  getAllMaterials,
  getAllMaterialsForCustomerCentre,
  restrictMaterial,
  unrestrictMaterial,
  unlinkMaterial,
  getTherapies,
  getUsers,
  getManufacturers,
  addMaterial,
  unlinkCustomerCentreMaterials,
  createMaterialNotificationConfig,
  getMaterialNotificationConfig,
  updateMaterialNotificationConfig,
  updateMaterialNotificationRecipient,
  deleteMaterialNotificationRecipient,
  addMaterialNotificationRecipients,
  updateMaterialNotificationConfigsBulk
});

export default MaterialService;
