import {
  MAIN_BASE_URL,
  USERMANAGEMENT_SERVICE_BASE_URL,
  DATA_ABSTRACTION_SERVICE_BASE_URL,
  STUDY_MANAGEMENT_SERVICE_BASE_URL,
  CONTENT_SERVICE_BASE_URL
} from '../config/AppConfig';

const constructMainAppUrl = (uri) => `${MAIN_BASE_URL}${uri}`;
const constructUserManagementServiceUrl = (uri) => `${USERMANAGEMENT_SERVICE_BASE_URL}${uri}`;
const constructAbstractServiceUrl = (uri) => `${DATA_ABSTRACTION_SERVICE_BASE_URL}${uri}`;
const constructAbstractServiceStudy = (uri) => `${DATA_ABSTRACTION_SERVICE_BASE_URL}study/${uri}`;
const constructAbstractServiceUrlWithStudy = (uri) =>
  `${DATA_ABSTRACTION_SERVICE_BASE_URL}study/1/${uri}`;
const constructQuestionnaireServiceUrl = (uri) => `${STUDY_MANAGEMENT_SERVICE_BASE_URL}${uri}`;
const constructContentServiceUrl = (uri) => `${CONTENT_SERVICE_BASE_URL}${uri}`;

const ApiRoutes = Object.freeze({
  GET_CGAT_PDE_OKTA_CONFIG: constructUserManagementServiceUrl('public/idpConfig'),
  GET_USERS_LIST: constructUserManagementServiceUrl('users'),
  GET_REFERENCE_LIST: constructUserManagementServiceUrl('reference'),
  GET_JWT_DECODE: constructUserManagementServiceUrl('public/jwt'),
  POST_USER_BULK_UPLOAD: constructUserManagementServiceUrl('users/roles'),
  POST_USER_LOGIN: constructUserManagementServiceUrl('users/postLogin'),
  POST_USER_LOGOUT: constructUserManagementServiceUrl('users/postLogout'),
  //data abstraction
  GET_PATIENT_STUDY_LIST: constructAbstractServiceUrl('patients/search'),
  GET_NEXT_PATIENT: constructAbstractServiceUrl('patient/assign'),
  // GET_NEXT_PATIENT: constructAbstractServiceUrl('patient/assign'),
  GET_PROJECT_DETAILS: constructAbstractServiceUrl('user/studies'),
  GET_BANNER_DETAILS: constructAbstractServiceUrl('study'),
  GET_ABSTRACTOR_LIST: constructAbstractServiceUrl('study'),
  GET_DATA_ABSTRACTION_REFERENCE_LIST: constructAbstractServiceUrl('reference'),
  GET_PATIENT_DETAILS: constructAbstractServiceUrl('patients'),
  POST_PATIENT_BULK_UPLOAD: constructAbstractServiceUrl('patients/bulkupload'),
  GET_STUDY_NEXT_PATIENT: constructAbstractServiceUrl('study'),
  POST_CATEGORY_STATUS: constructAbstractServiceUrl('study'),
  PATIENT_TASK_STATUS: constructAbstractServiceUrl('study'),
  REASSIGN_PATIENTS: constructAbstractServiceUrl('study'),
  TASK_PROGRESS: constructAbstractServiceUrl('study'),
  REVERT_TASK: constructAbstractServiceUrl('study'),
  ADHOC_ASSIGNMENT: constructAbstractServiceUrl('study'),

  //PatientDocument
  GET_PATIENT_DOCUMENT_LIST: constructAbstractServiceUrl('patients'),
  GET_PATIENT_DOCUMENT_DETAILS: constructAbstractServiceUrl('patients'),
  GET_CATEOGRY_LIST: constructAbstractServiceUrlWithStudy('patient'),

  //Questionnaire Service
  BASE_QUESTIONNAIRE_URL: constructQuestionnaireServiceUrl(''),
  BASE_DYNAMIC_QUESTIONNAIRE_URL: constructContentServiceUrl('picklist'),
  GET_FORM_RESPONSE: constructQuestionnaireServiceUrl('question'),
  POST_FORM_RESPONSE: constructQuestionnaireServiceUrl('question'),
  GET_CATEGORY_TEMPLATE: constructQuestionnaireServiceUrl('category'),
  DELETE_FORM_RESPONSE: constructQuestionnaireServiceUrl('question/responses'),
  RESTORE_FORM_RESPONSE: constructQuestionnaireServiceUrl('question/responses'),
  GET_AUDIT_HISTORY: constructQuestionnaireServiceUrl('question/responses/audit'),

  // Content Service
  GET_AUDIT_REASON: constructContentServiceUrl('picklist/search'),
  GET_DROPDOWN_SEARCH_DATA: constructContentServiceUrl('picklist'),
  GET_DYNAMIC_CONTENT: constructContentServiceUrl(''),

  //Tree dropdown
  GET_TREEDROPDOWN_SEARCH_DATA: constructContentServiceUrl('global/dropdown/path'),
  GET_TREEDROPDOWN_CHILDREN_DATA: constructContentServiceUrl('global/dropdown/children'),

  GET_SELECTED_TREEDROPDOWN_DATA: constructContentServiceUrl('dropdown/path'),
  GET_SELECTED_TREEDROPDOWN_CHILDREN_DATA: constructContentServiceUrl('dropdown/children'),

  POST_TREEDROPDOWN_DATA: constructContentServiceUrl('dropdown/content/save')
});

export default ApiRoutes;
