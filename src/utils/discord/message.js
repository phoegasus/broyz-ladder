const { getChannels } = require("./channel.js");

function sendMessage(channelNames, message) {
    if (message) getChannels(channelNames).send(message);
}

module.exports = { sendMessage };
