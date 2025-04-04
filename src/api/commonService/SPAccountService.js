import { useQuery } from 'react-query';
import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

export const getSPAccountList = async (requestParams, selectedOrgId) => {
  // const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts?${serializeParams(requestParams)}`; //TO DO
  // const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  // if (res.data) {
  //   return res.data.content;
  // }
  // return [];
  const result = await import('../../mfe/order-management/pages/system-configuration/manage-spaccount/mockData/SPAccountData');

  return {
    data: result.default.content || [],
    totalElements: result.default.totalElements,
    totalPages: result.default.totalPages
  };
};

async function getSPAccountListById(SPAccountId, selectedOrgId) {
  if (!SPAccountId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.'); // TODO
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/configuration/${SPAccountId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data.account;
  }
  return {};
}

async function saveSPAccountDetails(payload) {}

async function deactivateSPAccount(SPAccountId) {
  if (!SPAccountId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');
  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  if (res.data) {
    return res.data;
  }

  return {};
}

async function updateSPAccount(SPAccountId, requestBody) {
  if (!SPAccountId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');

  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, requestBody);

  if (res.data) {
    return res.data;
  }

  return {};
}

const SPAccountService = Object.freeze({
  getSPAccountList,
  getSPAccountListById,
  saveSPAccountDetails,
  deactivateSPAccount,
  updateSPAccount
});

export default SPAccountService;
