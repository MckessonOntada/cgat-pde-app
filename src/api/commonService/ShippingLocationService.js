import { useQuery } from 'react-query';
import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

export const getShippingLocationList = async (requestParams, accid, selectedOrgId) => {
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/${accid}/shipping-locations?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
};

async function getShippingLocationListById(ShippingLocationId) {
  if (!ShippingLocationId) throw new Error('Shipping Location id is missing.Shipping Location id is required to fetch details.');

  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function saveShippingLocation(payload) {
  const { accountId: accid, practiceId: selectedOrgId } = payload;
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/${accid}/shipping-locations`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function removeShippingLocation(ShippingLocationIds, selectedOrgId, accid) {
  if (!ShippingLocationIds) throw new Error('Shipping Location id is missing. Shipping Location id  is required to fetch details.');
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/${accid}/shipping-locations`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE, ShippingLocationIds);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function updateShippingLocation(ShippingLocationId, payload) {
  if (!ShippingLocationId) throw new Error('Shipping Location id is missing. Shipping Location id is required to fetch details.');
  const { accountId: accid, practiceId: selectedOrgId } = payload;
  const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrgId}/accounts/${accid}/shipping-locations/${ShippingLocationId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PUT, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

const ShippingLocationService = Object.freeze({
  getShippingLocationList,
  getShippingLocationListById,
  saveShippingLocation,
  removeShippingLocation,
  updateShippingLocation
});

export default ShippingLocationService;
