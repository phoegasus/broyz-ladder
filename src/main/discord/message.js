require("dotenv").config();
const { UPDATE_CHANNELS } = process.env;
const { getChannels } = require("./channel");

function sendMessage(channelNames, message) {
    if (message) getChannels(channelNames).send(message);
}

function sendUpdate(message) {
    if (message) getChannels(UPDATE_CHANNELS.split(",")).send(message);
}

module.exports = { sendMessage, sendUpdate };
