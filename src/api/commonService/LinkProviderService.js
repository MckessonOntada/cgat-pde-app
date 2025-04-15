import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';

export const getProviderList = async (requestParams, selectedOrganization, accId) => {
  // const result = await import('../../mfe/order-management/pages/system-configuration/manage-spaccount/mockData/LinkProviderData');
  // return {
  //   data: result.default.content || [],
  //   totalElements: result.default.totalElements,
  //   totalPages: result.default.totalPages
  // };
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/accounts/${accId}/non-linked-providers?${serializeParams(requestParams)}`;
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
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/providers?accountId=${accountId}${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {
    'Content-Type': 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return [];
}

async function removeLinkProvider( selectedOrganization, accId, providerId ) {
  if (!providerId) throw new Error('Provider id is missing. Provider id is required to unlink the provider.');
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/accounts/${accId}/providers/${providerId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return {};
}

async function linkProvidersToAccount(selectedOrganization, accountId, providerIds) {
  if (!Array.isArray(providerIds)) throw new Error('Provider Ids must be an array.');

  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization}/accounts/${accountId}/providers`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }, providerIds);

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
  linkProvidersToAccount
});

export default LinkProviderService;
