import HttpResourceService, { httpVerb } from '../HttpResourceService';

export const getLinkProviderList = async (requestParams) => {
  const result = await import('../../mfe/order-management/pages/system-configuration/manage-spaccount/mockData/LinkProviderData');

  return {
    data: result.default.content || [],
    totalElements: result.default.totalElements,
    totalPages: result.default.totalPages
  };
};
async function removeLinkProvider(row) {
  if (!row) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');
  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  if (res.data) {
    return res.data;
  }
  return {};
}


const LinkProviderService = Object.freeze({
  getLinkProviderList,
  removeLinkProvider
});

export default LinkProviderService;
