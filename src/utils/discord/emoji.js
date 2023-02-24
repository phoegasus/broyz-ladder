function getEmoji(name) {
    if (!name) {
        return "";
    }
    return global.client.emojis.cache
        .find((emoji) => emoji.name === name)
        .toString();
}

module.exports = { getEmoji };
