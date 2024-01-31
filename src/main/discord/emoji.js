const { client } = require("./client");

function getEmoji(name) {
  if (!name) {
    return "";
  }
  let emoji = client.emojis.cache.find((emoji) => emoji.name === name);
  if (emoji) {
    return emoji.toString();
  }
  return "";
}

module.exports = { getEmoji };
