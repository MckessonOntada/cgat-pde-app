import EndPointsConstants from "./EndPoints.constants";
import { HttpService } from '@mfe/http-client';

class AuthService extends HttpService {
    constructor(){
        const baseURL = process.env.REACT_APP_AUTH_ACCESS_POINT
        super(baseURL);
    }
    login = async (credentials) => {
        const response = await this.httpClient.post(EndPointsConstants.LOGIN, credentials);
        return response;
    }
    logout = async () => { }
    refreshToken = async () => { }
    getUserProfile = async () => { }
    updateUserProfile = async (data) => { }
    verifyEmail = async (token) => { }
    resetPassword = async (email) => { }
    changePassword = async (currentPassword, newPassword) => { }
    logoutAllSessions = async () => { }
}

const authService = new AuthService();
export default authService;