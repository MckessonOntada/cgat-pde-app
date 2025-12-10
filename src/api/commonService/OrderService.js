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

async function getPhysicianOrders(requestParams) {
  const url = `${ApiRoutes.ORDERS()}/user/current/review?${serializeParams(requestParams)}`;
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

async function savePatientDetails(orderId, payload, skipDuplicateCheck = false, channelType, isDraft = false, isSendNotification = true) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');
  const params = {
    skipDuplicateCheck
  };
  if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
    params.channelType = channelType;
  }
  params.isDraft = isDraft;
  params.sendNotification = isSendNotification;
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

async function savePayerDetails(orderId, isPayerDetailsRequired, insuranceDetails, channelType, isDraft = false, isSendNotification = true) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to save payer details');

  const params = {
    isPayerDetailsRequired,
    isDraft,
    sendNotification: isSendNotification
  };
  if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
    params.channelType = channelType;
  }

  const url = `${ApiRoutes.ORDERS()}/${orderId}/payer?${serializeParams(params)}`;
  try {
    const res = await HttpResourceService.callRest(url, httpVerb.PATCH, insuranceDetails);
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    throw { err, payload };
  }
}

async function saveAdditionalDetails(orderId, payload, isDraft = false, isSendNotification = true) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');
  const url = `${ApiRoutes.ORDERS()}/${orderId}/additional-details?isDraft=${isDraft}&sendNotification=${isSendNotification}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function saveAccount(orderId, payload, isDraft = false, isSendNotification = true) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/account?isDraft=${isDraft}&sendNotification=${isSendNotification}`;
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

async function reSubmitOrder(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/update-submitted-order`;
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

  const url = `${ApiRoutes.ORDERS()}/${orderId}/ndc`;
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
async function uploadPayerDocument(orderId, data) {
  const { file, side, ...rest } = data;
  const payload = {};
  if (side === 'FRONT') payload.frontImage = file;
  else payload.backImage = file;

  const url = `${ApiRoutes.ORDERS()}/${orderId}/payer/documents?${serializeParams(rest)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload, {
    'Content-Type': 'multipart/form-data'
  });
  if (res.data) return res.data;

  return {};
}
async function uploadDocument(payload) {
  const { orderId, file, channelType } = payload;
  const url = `${ApiRoutes.ORDERS()}/${orderId}/documents?templateId=${orderId}&channelType=${channelType}`;

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

async function getTherapyDetailsByTradeName(tradeName, channelType) {
  if (!tradeName) throw new Error('Trade name is missing. Trade name is required to fetch therapy details.');
  const url = `${ApiRoutes.USERS()}/current/therapies/details/${tradeName}?channelType=${channelType}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) return res.data;
}
async function getTherapyDetailsByTradeName2(tradeName, channelType) {
  if (!tradeName) throw new Error('Trade name is missing. Trade name is required to fetch therapy details.');
  let url = `${ApiRoutes.THERAPIES()}/config/${tradeName}`;
  if (channelType) {
    url += `?channelType=${channelType}`;
  }
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) return res.data;
}

async function getBackendOrderId(OrderID) {
  const url = `${ApiRoutes.ORDERS()}/backendOrderId/${OrderID}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getTherapyDetailsByNDC(ndcNumber, channelType) {
  if (!ndcNumber) throw new Error('NDC number is missing. NDC number is required to fetch therapy details.');
  const url = `${ApiRoutes.THERAPIES()}/therapy/${ndcNumber}?channelType=${channelType}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) return res.data;
}

async function getManufacturerLogo(therapyId) {
  const url = `${ApiRoutes.THERAPIES()}/${therapyId}/manufacturer/logo`;

  const response = await HttpResourceService.callRest(url, httpVerb.GET, null, { responseType: 'arraybuffer' }, null, null, null, 'blob');
  const contentType = response.headers['content-type'] || 'image/jpeg';

  const blob = new Blob([response.data], { type: contentType });
  return URL.createObjectURL(blob);
}

async function getDiagnosisCodes(query = '') {
  let url = `${ApiRoutes.ORGANIZATION_BASE()}diagnosis-codes`;
  if (query) {
    url += `?query=${query}`;
  }
  const res = await HttpResourceService.callRest(url, httpVerb.GET);

  if (res.data) {
    return res.data;
  }

  return [];
}
async function finalizeOrder(orderId, payload) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/user/current/review/${orderId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  if (res.data) return res.data;
}

async function notifyUser(orderId, eventType) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to Notify User.');
  if (!eventType) throw new Error('Event type is missing. Event type is required to Notify User.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/notify/${eventType}`;
  console.log(url);
  const res = await HttpResourceService.callRest(url, httpVerb.POST);
  if (res.data) return res.data;
}

async function getPrescriptionDetailsByTherapy(therapyId) {
  if (!therapyId) throw new Error('Therapy ID is missing. Trade name is required to fetch prescription details.');
  let url = `${ApiRoutes.THERAPIES()}/config/therapyId/${therapyId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) return res.data;
}

async function getOrderStagesRoles(orderId) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch order stages roles.');
  let url = `${ApiRoutes.ORDERS()}/${orderId}/roleDetails`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) return res.data;
}

async function getTrackingDetails(accountId, trackingNumber) {
  if (!accountId) throw new Error('Account number is missing. Account Number is required to fetch details');
  if (!trackingNumber) throw new Error('Tracking number is missing. Tracking Number is required to fetch details');

  const url = `${ApiRoutes.SHIPMENT(accountId)}/status-history?${serializeParams({ orderNumber: trackingNumber })}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) return res.data;
  return {};
}

const OrderService = Object.freeze({
  createOrder,
  getOrders,
  getPhysicianOrders,
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
  reSubmitOrder,
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
  getTherapyDetailsByTradeName,
  getTherapyDetailsByTradeName2,
  uploadPayerDocument,
  getBackendOrderId,
  getTherapyDetailsByNDC,
  getManufacturerLogo,
  getDiagnosisCodes,
  finalizeOrder,
  notifyUser,
  getPrescriptionDetailsByTherapy,
  getOrderStagesRoles,
  getTrackingDetails
});

export default OrderService;
