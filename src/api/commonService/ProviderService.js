import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getAllProviders(params) {
  const url = `${ApiRoutes.ORGANIZATIONS()}/providers?${serializeParams(
    params
  )}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function activateProvider(id) {
  if (!id) {
    throw new Error('Provider ID is required to activate a provider.');
  }
  const url = `${ApiRoutes.ORGANIZATIONS()}/providers/${id}/activate`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function deactivateProvider(id) {
  if (!id) {
    throw new Error('Provider ID is required to deactivate a provider.');
  }
  const url = `${ApiRoutes.ORGANIZATIONS()}/providers/${id}/deactivate`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH);
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

  const url = `${ApiRoutes.ORGANIZATIONS()}/providers/${id}/`;
  const res = await HttpResourceService.callRest(url, httpVerb.PATCH, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function getProviderDetailsById(id) {
  if (!id) {
    throw new Error('Provider ID is required to get provider details.');
  }

  const url = `${ApiRoutes.ORGANIZATIONS()}/providers/${id}/`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function addProvider(payload) {
  if (!payload) {
    throw new Error('Payload is required to add provider.');
  }

  const url = `${ApiRoutes.ORGANIZATIONS()}/providers/`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
  if (res.data) {
    return res.data;
  }
  return {};
}

async function uploadProvider(payload) {
  const { file } = payload;
  const url = `${ApiRoutes.ORGANIZATIONS()}/providers/upload`;

  const res = await HttpResourceService.callRest(
    url,
    httpVerb.POST,
    { file },
    {
      'Content-Type': 'multipart/form-data'
    }
  );

  if (res.data) return res.data;

  return {};
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
