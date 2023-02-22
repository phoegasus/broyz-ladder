function getEmoji(name) {
    if (!name) {
        return "";
    }
    return global.client.emojis.cache
        .find((emoji) => emoji.name === name)
        .toString();
}

function getPromoEmojis(progress) {
    if (!progress) {
        return "";
    }

    return progress
        .split("")
        .map((gameResult) => getGameResultEmoji(gameResult))
        .join("");
}

function getGameResultEmoji(gameResult) {
    if (gameResult != "W" && gameResult != "L" && gameResult != "N") {
        return "";
    }
    return getEmoji("game" + gameResult);
}

module.exports = { getEmoji, getPromoEmojis };
