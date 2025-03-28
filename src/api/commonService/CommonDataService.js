import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { useQuery } from 'react-query';

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
  const res = await HttpResourceService.callRest(
    `${ApiRoutes.USERS_PROVISIONING_ORGLIST_PUBLIC}?${serializeParams(requestParams)}`,
    httpVerb.GET,
    {}
  );
  res.data.content = res.data?.content?.map((item) => ({ ...item, label: item.name, value: item.name, isChecked: false }));
  return res.data;
}

const useOrganizationLogo = (logUrl, practiceId) => {
  return useQuery(
    [`organizationLogo_${practiceId}`, logUrl],
    async () => {
      const response = await HttpResourceService.callRest(
        `${ApiRoutes.LOGO}/${practiceId || 1}/logo`,
        httpVerb.GET,
        {},
        {},
        false,
        false,
        'blob'
      );
      const blob = response.data;
      return URL.createObjectURL(blob);
    },
    {
      retry: 1,
      enabled: !!practiceId
    }
  );
};

async function resetPassword() {
  const url = `${ApiRoutes.RESET_PASSWORD()}`;
  const res = await HttpResourceService.callRest(url, httpVerb.POST, {}, {
    'Content-Type': 'application/json'
  });
  if (res.data) {
    return res.data;
  }
  return [];
}

const CommonDataService = Object.freeze({
  getOrganizationList,
  getOrganizationListAsOptions,
  getOrganizationListAsPublic,
  useOrganizationLogo,
  resetPassword
});

export default CommonDataService;
