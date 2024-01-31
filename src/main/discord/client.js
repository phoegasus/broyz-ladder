const { BOT_TOKEN } = process.env;
const { Client, IntentsBitField } = require("discord.js");
const { logOk } = require("../utils/log");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.MessageContent,
  ],
});

function startClient(onReady) {
  client.on("ready", (c) => {
    logOk(`${c.user.tag} is online.`);
    onReady();
  });
  client.login(BOT_TOKEN);
}

module.exports = { startClient, client };
