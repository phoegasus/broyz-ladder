const { now } = require("./date");

function logE(message) {
    console.log(`${now()} 🛑 ${message}`);
}

function log(message) {
    console.log(`${now()} ${message}`);
}

function logOk(message) {
    console.log(`${now()} ✅ ${message}`);
}

module.exports = { logE, log, logOk };
