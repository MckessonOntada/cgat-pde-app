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

export default Object.freeze({
  getAllSPCrosswalk
});
