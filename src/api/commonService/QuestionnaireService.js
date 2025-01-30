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

async function deactivateQuestionnaireById(id) {
  const url = `${ApiRoutes.QUESTIONNAIRE()}/${id}/deactivate`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, null);
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
  console.log('url', url);
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getConfiguredQuestionnaire(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error(
      'Invalid payload. Expected an object with the following shape: { soldToCustomer : <string>, shipToCustomer : <string>, sapMaterial : <string>, variant?: <string> }.'
    );
  }

  const { soldToCustomer, shipToCustomer, sapMaterial } = payload;

  if (soldToCustomer === undefined || shipToCustomer === undefined || sapMaterial === undefined) {
    throw new Error(
      "Invalid payload. Required properties: 'soldToCustomer', 'shipToCustomer', and 'sapMaterial '. Optional property: 'variant'."
    );
  }

  const url = `${ApiRoutes.QUESTIONNAIRE()}/configured-questionnaire`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, payload);
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
  getConfiguredQuestionnaire
});

export default QuestionnaireService;
