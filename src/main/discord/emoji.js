const { client } = require("./client");

function getEmoji(name) {
    if (!name) {
        return "";
    }
    return client.emojis.cache.find((emoji) => emoji.name === name).toString();
}

module.exports = { getEmoji };
