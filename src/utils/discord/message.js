const { getChannels } = require("./channel");

function sendMessage(channelNames, message) {
    if (message) getChannels(channelNames).send(message);
}

module.exports = { sendMessage };
