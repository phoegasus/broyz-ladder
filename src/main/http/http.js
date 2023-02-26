const axios = require("axios");
const { MAX_UNSIGNED_VALUE } = require("long");
const { logToFile } = require("../utils/log");
const { AXIOS_TIMEOUT, AXIOS_TIMEOUT_RETRIES } = process.env;

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

    options.timeout = AXIOS_TIMEOUT;

    logToFile(`http GET to ${url} with options ${JSON.stringify(options)}`);

    let retries = 0;
    let retry;

    do {
        retry = false;
        await axios
            .get(url, options)
            .then((response) => {
                httpResponse.status = response.status;
                httpResponse.headers = response.headers;
                httpResponse.data = response.data;
                logToFile(
                    `http GET to ${url} with options ${JSON.stringify(
                        options
                    )} result: ${JSON.stringify(httpResponse)}`
                );
            })
            .catch((error) => {
                error = JSON.parse(JSON.stringify(error));
                if (error.code == "ECONNABORTED") {
                    retry = true;
                    return;
                }
                httpResponse.error = error;
                httpResponse.headers = error.headers;
                httpResponse.status = error.status;
                logToFile(
                    `http GET to ${url} with options ${JSON.stringify(
                        options
                    )} result: ${JSON.stringify(httpResponse)}`
                );
            });
    } while (retry && retries++ < AXIOS_TIMEOUT_RETRIES);

    return httpResponse;
}

module.exports = { httpGet, HttpResponse };
