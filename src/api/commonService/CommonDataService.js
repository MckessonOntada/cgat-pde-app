import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';

function getOrganizationList(requestParams) {
  return async (dispatch) => {
    const res = await HttpResourceService.callRest(
      `${ApiRoutes.PUBLIC_ORGANIZATIONS}?${serializeParams(requestParams)}`, // Use practice id from organization
      httpVerb.GET,
      {}
    );
    res.data.content = res.data?.content?.map((item) => ({ ...item, label: item.name, value: item.id, isChecked: false }));
    // dispatch(updateOrganizationList(res.data))
    return res.data;
  };
}

async function getOrganizationListAsOptions(requestParams) {
  const res = await HttpResourceService.callRest(
    `${ApiRoutes.PUBLIC_ORGANIZATIONS}?${serializeParams(requestParams)}`, // Use practice id from organization
    httpVerb.GET,
    {}
  );
  res.data.content = res.data?.content?.map((item) => ({ ...item, label: item.name, value: item.id, isChecked: false }));
  return res.data;
}

async function getOrganizationListAsPublic(requestParams) {
  const res = await HttpResourceService.callRest(`${ApiRoutes.USERS_PROVISIONING_ORGLIST_PUBLIC}?${serializeParams(requestParams)}`, httpVerb.GET, {});
  res.data.content = res.data?.content?.map((item) => ({ ...item, label: item.name, value: item.name, isChecked: false }));
  return res.data;
}

const CommonDataService = Object.freeze({ getOrganizationList, getOrganizationListAsOptions, getOrganizationListAsPublic });

export default CommonDataService;
