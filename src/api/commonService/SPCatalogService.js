import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getOrganizations(requestParams) {
  const res = await HttpResourceService.callRest(`${ApiRoutes.PUBLIC_ORGANIZATIONS}?${serializeParams(requestParams)}`, httpVerb.GET, {});
  res.data.content = res.data?.content?.map((item) => ({
    ...item,
    label: item.name,
    value: item.id,
    isChecked: false
  }));
  return res.data;
}

async function getAccountList(requestParams) {
  if (!requestParams.practiceIdList) throw new Error('Missing practice id list');

  const res = await HttpResourceService.callRest(
    `${ApiRoutes.USER_SERVICE_BASE}accounts/for-organizations?${serializeParams(requestParams)}`,
    httpVerb.GET,
    {}
  );
  res.data.content = res.data?.content?.map((item) => ({
    ...item,
    label: item.name,
    value: item.id,
    isChecked: false
  }));
  return res.data;
}

async function getAllCatalog(requestParams) {
  const res = await HttpResourceService.callRest(`${ApiRoutes.USER_SERVICE_BASE}catalogs?${serializeParams(requestParams)}`, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function deLinkCatalogs(payload) {
  const res = await HttpResourceService.callRest(`${ApiRoutes.USER_SERVICE_BASE}catalogs/specialityPharma/deLink`, httpVerb.DELETE, payload);
  return res;
}

async function downloadSPAccountTemplate() {
  try {
    const documentUrl = `${ApiRoutes.PUBLIC_ACCOUNTS}/download`;
    const res = await HttpResourceService.callRest(documentUrl, httpVerb.GET);

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
  return {};
}

async function downloadSPMaterialTemplate() {
  try {
    const documentUrl = `${ApiRoutes.THERAPIES()}/download`;
    const res = await HttpResourceService.callRest(documentUrl, httpVerb.GET);

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
  return {};
}

async function uploadCatalogData(payload) {
  const url = `${ApiRoutes.CATALOGS()}/upload`;

  const response = await HttpResourceService.callRest(url, httpVerb.POST, payload, {
    'Content-Type': 'multipart/form-data'
  });

  return response;
}

async function linkCatalog(payload) {
  const url = `${ApiRoutes.CATALOGS()}/specialityPharma`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function downloadSpCatalogList(requestParams) {
  const res = await HttpResourceService.callRest(`${ApiRoutes.USER_SERVICE_BASE}catalogs/download?${serializeParams(requestParams)}`, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getSPProductDetailsByMN(requestParams) {
  const apiUrl = `${ApiRoutes.GET_CATALOG_DATA()}/configuration?${serializeParams(requestParams())}`;
  const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function deleteConfigurationsForSPCatalogs(requestParams) {
  const apiUrl = `${ApiRoutes.GET_CATALOG_DATA()}/configuration?${serializeParams(requestParams())}`;
  const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE);
  return res;
}

const SPCatalogService = Object.freeze({
  downloadSPAccountTemplate,
  downloadSPMaterialTemplate,
  uploadCatalogData,
  getOrganizations,
  getAccountList,
  getAllCatalog,
  deLinkCatalogs,
  linkCatalog,
  downloadSpCatalogList,
  getSPProductDetailsByMN,
  deleteConfigurationsForSPCatalogs
});

export default SPCatalogService;
