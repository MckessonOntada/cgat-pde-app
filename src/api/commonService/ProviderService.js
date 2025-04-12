import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

function sanitizeString(input) {
  if (typeof input !== 'string' || !input) return '';

  return input
    .trim() // remove leading/trailing spaces
    .replace(/</g, '&lt;') // escape <
    .replace(/>/g, '&gt;') // escape >
    .replace(/"/g, '&quot;') // escape "
    .replace(/'/g, '&#39;') // escape '
    .replace(/&/g, '&amp;'); // escape &
}

async function getAllProviders(params) {
  const url = `${ApiRoutes.ORGANIZATION_BASE}providers?${serializeParams(
    params
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, null, {
    'Content-Type': 'application/json;charset=utf-8',
    accept: 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return {};
}

async function activateProvider(id) {
  if (!id) {
    throw new Error('Provider ID is required to activate a provider.');
  }
  const url = `${ApiRoutes.ORGANIZATION_BASE}providers/${id}/activate`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {
    accept: 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return {};
}

async function deactivateProvider(id) {
  if (!id) {
    throw new Error('Provider ID is required to deactivate a provider.');
  }
  const url = `${ApiRoutes.ORGANIZATION_BASE}providers/${id}/deactivate`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, {
    accept: 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return {};
}

async function updateProvider(id, payload) {
  if (!id) {
    throw new Error('Provider ID is required to update provider.');
  }
  if (!payload) {
    throw new Error('Payload is required to update provider.');
  }

  const url = `${ApiRoutes.ORGANIZATION_BASE}providers/${id}/`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload, {
    'Content-Type': 'application/json;charset=utf-8',
    accept: 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getProviderDetailsById(id) {
  if (!id) {
    throw new Error('Provider ID is required to get provider details.');
  }

  const url = `${ApiRoutes.ORGANIZATION_BASE}providers/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {
    accept: 'application/json'
  });

  if (res.data) {
    const { address, dea, name, npi, phone } = res.data;

    const sanitizedResponse = {
      address1: sanitizeString(address?.address1),
      address2: sanitizeString(address.address2),
      firstName: sanitizeString(name.firstName),
      middleName: sanitizeString(name.middleName),
      lastName: sanitizeString(name.lastName),
      deaNumber: sanitizeString(name.dea),
      npiNumber: npi,
      phoneNumber: phone,
      city: sanitizeString(name.city),
      zip: sanitizeString(name.zip),
      state: sanitizeString(name.state)
    };

    return sanitizedResponse;
  }
  return {};
}

async function addProvider(payload) {
  if (!payload) {
    throw new Error('Payload is required to add provider.');
  }

  const url = `${ApiRoutes.ORGANIZATION_BASE}providers/`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload, {
    'Content-Type': 'application/json;charset=utf-8',
    accept: 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return {};
}

async function uploadProvider(payload) {
  const url = `${ApiRoutes.ORGANIZATION_BASE}providers/upload`;

  const response = await HttpResourceService.callRest(
    url,
    httpVerb.POST,
    payload,
    {
      'Content-Type': 'multipart/form-data'
    }
  );

  return response;
}

const ProviderService = Object.freeze({
  getAllProviders,
  activateProvider,
  deactivateProvider,
  updateProvider,
  getProviderDetailsById,
  addProvider,
  uploadProvider
});

export default ProviderService;
