import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function downloadAPAccountTemplate() {
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
async function downloadAPMaterialTemplate() {
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

async function uploadCatalogData(payload) {
  const url = `${ApiRoutes.CATALOGS()}/upload`;

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

const SPCatalogService = Object.freeze({
  downloadAPAccountTemplate,
  downloadAPMaterialTemplate,
  uploadCatalogData
});

export default SPCatalogService;
