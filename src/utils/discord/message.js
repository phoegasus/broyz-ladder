const { getChannels } = require("./channel.js");

function sendMessage(channelNames, message) {
    getChannels(channelNames).send(message);
}

module.exports = { sendMessage };
