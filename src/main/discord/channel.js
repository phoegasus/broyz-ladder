const { client } = require("./client");

function getChannels(channelNames) {
    return client.channels.cache.find((channel) =>
        channelNames.includes(channel.name)
    );
}

module.exports = { getChannels };
