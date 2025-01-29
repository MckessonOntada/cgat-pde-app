import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getQuestionnaires(requestParams) { 
  const url = `${ApiRoutes.QUESTIONNAIRE()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data || {};
}

async function createQuestionnaire(payload) {
  return {};
}

async function applyQuestionnaireConfig(payload) {
  return {};
}


async function configureQuestionnaire(entityType,payload) { 
  const url = `${ApiRoutes.QUESTIONNAIRE()}/configure?type=${entityType}`;
  console.log('url', url);
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}


const QuestionnaireConfig = Object.freeze({
  getQuestionnaires,
  createQuestionnaire,
  applyQuestionnaireConfig,
  configureQuestionnaire
});

export default QuestionnaireConfig;
