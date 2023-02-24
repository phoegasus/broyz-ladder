require("dotenv").config();
const { LOG_PATH } = process.env;
const { nowStr } = require("./date");
const fs = require("fs");

const logFile = fs.createWriteStream(LOG_PATH, { flags: "a" });

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
    logFile.write(message + "\n");
}

module.exports = { logE, log, logOk };
