import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

export const getAccountList = async (requestParams, selectedOrgId) => {
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
};

async function getAccountListById(SPAccountId, selectedOrgId) {
  if (!SPAccountId) throw new Error('SP Account id is missing. SP Account id is required to fetch details.'); // TODO
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/${SPAccountId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data;
  }
  return {};
}

async function getAccountListConfigurationById(SPAccountId, selectedOrgId) {
  if (!SPAccountId) throw new Error('SP Account id is missing. SP Account id is required to fetch details.');
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/configuration/${SPAccountId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data;
  }
  return {};
}

async function saveSPAccountDetails(payload) {
  const { practiceId: selectedOrgId } = payload;
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function deactivateSPAccount(spAccountId) {
  if (!spAccountId) throw new Error('SP Account id is missing. SP Account id is required to fetch details.');
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/${spAccountId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  if (res.data) {
    return res.data;
  }

  return {};
}

async function updateSPAccount(payload, spAccountId) {
  if (!spAccountId) throw new Error('SP Account id is missing. SP Account id is required to fetch details.');
  const { practiceId: selectedOrgId } = payload;
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/${spAccountId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}
async function uploadAccountData(payload, organizationId) {
  const url = `${ApiRoutes.PUBLIC_ACCOUNTS}/for-practice/${organizationId}/upload`;
  const response = await HttpResourceService.callRest(url, httpVerb.POST, payload, {
    'Content-Type': 'multipart/form-data'
  });
  return response;
}

const AccountService = Object.freeze({
  getAccountList,
  getAccountListById,
  getAccountListConfigurationById,
  saveSPAccountDetails,
  deactivateSPAccount,
  updateSPAccount,
  uploadAccountData
});

export default AccountService;
