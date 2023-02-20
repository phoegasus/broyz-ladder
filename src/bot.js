require("dotenv").config();
const { token } = process.env;
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    console.log(`✅ ${c.user.tag} is online.`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) {
        return;
    }

    console.log(`💬 ${message.author.username}: ${message.content}`);
    message.reply(`Skot t9owd a ${message.author.username}`);
});

client.login(token);
