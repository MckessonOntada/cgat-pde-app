import ApiRoutes from '../ApiRoutes';
import HttpResourceService, { httpVerb } from '../HttpResourceService';

async function getTherapyById(id) {
  const url = `${ApiRoutes.THERAPIES()}/${id}`;
  const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  if (res.data) {
    return res.data;
  }
  return [];
}

const UserService = Object.freeze({
  getTherapyById
});

export default UserService;
