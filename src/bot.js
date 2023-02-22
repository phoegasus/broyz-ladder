require("dotenv").config();
const { BOT_TOKEN } = process.env;
const { Client, IntentsBitField } = require("discord.js");
const { logOk } = require("./utils/log.js");
const { initLadderUpdateLoop } = require("./ladder/ladderUpdateLoop.js");
const { registerCommands } = require("./commands/registerCommands");

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

function init() {
    initLadderUpdateLoop();
}

global.client = client;

registerCommands();

client.login(BOT_TOKEN);

//testing getLPChange
//log(
//    getLPChange(
//        {
//            rank: undefined,
//            tier: undefined,
//            leaguePoints: undefined,
//        },
//        {
//            rank: undefined,
//            tier: undefined,
//            leaguePoints: undefined,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "I",
//            tier: "CHALLENGER",
//            leaguePoints: 870,
//        },
//        {
//            rank: "I",
//            tier: "CHALLENGER",
//            leaguePoints: 490,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "I",
//            tier: "CHALLENGER",
//            leaguePoints: 870,
//        },
//        {
//            rank: "I",
//            tier: "CHALLENGER",
//            leaguePoints: 1000,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "I",
//            tier: "DIAMOND",
//            leaguePoints: 70,
//        },
//        {
//            rank: "I",
//            tier: "MASTER",
//            leaguePoints: 239,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "I",
//            tier: "DIAMOND",
//            leaguePoints: 70,
//        },
//        {
//            rank: "II",
//            tier: "DIAMOND",
//            leaguePoints: 20,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "III",
//            tier: "DIAMOND",
//            leaguePoints: 70,
//        },
//        {
//            rank: "I",
//            tier: "DIAMOND",
//            leaguePoints: 20,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "III",
//            tier: "DIAMOND",
//            leaguePoints: 70,
//        },
//        {
//            rank: "I",
//            tier: "PLATINUM",
//            leaguePoints: 20,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "I",
//            tier: "PLATINUM",
//            leaguePoints: 10,
//        },
//        {
//            rank: "III",
//            tier: "DIAMOND",
//            leaguePoints: 70,
//        }
//    )
//);
//
//log(
//    getLPChange(
//        {
//            rank: "I",
//            tier: "MASTER",
//            leaguePoints: 100,
//        },
//        {
//            rank: "I",
//            tier: "GRANDMASTER",
//            leaguePoints: 560,
//        }
//    )
//);
//
