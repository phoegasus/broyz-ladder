require("dotenv").config();
const { HANDLE_UNCAUGHT_EXCEPTIONS } = process.env;
const { loadMainLadder } = require("./ladder/ladderPersistence");
const { initLadderUpdateLoop } = require("./ladder/ladderUpdateLoop");
const { registerCommands } = require("./commands/registerCommands");
const {
    initUncaughtExceptionHandler,
} = require("./utils/uncaughtExceptionHandler");
const { initFirebaseApp } = require("./firebase/app");
const { startClient } = require("./discord/client");

if (HANDLE_UNCAUGHT_EXCEPTIONS === "Y") initUncaughtExceptionHandler();

async function init() {
    await initFirebaseApp();
    await loadMainLadder();
    registerCommands();
    initLadderUpdateLoop();
}

startClient(init);
