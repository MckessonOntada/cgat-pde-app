import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import AuthUtils from '@src/util/AuthUtils';

async function getOrders(requestParams) {
  const url = `${ApiRoutes.ORDERS}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getOrderById(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS}/${orderId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function setPatientDetails(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS}/${orderId}/patient`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function setAdditionalDetails(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS}/${orderId}/additional-details`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function setAccount(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS}/${orderId}/account`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function getTherapies(requestParams) {
  const userId = AuthUtils.getUserId();
  const url = `${ApiRoutes.ORDER(userId)}/therapies?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getTherapyDetailsById(therapyId) {
  const userId = AuthUtils.getUserId();
  const url = `${ApiRoutes.ORDER(userId)}/therapies/${therapyId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data || {};
}

async function getSoldToAccounts(therapyId, query) {
  const userId = AuthUtils.getUserId();
  let url = `${ApiRoutes.ORDER(userId)}/therapies/${therapyId}/soldtoaccounts`;
  if (query) {
    url += `?query=${query}`;
  }
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getShippingAddressForTherapyByAccountId(therapyId, accountId, requestParams) {
  const userId = AuthUtils.getUserId();
  const url = `${ApiRoutes.ORDER(userId)}/therapies/${therapyId}/soldtoaccount/${accountId}/shiptoaccounts?${serializeParams(
    requestParams
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

const OrderService = Object.freeze({
  getOrders,
  getOrderById,
  getTherapies,
  getTherapyDetailsById,
  getSoldToAccounts,
  getShippingAddressForTherapyByAccountId,
  setPatientDetails,
  setAdditionalDetails,
  setAccount
});

export default OrderService;
