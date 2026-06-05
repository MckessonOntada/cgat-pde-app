import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getAllRoles(params = {}) {
  const url = `${ApiRoutes.GET_ROLES()}?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data;
}

async function getRoleDetails(id) {
  const url = `${ApiRoutes.GET_ROLES()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data;
}

async function createRole(payload) {
  const url = `${ApiRoutes.GET_ROLES()}`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  return res.data;
}

async function updateRole(id, payload) {
  const url = `${ApiRoutes.GET_ROLES()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  return res.data;
}

async function updatePermissions(id, payload) {
  const url = `${ApiRoutes.GET_ROLES()}/${id}/permissions`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  return res.data;
}

async function updateCommunicationPreferences(id, payload) {
  const url = `${ApiRoutes.GET_ROLES()}/${id}/communication-preferences`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  return res.data;
}

async function deactivateRole(id) {
  const url = `${ApiRoutes.GET_ROLES()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, {});
  return res.data;
}

async function getCommunicationPreferences(roleId) {
  const url = `${ApiRoutes.GET_ROLES()}/${roleId}/communication-preferences`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data;
}
const RoleService = Object.freeze({
  getRoleDetails,
  createRole,
  updateRole,
  updatePermissions,
  updateCommunicationPreferences,
  getAllRoles,
  deactivateRole,
  getCommunicationPreferences
});

export default RoleService;
