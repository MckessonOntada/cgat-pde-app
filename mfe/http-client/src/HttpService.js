import HttpClient from "./HttpClient";

class HttpService{
    constructor(baseUrl){
        this.httpClient = new HttpClient(baseUrl);
    }
    logError = async (error) => {
        const response = await this.httpClient.post('/posts', error);
        return response;
    }
}

export default HttpService;