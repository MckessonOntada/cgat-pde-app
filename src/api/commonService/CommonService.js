import HttpResourceService, { httpVerb } from '../HttpResourceService';
import ApiRoutes from '../ApiRoutes';

const getUserDetails = () => {
  return sessionStorage.getItem('USERNAME');
};

const getJwtDecode = async () => {
  try {
    const { data } = await HttpResourceService.callRest(ApiRoutes.GET_JWT_DECODE, httpVerb.GET);
    return data;
  } catch (error) {
    console.log(error);
    throw Error('Unable to fetch data');
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

const CommonService = Object.freeze({ getUserDetails, getJwtDecode, generateFile });

export default CommonService;
