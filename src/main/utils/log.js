const { LOG_PATH } = process.env;
const { nowStr } = require("./date");
const fs = require("fs");

let logFile;

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
    if (!logFile) {
        initLogFile();
    }
    logFile.write(message + "\n");
}

function initLogFile() {
    logFile = fs.createWriteStream(LOG_PATH, { flags: "a" });
}

module.exports = { logE, log, logOk, logToFile };
