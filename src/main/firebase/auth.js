const { getAuth, signInAnonymously } = require("firebase/auth");
const { logE, logOk } = require("../utils/log");

async function authenticate() {
  await signInAnonymously(getAuth())
    .then(async function () {
      logOk("Authenticated with Firebase.");
    })
    .catch((error) => {
      logE(`Error authenticating with Firebase: ${error}`);
      throw error;
    });
}

module.exports = { authenticate };
