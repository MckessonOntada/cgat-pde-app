import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getQuestionnaires(requestParams) {
  const url = `${ApiRoutes.QUESTIONNAIRE()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data || {};
}

async function createQuestionnaire(payload) {
  const url = `${ApiRoutes.QUESTIONNAIRE()}`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function updateQuestionnaire(id, payload) {
  const url = `${ApiRoutes.QUESTIONNAIRE()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getQuestionnaireById(id) {
  const url = `${ApiRoutes.QUESTIONNAIRE()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, null);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function deactivateQuestionnaireById(requestBody) {
  const url = `${ApiRoutes.QUESTIONNAIRE()}/deactivate`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, requestBody);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function applyQuestionnaireConfig(payload) {
  return {};
}

async function configureQuestionnaire(entityType, payload) {
  const url = `${ApiRoutes.QUESTIONNAIRE()}/configure?type=${entityType}`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getConfiguredQuestionnaire(requestParams) {
  if (!requestParams || typeof requestParams !== 'object') {
    throw new Error(
      'Invalid payload. Expected an object with the following shape: { soldToCustomer : <string>, shipToCustomer : <string>, sapMaterial : <string>, variant?: <string> }.'
    );
  }

  const { soldToCustomer, shipToCustomer, sapMaterial } = requestParams;

  if (soldToCustomer === undefined || shipToCustomer === undefined || sapMaterial === undefined) {
    throw new Error("Invalid payload. Required properties: 'soldToCustomer', 'shipToCustomer', and 'sapMaterial '. Optional property: 'variant'.");
  }
  // pass one more param materialOrNdcNumber
  const url = `${ApiRoutes.QUESTIONNAIRE()}/configured-questionnaire?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, null);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function uploadQuestionnaireDocument(payload) {
  const { orderId, templateId, file } = payload;
  const url = `${ApiRoutes.ORDERS()}/${orderId}/documents?templateId=${templateId}`;

  const res = await HttpResourceService.callRest(
    url,
    httpVerb.POST,
    { file },
    {
      'Content-Type': 'multipart/form-data'
    }
  );

  if (res.data) return res.data;

  return {};
}

async function uploadVariantDocument(payload) {
  const { orderId, variantId, file } = payload;
  const url = `${ApiRoutes.ORDERS()}/${orderId}/variant/documents?variant=${variantId}`;

  const res = await HttpResourceService.callRest(
    url,
    httpVerb.POST,
    { file },
    {
      'Content-Type': 'multipart/form-data'
    }
  );

  if (res.data) return res.data;

  return {};
}

async function deLinkConfigureQuestionnaire(entityType, payload) {
  const apiUrl = `${ApiRoutes.QUESTIONNAIRE()}/configure/deLink?type=${entityType}`;
  const res = await HttpResourceService.callRest(apiUrl, httpVerb.DELETE, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}
async function getGlobalFooterLinks() {
  const url = ApiRoutes.GLOBAL_FOOTER();
  const res = await HttpResourceService.callRest(url, httpVerb.GET, null);
  if (res.data) {
    return res.data;
  }
  return {};
}

const QuestionnaireService = Object.freeze({
  getQuestionnaires,
  createQuestionnaire,
  applyQuestionnaireConfig,
  configureQuestionnaire,
  updateQuestionnaire,
  getQuestionnaireById,
  deactivateQuestionnaireById,
  getConfiguredQuestionnaire,
  uploadQuestionnaireDocument,
  uploadVariantDocument,
  deLinkConfigureQuestionnaire,
  getGlobalFooterLinks
});

export default QuestionnaireService;
