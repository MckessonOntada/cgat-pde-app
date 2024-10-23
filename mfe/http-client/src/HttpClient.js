import getAxiosInstance from './AccessPoint';
import defaultAccessPoint from './AccessPoint';

const defaultConfig = {
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'CORS',
    withCredentials: true
};


class HttpClient {
    constructor(baseUrl) {
        this.accessPoint = getAxiosInstance(baseUrl);
    }
    async get(url, customConfig = {}) {
        const config = { ...defaultConfig, ...customConfig };
        try {
            const response = await this.accessPoint.get(url, config);
            return response.data;
        } catch (error) {
            console.error(`GET request failed for ${url}:`, error);
            throw error;
        }
    }
    async post(url, body, customConfig = {}) {
        const config = { ...defaultConfig, ...customConfig };
        try {
            const response = await this.accessPoint.post(url, body, config);
            return response.data;
        } catch (error) {
            console.error(`GET request failed for ${url}:`, error);
            throw error;
        }
    }
    async put(url, body, customConfig = {}) {
        const config = { ...defaultConfig, ...customConfig };
        try {
            const response = await this.accessPoint.put(url, body, config);
            return response.data;
        } catch (error) {
            console.error(`GET request failed for ${url}:`, error);
            throw error;
        }
    }
    async delete(url, customConfig = {}) {
        const config = { ...defaultConfig, ...customConfig };
        try {
            const response = await this.accessPoint.delete(url, config);
            return response.data;
        } catch (error) {
            console.error(`GET request failed for ${url}:`, error);
            throw error;
        }
    }
}

export default HttpClient;