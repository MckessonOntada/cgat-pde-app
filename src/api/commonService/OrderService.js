import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import ServiceUtil from './ServiceUtil';

async function createOrder(payload) {
  const url = `${ApiRoutes.ORDERS()}`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getOrders(requestParams) {
  const url = `${ApiRoutes.ORDERS()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getOrderById(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function savePatientDetails(orderId, payload, skipDuplicateCheck = false, channelType) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');
  const params = {
    skipDuplicateCheck
  };
  if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
    params.channelType = channelType;
  }
  const url = `${ApiRoutes.ORDERS()}/${orderId}/patient?${serializeParams(params)}`;
  try {
    const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    throw { err, payload };
  }
}

async function savePayerDetails(orderId, payload, channelType) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to save payer details');

  const params = {};
  if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
    params.channelType = channelType;
  }

  const url = `${ApiRoutes.ORDERS()}/${orderId}/payer?${serializeParams(params)}`;
  try {
    const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    throw { err, payload };
  }
}

async function saveAdditionalDetails(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/additional-details`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function saveAccount(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/account`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function submitOrder(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/submit`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function rejectOrder(orderId, rejectionReason) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to reject the order.');
  if (!rejectionReason) throw new Error('Reason is missing. Reason is required to reject the order.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/reject`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, rejectionReason);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function getTherapies(requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    if (res.data?.content) {
      res.data.content = ServiceUtil.transformTherapies(res.data.content);
    }
    return res.data;
  }
  return [];
}

async function getTherapyDetailsById(therapyId) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data || {};
}

async function getSoldToAccounts(ndc, query) {
  let url = `${ApiRoutes.USERS()}/current/therapies/ndc/${ndc}/soldtoaccounts`;
  if (query) {
    url += `?${query}`;
  }
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getShippingAddressForTherapyByAccountId(ndc, accountId, requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies/ndc/${ndc}/soldtoaccount/${accountId}/shiptoaccounts?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getPriceDetails(ndc, accountId, shipToAccountId, variant = null) {
  const url = `${ApiRoutes.USERS()}/current/therapies/ndc/${ndc}/soldtoaccount/${accountId}/shiptoaccount/${shipToAccountId}/catalog${
    !!variant ? `?variantType=${variant}` : ''
  }`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getVariants(config, requestParams) {
  const { soldToAccountId, shipToAccountId, ndc } = config;
  const url = `${ApiRoutes.USERS()}/current/therapies/${ndc}/soldtoaccount/${soldToAccountId}/shiptoaccount/${shipToAccountId}/variants?${serializeParams(
    requestParams
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getInventoryStatus(orderId) {
  try {
    const res = await HttpResourceService.callRest(`${ApiRoutes.INVENTORY()}/availability/${orderId}`, httpVerb.GET);
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
}

async function getProgramAndChannelConfig(ndc, requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies/ndc/${ndc}/programs-channels?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function setOrderAssignToMe(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/approver/assignToMe`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function setOrderUnassignToMe(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/approver/release`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function deleteOrder(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');
  const url = `${ApiRoutes.ORDERS()}/${orderId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getAssignedGroups() {
  const url = `${ApiRoutes.APPROVER_GROUP()}/users/current/assigned-groups`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function simulateOrder(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');
  const url = `${ApiRoutes.ORDERS()}/${orderId}/simulate`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }

  return {};
}

async function updateTherapy(orderId, requestBody) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/therapy`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, requestBody);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function discardCurrentOrderVersion(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to discard order changes.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/discard`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function getOrderStatusFromSAP(sapOrderId, salesOrgId) {
  if (!sapOrderId) throw new Error('SAP Order id is missing. SAP Order id is required to discard order changes.');
  if (!salesOrgId) throw new Error('Sales Org id is missing. Sales Org id is required to discard order changes.');

  const url = `${ApiRoutes.SAP_ORDERS()}/${sapOrderId}/sales-org/${salesOrgId}/status`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function getOrderCountByStatus() {
  try {
    const url = `${ApiRoutes.ORDERS()}/orders-count-by-status`;
    const res = await HttpResourceService.callRest(url, httpVerb.GET);

    if (res.data) {
      return res.data;
    }

    return {};
  } catch (error) {
    console.error('Error fetching order counts:', error);
    throw error;
  }
}

async function downloadDocument(url) {
  if (!url) throw new Error('Document url is missing. Document url is required to download the document.');

  try {
    const documentUrl = `${ApiRoutes.ORDERS()}/documents/download?documentPath=${url}`;
    const res = await HttpResourceService.callRest(documentUrl, httpVerb.GET);

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
  return {};
}

async function getTherapyDetailsByCrossWalkId(therapyId) {
  const url = `${ApiRoutes.USERS()}/current/therapies/therapyDetails/${therapyId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data || {};
}

async function uploadOrderDocument(orderId, payload) {
  const url = `${ApiRoutes.ORDERS()}/${orderId}/documents`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  return res;
}

async function uploadDocument(payload) {
  const { orderId, file } = payload;
  const url = `${ApiRoutes.ORDERS()}/${orderId}/documents?templateId=${orderId}`;

  const res = await HttpResourceService.callRest(
    url,
    httpVerb.POST,
    { file },
    {
      'Content-Type': 'multipart/form-data'
    }
  );

  if (res.data) return res.data;
}

async function getTherapyDetailsByTradeName(tradeName) {
  if (!tradeName) throw new Error('Trade name is missing. Trade name is required to fetch therapy details.');
  const url = `${ApiRoutes.USERS()}/current/therapies/details/${tradeName}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) return res.data;
}

const OrderService = Object.freeze({
  createOrder,
  getOrders,
  getOrderById,
  getTherapies,
  getTherapyDetailsById,
  getSoldToAccounts,
  getShippingAddressForTherapyByAccountId,
  getPriceDetails,
  getVariants,
  getInventoryStatus,
  savePatientDetails,
  saveAdditionalDetails,
  savePayerDetails,
  saveAccount,
  getProgramAndChannelConfig,
  submitOrder,
  rejectOrder,
  setOrderAssignToMe,
  setOrderUnassignToMe,
  deleteOrder,
  getAssignedGroups,
  simulateOrder,
  updateTherapy,
  getOrderStatusFromSAP,
  discardCurrentOrderVersion,
  getOrderCountByStatus,
  downloadDocument,
  getTherapyDetailsByCrossWalkId,
  uploadOrderDocument,
  uploadDocument,
  getTherapyDetailsByTradeName
});

export default OrderService;
