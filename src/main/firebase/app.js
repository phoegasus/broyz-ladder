const { initializeApp } = require("firebase/app");
const { logE } = require("../utils/log");
const { authenticate } = require("./auth");
const { FIREBASE_CONFIG } = require("./config");

async function initFirebaseApp() {
    try {
        initializeApp(FIREBASE_CONFIG);
        await authenticate();
    } catch (error) {
        logE(`Error initializing Firebase SDK: ${error}`);
        throw error;
    }
}

module.exports = { initFirebaseApp };
