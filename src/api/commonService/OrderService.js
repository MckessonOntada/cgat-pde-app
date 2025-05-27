import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import CommonUtils from '@src/util/CommonUtils';

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
    res.data = {
      content: [
        {
          tradeName: 'Ibrance',
          channelType: 'SPECIALITY_PHARMA',
          therapies: [
            {
              id: '4',
              materialNumber: 'sp2',
              materialDescription: 'Ibrance 125mg Capsule',
              ndc: '00069-0820-01',
              strength: '125mg',
              dosage: '125mg',
              genericName: 'palbociclib',
              manufacturerName: 'Pfizer',
              formulation: 'Capsule'
            }
          ]
        },
        {
          tradeName: 'Avastin',
          channelType: 'BUY_AND_BILL',
          therapies: [
            {
              id: '1',
              materialNumber: 'bb1',
              materialDescription: 'Avastin 100mg/4mL Injection',
              ndc: '50242-060-01',
              strength: '100mg/4mL',
              dosage: '100mg',
              genericName: 'bevacizumab',
              manufacturerName: 'Genentech',
              formulation: 'Injection'
            },
            {
              id: '2',
              materialNumber: 'bb2',
              materialDescription: 'Avastin 400mg/16mL Injection',
              ndc: '50242-060-02',
              strength: '400mg/16mL',
              dosage: '400mg',
              genericName: 'bevacizumab',
              manufacturerName: 'Genentech',
              formulation: 'Injection'
            }
          ]
        },
        {
          tradeName: 'Revlimid',
          channelType: 'SPECIALITY_PHARMA',
          therapies: [
            {
              id: '3',
              materialNumber: 'sp1',
              materialDescription: 'Revlimid 10mg Capsule',
              ndc: '59572-1010-01',
              strength: '10mg',
              dosage: '10mg',
              genericName: 'lenalidomide',
              manufacturerName: 'Bristol Myers Squibb',
              formulation: 'Capsule'
            }
          ]
        }
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 20,
        sort: {
          empty: false,
          unsorted: false,
          sorted: true
        },
        offset: 0,
        unpaged: false,
        paged: true
      },
      last: true,
      totalPages: 1,
      totalElements: 3,
      first: true,
      size: 20,
      number: 0,
      sort: {
        empty: false,
        unsorted: false,
        sorted: true
      },
      numberOfElements: 3,
      empty: false
    };

    if (res.data?.content) {
      res.data.content.forEach((i) => {
        i.isExpandable = Boolean(CommonUtils.isNonEmptyArray(i.therapies));
      });
    }

    console.log(res.data);

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
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/soldtoaccount/${accountId}/shiptoaccounts?${serializeParams(requestParams)}`;
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
  getTherapyDetailsByCrossWalkId
});

export default OrderService;
