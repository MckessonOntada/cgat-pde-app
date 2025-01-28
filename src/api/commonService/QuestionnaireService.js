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
  const url = `${ApiRoutes.QUESTIONNAIRE()}`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
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
  return {};
}

async function applyQuestionnaireConfig(payload) {
  return {};
}

const QuestionnaireService = Object.freeze({
  getQuestionnaires,
  createQuestionnaire,
  applyQuestionnaireConfig,
  getQuestionnaireById
});

export default QuestionnaireService;
