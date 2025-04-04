import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getProviders(params) {
  const url = `${ApiRoutes.ORDERS()}?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return [];
}

const ProviderService = Object.freeze({
  getProviders
});

export default ProviderService;
