import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getQuestionnaires() {
  const url = `${ApiRoutes.QUESTIONNAIRE()}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, null);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function createQuestionnaire(payload) {
  return {};
}

async function applyQuestionnaireConfig(payload) {
  return {};
}

const QuestionnaireConfig = Object.freeze({
  getQuestionnaires,
  createQuestionnaire,
  applyQuestionnaireConfig
});

export default QuestionnaireConfig;
