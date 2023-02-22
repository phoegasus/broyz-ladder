require("dotenv").config();
const { BOT_TOKEN, DISCORD_SERVERS } = process.env;
const { Client, IntentsBitField } = require("discord.js");
const { logOk } = require("./utils/log.js");
const { showLadder } = require("./ladder/ladderPrinting.js");
const { initLadderUpdateLoop } = require("./ladder/ladderUpdateLoop.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.MessageContent,
    ],
});

let allowedServers = DISCORD_SERVERS.split(",");

client.on("ready", (c) => {
    logOk(`${c.user.tag} is online.`);
});

client.on("ready", () => {
    init();
});

const LADDER_COMMAND_SYNTAX = /^!ladder( ((.+,)+|.+))*$/;

client.on("messageCreate", (message) => {
    if (allowedServers.includes(message.guild.name)) {
        if (message.author.bot) {
            return;
        }

        if (LADDER_COMMAND_SYNTAX.test(message.content)) {
            let command = message.content.split(" ", 2);
            if (command.length == 1) {
                showLadder(
                    mainLadder,
                    [message.channel.name],
                    "Player Rankings"
                );
            } else {
                let names = command[1].toLowerCase().split(",");
                showLadder(
                    mainLadder.filter((summoner) =>
                        names.includes(summoner.name.toLowerCase())
                    ),
                    [message.channel.name],
                    "Player Rankings"
                );
            }
        }
    }
});

async function init() {
    initLadderUpdateLoop();
}

global.client = client;

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
