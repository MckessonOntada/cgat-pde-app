import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import ApiRoutes from '@src/api/ApiRoutes';

let ORG_LIST = [];

const getOrganizationList = async (requestParams) => {
    if (ORG_LIST.length > 0) {
        return ORG_LIST
    }
    
    const res = await HttpResourceService.callRest(
        `${ApiRoutes.PUBLIC_ORGANIZATIONS}?${serializeParams(requestParams)}`, // Use practice id from organization
        httpVerb.GET,
        {}
    );

    ORG_LIST = res.data;

    return res.data;
}

const CommonDataService = Object.freeze({ getOrganizationList });

export default CommonDataService;