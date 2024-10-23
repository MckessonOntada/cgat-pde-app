import axios from 'axios';

function getAxiosInstance(baseURL) {
    const AccessPoint = axios.create({
        baseURL: baseURL,
        timeout: 6000,
        mode: 'cors',
        withCredentials: true,
    });

    const setAuthorizationHeader = (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    };

    const handleRequestError = (error) => {
        return Promise.reject(error);
    };

    const handleResponseError = (error) => {
        const networkErrorMessages = {
            ECONNABORTED: 'This request takes too long to process; it has timed out by the server. Please try again later.',
            ERR_NETWORK: 'Could not connect to the server; please try again.',
        };

        const { response } = error;
        if (response) {
            const { status, data } = response;
            switch (status) {
                case 400:
                    return Promise.reject({ message: 'Bad Request', details: response.data });
                case 401:
                    if (window.location.pathname !== '/login') {
                        clearSessionStorage();
                        window.location.href = '/login';
                    }
                    return Promise.reject({ message: 'Unauthorized', details: response.data });
                case 403:
                    return Promise.reject({ message: 'Forbidden', details: response.data });
                case 404:
                    return Promise.reject({ message: 'Resource Not Found', details: response.data });
                case 500:
                    return Promise.reject({ message: 'Server Error', details: response.data });
                default:
                    const { error: err, type, msg } = data;
                    return Promise.reject({
                        error: err,
                        type,
                        message: msg,
                        status: data.status || false,
                        statusCode: status,
                    });
            }


        }

        if (networkErrorMessages[error.code]) {
            return Promise.reject({
                message: networkErrorMessages[error.code],
                status: false,
                statusCode: -1,
            });
        }

        return Promise.reject({
            message: 'An unexpected error occurred.',
            status: false,
            statusCode: -1,
        });
    };

    const clearSessionStorage = () => {
        const itemsToRemove = ['userInfo', 'token', 'accessMatrix'];
        itemsToRemove.forEach(item => sessionStorage.removeItem(item));
    };

    AccessPoint.interceptors.request.use(setAuthorizationHeader, handleRequestError);
    AccessPoint.interceptors.response.use((response) => response, handleResponseError);

    return AccessPoint;
}



export default getAxiosInstance;
