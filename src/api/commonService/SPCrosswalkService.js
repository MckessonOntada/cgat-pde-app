import { serializeParams } from '@src/util/ApiUtils';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import ApiRoutes from '../ApiRoutes';

async function getAllSPCrosswalk(requestParams) {
  const url = `${ApiRoutes.USER_SERVICE_BASE}cross-walk?${serializeParams(
    requestParams
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);

  if (res.data) {
    return res.data;
  }
  return {};
}

async function uploadSPCrosswalk(payload) {
  const url = `${ApiRoutes.USER_SERVICE_BASE}cross-walk/upload`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload, {
    'Content-Type': 'multipart/form-data'
  });

  if (res.data) {
    return res.data;
  }
  return {};
}

async function downloadSPProductInfo() {
  return [];
}

async function downloadMaterialInfo() {
  return [];
}

export default Object.freeze({
  getAllSPCrosswalk,
  uploadSPCrosswalk,
  downloadSPProductInfo,
  downloadMaterialInfo
});
