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

async function deLinkCrosswalk(id) {
  const url = `${ApiRoutes.USER_SERVICE_BASE}cross-walk/${id}/deLink`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  return res;
}

async function uploadSPCrosswalk(payload) {
  const url = `${ApiRoutes.USER_SERVICE_BASE}cross-walk/upload`;
  const response = await HttpResourceService.callRest(
    url,
    httpVerb.POST,
    payload,
    {
      'Content-Type': 'multipart/form-data'
    }
  );

  return response;
}

async function downloadAssetTemplate(resourceName) {
  try {
    const documentUrl = `${ApiRoutes.THERAPIES()}/download?channelType=${resourceName}`;
    const res = await HttpResourceService.callRest(documentUrl, httpVerb.GET);

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
  return {};
}

async function createCrosswalk(payload) {
  const url = `${ApiRoutes.USER_SERVICE_BASE}cross-walk`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);

  if (res.data) {
    return res.data;
  }
  return {};
}

export default Object.freeze({
  getAllSPCrosswalk,
  uploadSPCrosswalk,
  downloadAssetTemplate,
  deLinkCrosswalk,
  createCrosswalk
});
