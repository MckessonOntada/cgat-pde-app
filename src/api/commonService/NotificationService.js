import { serializeParams } from '@src/util/ApiUtils';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

const { default: ApiRoutes } = require('../ApiRoutes');

async function getNotificationGroups(params) {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group?${serializeParams(params)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return {
      content: [
        {
          id: 1,
          groupName: 'Appointment Alerts',
          createdBy: 'Dr. Mehta',
          createdOn: '01/12/2025'
        },
        {
          id: 2,
          groupName: 'Lab Report Updates',
          createdBy: 'System Admin',
          createdOn: '02/03/2025'
        },
        {
          id: 3,
          groupName: 'Billing Reminders',
          createdBy: 'Finance Team',
          createdOn: '18/03/2025'
        },
        {
          id: 4,
          groupName: 'Critical Patient Alerts',
          createdBy: 'Nurse Supervisor',
          createdOn: '04/07/2025'
        },
        {
          id: 4,
          groupName: 'General Notifications',
          createdBy: 'Admin',
          createdOn: '22/05/2025'
        }
      ]
    };
    // return res.data;
  }
  return {};
}

async function getNotificationGroup(groupId) {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group/${groupId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function createNotificationGroup(payload) {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function updateNotificationGroup(groupId, payload) {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group/${groupId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function deleteNotificationGroup(groupId) {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group/${groupId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function activateNotificationGroup(groupId) {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group/${groupId}/activate`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getAssignedNotificationGroup() {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group/users/current/assigned-groups`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getNotificationTriggers() {
  const url = `${ApiRoutes.BASE_ORDER_SERVICE()}notification-group/triggers`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

export default Object.freeze({
  getNotificationGroups,
  getNotificationGroup,
  createNotificationGroup,
  updateNotificationGroup,
  deleteNotificationGroup,
  activateNotificationGroup,
  getAssignedNotificationGroup,
  getNotificationTriggers
});
