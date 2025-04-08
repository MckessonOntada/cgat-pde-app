import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import { ORDER_TABS, TAB_FILTERS } from '@src/mfe/order-management/pages/orders/config';

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

async function savePatientDetails(orderId, payload, skipDuplicateCheck = false) {
  if (!orderId) throw new Error('Order id is missing. Order id is required to fetch details.');

  const url = `${ApiRoutes.ORDERS()}/${orderId}/patient?skipDuplicateCheck=${skipDuplicateCheck}`;
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
    return res.data;
  }
  return [];
}

async function getTherapyDetailsById(therapyId) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  return res.data || {};
}

async function getSoldToAccounts(therapyId, query) {
  let url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/soldtoaccounts`;
  if (query) {
    url += `?${query}`;
  }
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getShippingAddressForTherapyByAccountId(therapyId, accountId, requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/soldtoaccount/${accountId}/shiptoaccounts?${serializeParams(
    requestParams
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getPriceDetails(therapyId, accountId, shipToAccountId, variant = null) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/soldtoaccount/${accountId}/shiptoaccount/${shipToAccountId}/catalog${
    !!variant ? `?variantType=${variant}` : ''
  }`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getVariants(therapyId, accountId, shipToAccountId, requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/soldtoaccount/${accountId}/shiptoaccount/${shipToAccountId}/variants?${serializeParams(
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

async function getProgramAndChannelConfig(therapyId, requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/programs-channels?${serializeParams(requestParams)}`;
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
    const tabs = Object.keys(ORDER_TABS);

    const results = await Promise.allSettled(
      tabs.map((tab) => {
        const params = {
          pageNo: 0,
          pageSize: 8,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          statuses: TAB_FILTERS[tab].join(','),
          showMyOrders: false
        };
        return getOrders(params);
      })
    );

    const orderCount = {};
    results.forEach((result, index) => {
      orderCount[tabs[index]] = result.status === 'fulfilled' ? result.value?.totalElements : 0;
    });

    return orderCount;
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
  downloadDocument
});

export default OrderService;
