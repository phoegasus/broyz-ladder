const { DATABASE_ROOT_PATH } = process.env;
const { getDatabase, set, get, child, ref } = require("firebase/database");
const { logE } = require("../utils/log");

async function read(path) {
  let data;

  await get(child(ref(getDatabase()), DATABASE_ROOT_PATH + path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
      } else {
        logE(`read(${path}) No data available`);
      }
    })
    .catch((error) => {
      logE(`read(${path}) error: ${error}`);
    });

  return data;
}

async function write(path, data) {
  await set(ref(getDatabase(), DATABASE_ROOT_PATH + path), data);
}

module.exports = { read, write };
