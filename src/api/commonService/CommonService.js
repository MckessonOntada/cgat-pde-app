import HttpResourceService, { httpVerb } from '../HttpResourceService';
import ApiRoutes from '../ApiRoutes';
import CommonUtils from '@src/util/CommonUtils';
import { SESSION_CONST } from '@src/constants/SessionConstants';
import AuthUtils from '@src/util/AuthUtils';

export const SYSTEM_ADMIN = 'System Admin';
export const CUSTOMER_CENTRE = 'Customer Centre';
export const CUSTOMER_SERVICE = 'Customer Service';
export const TREATMENT_CENTRE_EXECUTIVE = 'Treatment centre Executive';

const getUserDetails = () => {
  return sessionStorage.getItem(SESSION_CONST.USERNAME);
};

const getLoggedInUser = async () => {
  try {
    const { data } = await HttpResourceService.callRest(ApiRoutes.GET_JWT_DECODE, httpVerb.GET);
    return data;
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

const updateSessionStorage = async () => {
  try {
    const userDetails = await getCurrentLoggedInUser();

    if (!CommonUtils.isNonEmptyObject(userDetails)) {
      throw Error('Invalid Login credentials.');
    }

    const activeUserRoleName = userDetails['role']['name'];
    const activeUserName = userDetails['userName'];
    const activeUserId = userDetails['id'];
    const activeUserPermissions = userDetails['permissions'];
    const roleId = userDetails['role']['id'];
    const activeUserPracticeId = userDetails['practiceId'];
    const impersonatedByUsername = userDetails['impersonatedByUser']?.userName;
    const userFullName = `${userDetails?.name.lastName}, ${userDetails?.name.firstName}${
      userDetails?.name.middleName ? ' ' + userDetails.name.middleName : ''
    }`;

    sessionStorage.setItem(SESSION_CONST.USER_ROLE, activeUserRoleName);
    sessionStorage.setItem(SESSION_CONST.USERNAME, impersonatedByUsername || activeUserName);
    sessionStorage.setItem(SESSION_CONST.USER_ID, activeUserId);
    sessionStorage.setItem(SESSION_CONST.USER_PERMISSIONS, activeUserPermissions);
    sessionStorage.setItem(SESSION_CONST.USER_FULL_NAME, userFullName);
    sessionStorage.setItem(SESSION_CONST.ROLE_ID, roleId);

    if (userDetails?.impersonatedByUser) {
      sessionStorage.setItem(SESSION_CONST.IMPERSONATED_BY_USER, JSON.stringify(userDetails.impersonatedByUser));
    }

    if (impersonatedByUsername) {
      sessionStorage.setItem(SESSION_CONST.IMPERSONATE_USERNAME, activeUserName);
    } else {
      sessionStorage.removeItem(SESSION_CONST.IMPERSONATE_USERNAME);
      sessionStorage.removeItem(SESSION_CONST.IMPERSONATED_BY_USER);
    }

    if (activeUserRoleName !== SYSTEM_ADMIN && activeUserRoleName !== CUSTOMER_CENTRE && activeUserRoleName !== TREATMENT_CENTRE_EXECUTIVE) {
      AuthUtils.setPracticeId(activeUserPracticeId);
    }

    return userDetails;
  } catch (error) {
    throw Error(error);
  }
};

const getCurrentLoggedInUser = async () => {
  try {
    const response = await HttpResourceService.callRest(
      ApiRoutes.GET_CURRENT_USER,
      httpVerb.GET,
      {},
      {
        'Content-Type': 'application/json'
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
};

const generateFile = async (file) => {
  try {
    const blob = new Blob([file.blob], { type: file.type });
    const objectURL = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = objectURL;
    a.download = file.fileName;
    a.click();
    return;
  } catch (error) {
    throw Error('Unable to download file :: ', error);
  }
};

const CommonService = Object.freeze({ getUserDetails, getLoggedInUser, generateFile, updateSessionStorage });

export default CommonService;
