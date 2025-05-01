import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

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
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
    // return {
    //   createdAt: '2025-04-30T10:13:05.914',
    //   createdBy: {
    //     id: '5442',
    //     role: 'Organization Admin',
    //     roleId: '2523',
    //     name: 'Freddy Zoe Macdonald Rogers',
    //     userName: 'freddy_rogers@yopmail.com',
    //     impersonatedBy: {
    //       id: '12554',
    //       role: 'System Admin',
    //       roleId: '1',
    //       name: 'kapil sin',
    //       userName: 'kapilSuperUser@yopmail.com',
    //       impersonatedBy: null
    //     }
    //   },
    //   updatedAt: '2025-04-30T13:38:14.533',
    //   updatedBy: {
    //     id: '5442',
    //     role: 'Organization Admin',
    //     roleId: '2523',
    //     name: 'Freddy Zoe Macdonald Rogers',
    //     userName: 'freddy_rogers@yopmail.com',
    //     impersonatedBy: {
    //       id: '1',
    //       role: 'System Admin',
    //       roleId: '1',
    //       name: 'DEFAULT DEFAULT',
    //       userName: 'cgat.admin@yopmail.com',
    //       impersonatedBy: null
    //     }
    //   },
    //   id: '9148f867-aa97-4aec-8966-0995914e6e55',
    //   practiceId: '1882',
    //   practiceName: 'Adah Bergstrom',
    //   therapy: {
    //     strength: '40mg',
    //     dropshipIndicator: null,
    //     id: '15',
    //     materialDescription: 'Pantop',
    //     materialNumber: '5',
    //     ndcNumber: 'C002'
    //   },
    //   accountDetails: {
    //     soldToAccount: {
    //       id: '53',
    //       accountName: 'account 53',
    //       accountNumber: 'sc53',
    //       address: {
    //         email: 'account53@mckesson.com',
    //         telephone: 'telephone 53',
    //         houseNumber: 'hn53',
    //         street: 'street 53',
    //         street2: 'street_53 53',
    //         street3: 'street_53 53',
    //         city: 'city53',
    //         district: 'district 53',
    //         state: 's',
    //         country: 'c',
    //         zipCode: 'zip 53'
    //       },
    //       distributionChannel: '20',
    //       division: 'dv',
    //       companyCode: '881e',
    //       channelType: 'SPECIALTY_PHARMA',
    //       cgatIdentifier: 'i53',
    //       salesOrg: '1100'
    //     },
    //     shipToAccount: {
    //       id: '166',
    //       accountName: 'account166',
    //       accountNumber: 'sc166',
    //       address: {
    //         email: 'account166@mckesson.com',
    //         telephone: 'tel 161',
    //         houseNumber: 'hn161',
    //         street: 'street 161',
    //         street2: null,
    //         street3: null,
    //         city: 'city161',
    //         district: 'district161',
    //         state: 's',
    //         country: 'c',
    //         zipCode: 'zip161'
    //       },
    //       distributionChannel: '20',
    //       division: 'dv',
    //       companyCode: '6a51',
    //       channelType: 'SPECIALTY_PHARMA',
    //       cgatIdentifier: null,
    //       salesOrg: 'so61'
    //     }
    //   },
    //   patientId: null,
    //   patient: null,
    //   additionalDetails: null,
    //   catalog: null,
    //   orderCost: null,
    //   status: 'IN_DRAFT',
    //   submittedBy: null,
    //   submittedOn: null,
    //   currentStage: 'PATIENT_DETAILS',
    //   patientDetailsRequired: false,
    //   backendOrderId: null,
    //   approverGroupIds: [],
    //   approver: null,
    //   rejectionDetails: null,
    //   version: 2,
    //   simulatedOn: null,
    //   orderVersion: 0,
    //   versionOwner: null,
    //   isCoiIdRequired: false,
    //   catalogConfiguration: null,
    //   payerDetails: null,
    //   orderPriceUpdated: false,
    //   paporder: false
    // };
  }
  return {};
}

async function savePatientDetails(
  orderId,
  payload,
  skipDuplicateCheck = false
) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/patient?skipDuplicateCheck=${skipDuplicateCheck}`;
  try {
    const res = await HttpResourceService.callRest(
      url,
      httpVerb.PATCH,
      payload
    );
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    throw { err, payload };
  }
}

async function saveAdditionalDetails(orderId, payload) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/additional-details`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function saveAccount(orderId, payload) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/account`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function submitOrder(orderId, payload) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/submit`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function rejectOrder(orderId, rejectionReason) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to reject the order.'
    );
  if (!rejectionReason)
    throw new Error(
      'Reason is missing. Reason is required to reject the order.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/reject`;
  const res = await HttpResourceService.callRest(
    url,
    httpVerb.PATCH,
    rejectionReason
  );

  if (res.data) {
    return res.data;
  }

  return {};
}

async function getTherapies(requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies?${serializeParams(
    requestParams
  )}`;
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

async function getShippingAddressForTherapyByAccountId(
  therapyId,
  accountId,
  requestParams
) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/soldtoaccount/${accountId}/shiptoaccounts?${serializeParams(
    requestParams
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getPriceDetails(
  therapyId,
  accountId,
  shipToAccountId,
  variant = null
) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/soldtoaccount/${accountId}/shiptoaccount/${shipToAccountId}/catalog${
    !!variant ? `?variantType=${variant}` : ''
  }`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function getVariants(
  therapyId,
  accountId,
  shipToAccountId,
  requestParams
) {
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
    const res = await HttpResourceService.callRest(
      `${ApiRoutes.INVENTORY()}/availability/${orderId}`,
      httpVerb.GET
    );
    if (res) {
      return res;
    }
  } catch (error) {
    throw error;
  }
}

async function getProgramAndChannelConfig(therapyId, requestParams) {
  const url = `${ApiRoutes.USERS()}/current/therapies/${therapyId}/programs-channels?${serializeParams(
    requestParams
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }

  return {};
}

async function setOrderAssignToMe(orderId) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/approver/assignToMe`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function setOrderUnassignToMe(orderId) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/approver/release`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function deleteOrder(orderId) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );
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
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );
  const url = `${ApiRoutes.ORDERS()}/${orderId}/simulate`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }

  return {};
}

async function updateTherapy(orderId, requestBody) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to fetch details.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/therapy`;
  const res = await HttpResourceService.callRest(
    url,
    httpVerb.PATCH,
    requestBody
  );

  if (res.data) {
    return res.data;
  }

  return {};
}

async function discardCurrentOrderVersion(orderId) {
  if (!orderId)
    throw new Error(
      'Order id is missing. Order id is required to discard order changes.'
    );

  const url = `${ApiRoutes.ORDERS()}/${orderId}/discard`;
  const res = await HttpResourceService.callRest(url, httpVerb.DELETE);

  if (res.data) {
    return res.data;
  }

  return {};
}

async function getOrderStatusFromSAP(sapOrderId, salesOrgId) {
  if (!sapOrderId)
    throw new Error(
      'SAP Order id is missing. SAP Order id is required to discard order changes.'
    );
  if (!salesOrgId)
    throw new Error(
      'Sales Org id is missing. Sales Org id is required to discard order changes.'
    );

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
  if (!url)
    throw new Error(
      'Document url is missing. Document url is required to download the document.'
    );

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
