import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import CommonUtils from '@src/util/CommonUtils';
import AuthUtils from '@src/util/AuthUtils';

async function getTherapyById(id) {
  const url = `${ApiRoutes.THERAPIES()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getAssignee(requestParams) {
  const url = `${ApiRoutes.USERS()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data.content.map((item) => ({
      value: item.id,
      label: CommonUtils.getFullName(item.name)
    }));
  }
  return [];
}

async function subscribeSmsNotification(number) {
  const userType = AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL';
  let userId = null;
  const impersonatedUserId = sessionStorage.getItem('x-imp-user-id');
  if (impersonatedUserId) {
    try {
      const impersonatedUserBy = JSON.parse(sessionStorage.getItem('IMPERSONATED_BY_USER'));
      userId = impersonatedUserBy.id;
    } catch (error) {}
  } else {
    userId = AuthUtils.getUserId();
  }

  if (!userId) {
    throw new Error('No valid user found');
  }
  const url = `${ApiRoutes.USERS()}/${userId}/number?number=${number}&userType=${userType}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {});

  if (res.data) {
    console.log(res.data);
    return res.data;
  }
}

async function resendInvitation() {
  let userId = null;
  const impersonatedUserId = sessionStorage.getItem('x-imp-user-id');
  if (impersonatedUserId) {
    try {
      const impersonatedUserBy = JSON.parse(sessionStorage.getItem('IMPERSONATED_BY_USER'));
      userId = impersonatedUserBy.id;
    } catch (error) {}
  } else {
    userId = AuthUtils.getUserId();
  }

  if (!userId) {
    throw new Error('No valid user found');
  }
  const url = `${ApiRoutes.USERS()}/${userId}/resend-number-verification-sms`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data;
  }
}

async function getSubscriptionDetails() {
  let userId = null;
  const impersonatedUserId = sessionStorage.getItem('x-imp-user-id');
  if (impersonatedUserId) {
    try {
      const impersonatedUserBy = JSON.parse(sessionStorage.getItem('IMPERSONATED_BY_USER'));
      userId = impersonatedUserBy.id;
    } catch (error) {}
  } else {
    userId = AuthUtils.getUserId();
  }

  if (!userId) {
    throw new Error('No valid user found');
  }
  const url = `${ApiRoutes.USERS()}/${userId}/number-verification-status`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data;
  }
}

const UserService = Object.freeze({
  getTherapyById,
  getAssignee,
  subscribeSmsNotification,
  resendInvitation,
  getSubscriptionDetails
});

export default UserService;
