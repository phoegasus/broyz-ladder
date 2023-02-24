const { logE } = require("./log");

function initUncaughtExceptionHandler() {
    process.on("uncaughtException", (err) =>
        logE(`UNCAUGHT EXCEPTION ${err && err.stack ? err.stack : err}`)
    );
}

module.exports = { initUncaughtExceptionHandler };
