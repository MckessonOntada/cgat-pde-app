import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';

export const getProviderList = async (requestParams, selectedOrganization) => {
  // const result = await import('../../mfe/order-management/pages/system-configuration/manage-spaccount/mockData/LinkProviderData');
  // return {
  //   data: result.default.content || [],
  //   totalElements: result.default.totalElements,
  //   totalPages: result.default.totalPages
  // };
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/accounts/1/non-linked-providers?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {
    'Content-Type': 'application/json;charset=utf-8',
    accept: 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return [];
};


async function getProviderDetailsById(id, selectedOrganization) {
  if (!id) {
    throw new Error('Provider ID is required to get provider details.');
  }

  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/providers/${id}/`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {
    accept: 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getProviderListByAccount(requestParams, selectedOrganization, accountId) {
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/providers?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {
    'Content-Type': 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return [];
}

async function removeLinkProvider(providerId) {
  if (!row) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/accounts/1/providers/${providerId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  if (res.data) {
    return res.data;
  }
  return {};
}


const LinkProviderService = Object.freeze({
  getProviderList,
  removeLinkProvider,
  getProviderDetailsById,
  getProviderListByAccount,
});

export default LinkProviderService;
