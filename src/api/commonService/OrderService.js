import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import AuthUtils from '@src/util/AuthUtils';

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

const OrderService = Object.freeze({
  getTherapies,
  getTherapyDetailsById
});

export default OrderService;
