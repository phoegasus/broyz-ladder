require("dotenv").config();
const { BOT_TOKEN, HANDLE_UNCAUGHT_EXCEPTIONS } = process.env;
const { Client, IntentsBitField } = require("discord.js");
const { logOk } = require("./utils/log");
const { loadMainLadder } = require("./ladder/ladderPersistence");
const { initLadderUpdateLoop } = require("./ladder/ladderUpdateLoop");
const { registerCommands } = require("./commands/registerCommands");
const {
    initUncaughtExceptionHandler,
} = require("./utils/uncaughtExceptionHandler");
const { initFirebaseApp } = require("./firebase/app");

if (HANDLE_UNCAUGHT_EXCEPTIONS === "Y") initUncaughtExceptionHandler();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    logOk(`${c.user.tag} is online.`);
});

client.on("ready", () => {
    init();
});

async function init() {
    await initFirebaseApp();
    await loadMainLadder();
    registerCommands();
    initLadderUpdateLoop();
}

global.client = client;

client.login(BOT_TOKEN);
