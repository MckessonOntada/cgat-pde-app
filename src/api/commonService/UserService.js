import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import CommonUtils from '@src/util/CommonUtils';
import AuthUtils from '@src/util/AuthUtils';

async function getTherapyById(id) {
  const url = `${ApiRoutes.THERAPIES()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data ?? null;
}

async function getAssignee(params) {
  const url = `${ApiRoutes.USERS()}?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return (
    res.data?.content?.map((item) => ({
      value: item.id,
      label: CommonUtils.getFullName(item.name)
    })) ?? []
  );
}

async function subscribeSmsNotification(number) {
  const userId = AuthUtils.getLoggedInUserId();
  if (!userId) throw new Error('No valid user found');

  const userType = AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL';
  const url = `${ApiRoutes.USERS()}/${userId}/number?${serializeParams({ number, userType })}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {});
  return res.data ?? null;
}

async function resendInvitation() {
  const userId = AuthUtils.getLoggedInUserId();
  if (!userId) throw new Error('No valid user found');

  const url = `${ApiRoutes.USERS()}/${userId}/resend-number-verification-sms`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data ?? null;
}

async function getSubscriptionDetails() {
  const userId = AuthUtils.getLoggedInUserId();
  if (!userId) throw new Error('No valid user found');

  const url = `${ApiRoutes.USERS()}/${userId}/number-verification-status`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data ?? null;
}

async function getCommunicationPreferences() {
  const url = `${ApiRoutes.USERS()}/current/communication-preference`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  return res.data ?? null;
}
async function setCommunicationPreferences(payload) {
  const url = `${ApiRoutes.USERS()}/current/communication-preference`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  return res.data ?? null;
}

const UserService = Object.freeze({
  getTherapyById,
  getAssignee,
  subscribeSmsNotification,
  resendInvitation,
  getSubscriptionDetails,
  getCommunicationPreferences,
  setCommunicationPreferences
});

export default UserService;
