import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

function sanitizeString(input) {
  if (typeof input !== 'string' || !input) return '';

  return input.trim();
}

async function getAllProviders(params) {
  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers?${serializeParams(
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
  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers/${id}/activate`;
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
  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers/${id}/deactivate`;
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

  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers/${id}`;
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

  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers/${id}`;
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
      deaNumber: dea,
      npiNumber: npi,
      phoneNumber: phone,
      city: sanitizeString(address?.city),
      zip: sanitizeString(address?.zip),
      state: sanitizeString(address?.state)
    };

    return sanitizedResponse;
  }
  return {};
}

async function addProvider(payload) {
  if (!payload) {
    throw new Error('Payload is required to add provider.');
  }

  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers`;
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
  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers/upload`;

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

async function linkProvidersToAccount(providerIds, accountIds) {
  if (!Array.isArray(providerIds))
    throw new Error('Provider Ids must be an array.');
  if (!Array.isArray(accountIds))
    throw new Error('Account Ids must be an array.');

  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers/link-accounts`;
  const res = await HttpResourceService.callRest(
    url,
    httpVerb.PATCH,
    { providerIds, accountIds },
    {
      'Content-Type': 'application/json',
      accept: 'application/json'
    }
  );

  return res.data || {};
}
async function getSpAccountListByProviderId(providerId, requestParams) {
  const url = `${ApiRoutes.ORGANIZATION_BASE()}providers/${providerId}/accounts?${serializeParams(
    requestParams
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {
    'Content-Type': 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return [];
}
const ProviderService = Object.freeze({
  getAllProviders,
  activateProvider,
  deactivateProvider,
  updateProvider,
  getProviderDetailsById,
  addProvider,
  uploadProvider,
  linkProvidersToAccount,
  getSpAccountListByProviderId
});

export default ProviderService;
