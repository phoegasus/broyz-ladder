require("dotenv").config();
const { UPDATE_CHANNELS } = process.env;
const { getChannels } = require("./channel");

async function sendMessage(channelNames, message) {
    if (message) await getChannels(channelNames).send(message);
}

async function sendUpdate(message) {
    if (message) await getChannels(UPDATE_CHANNELS.split(",")).send(message);
}

module.exports = { sendMessage, sendUpdate };
