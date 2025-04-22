import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';
import CommonUtils from '@src/util/CommonUtils';

async function getTherapyById(id) {
  const url = `${ApiRoutes.THERAPIES()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

async function getAssignee(requestParams) {
  const url = `${ApiRoutes.USERS()}?${serializeParams(requestParams)}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});

  if (res.data) {
    return res.data.content.map((item) => ({
      value: item.id,
      label: CommonUtils.getFullName(item.name)
    }));
  }
  return [];
}

const UserService = Object.freeze({
  getTherapyById,
  getAssignee
});

export default UserService;
