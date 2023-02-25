function getChannels(channelNames) {
    return global.client.channels.cache.find((channel) =>
        channelNames.includes(channel.name)
    );
}

module.exports = { getChannels };
