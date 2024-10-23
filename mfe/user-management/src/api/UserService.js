import EndPointsConfig from "./EndPoints.constants";
import { HttpService } from '@mfe/http-client';

class UserService extends HttpService{
    constructor(){
        const baseURL = process.env.REACT_APP_USER_ACCESS_POINT
        super(baseURL);
    }
    getUsers = async () => {
        return await this.httpClient.get(EndPointsConfig.USERS);
    }
    getUserDetailsById = async (id) => {
        return await this.httpClient.get(EndPointsConfig.GET_USER_DETAILS(id));
    }
}

const userService = new UserService();
export default userService;