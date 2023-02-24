const axios = require("axios");
const { log, logOk, logE } = require("../utils/log");

class HttpResponse {
    constructor(status, headers, data, error) {
        this.status = status;
        this.headers = headers;
        this.data = data;
        this.error = error;
    }
}

async function httpGet(url, options) {
    let httpResponse = new HttpResponse();

    log(`http GET to ${url} with options ${JSON.stringify(options)}`);

    await axios
        .get(url, options)
        .then((response) => {
            httpResponse.status = response.status;
            httpResponse.headers = response.headers;
            httpResponse.data = response.data;
            logOk(
                `http GET to ${url} with options ${JSON.stringify(
                    options
                )} result: ${JSON.stringify(httpResponse)}`
            );
        })
        .catch((error) => {
            error = JSON.parse(JSON.stringify(error));
            httpResponse.error = error;
            httpResponse.headers = error.headers;
            httpResponse.status = error.status;
            logE(
                `http GET to ${url} with options ${JSON.stringify(
                    options
                )} error: ${JSON.stringify(httpResponse)}`
            );
        });

    return httpResponse;
}

module.exports = { httpGet, HttpResponse };
