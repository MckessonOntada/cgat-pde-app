import { useQuery } from 'react-query';
import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

export const getShippingLocationList = async (requestParams) => {
  const result = await import('../../mfe/order-management/pages/system-configuration/manage-spaccount/mockData/ShippingLocationData');

  return {
    data: result.default.content || [],
    totalElements: result.default.totalElements,
    totalPages: result.default.totalPages
  };
};

async function getShippingLocationListById(ShippingLocationId) {
  if (!ShippingLocationId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');

  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function saveShippingLocationDetails(payload) {}

async function removeShippingLocation(ShippingLocationId) {
  if (!ShippingLocationId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');
  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  if (res.data) {
    return res.data;
  }

  return {};
}

async function updateShippingLocation(ShippingLocationId, requestBody) {
  if (!ShippingLocationId) throw new Error('SP Material id is missing. SP Material id is required to fetch details.');

  const url = '';
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, requestBody);

  if (res.data) {
    return res.data;
  }

  return {};
}

const ShippingLocationService = Object.freeze({
  getShippingLocationList,
  getShippingLocationListById,
  saveShippingLocationDetails,
  removeShippingLocation,
  updateShippingLocation
});

export default ShippingLocationService;
