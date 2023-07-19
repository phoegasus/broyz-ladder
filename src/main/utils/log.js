const { LOG_PATH } = process.env;
const { nowStr, nowDate, padDateElement } = require("./date");
const fs = require("fs");
const util = require("util");
const { DATE_FORMAT_LOG } = require("../data/strings");

function logE(message) {
    logToFileAndConsole(`[${nowStr()}] - 🛑 ${message}`);
}

function log(message) {
    logToFileAndConsole(`[${nowStr()}] - ${message}`);
}

function logOk(message) {
    logToFileAndConsole(`[${nowStr()}] - ✅ ${message}`);
}

function logToFileAndConsole(message) {
    console.log(message);
    logToFile(message);
}

function logToFile(message) {
    let logWriteStream = getLogWriteStream();
    try {
        logWriteStream.write(message + "\n");
    } finally {
        logWriteStream.close();
    }
}

function getLogWriteStream() {
    let currentDate = nowDate();
    return fs.createWriteStream(
        LOG_PATH.replace(
            "$date$",
            util.format(
                `${DATE_FORMAT_LOG}`,
                padDateElement(currentDate.getDate()),
                padDateElement(currentDate.getMonth() + 1),
                currentDate.getFullYear()
            )
        ),
        { flags: "a" }
    );
}

module.exports = { logE, log, logOk, logToFile };
