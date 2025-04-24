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

export default Object.freeze({
  getAllSPCrosswalk,
  uploadSPCrosswalk,
  downloadAssetTemplate
});
