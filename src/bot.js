require("dotenv").config();
const axios = require("axios");
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const { BOT_TOKEN, RIOT_TOKEN } = process.env;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.MessageContent,
    ],
});

const RIOT_SERVER_URL = "https://euw1.api.riotgames.com";
const RIOT_SUMMONER_ENDPOINT = "/lol/summoner/v4/summoners/by-name/";
const RIOT_LEAGUE_ENDPOINT = "/lol/league/v4/entries/by-summoner/";

const RIOT_API_OPTIONS = {
    headers: {
        "X-Riot-Token": RIOT_TOKEN,
    },
};

const BOT_UPDATE_INTERVAL = 60 * 1000;
const DB_UPDATE_INTERVAL = 10 * BOT_UPDATE_INTERVAL;

let ladderLastState = [];

let ladder = [
    {
        name: "Ragequiiit",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "Shaeee",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "PIRATE FRANK",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "yarbinmot",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "Hakuyu",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "Shocksnock",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "Rozeal",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "ramxix",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
    {
        name: "Artist Diff",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
    },
];

let updateChannels = ["général"];

let running = false;

client.on("ready", (c) => {
    logOk(`${c.user.tag} is online.`);
});

client.on("ready", (c) => {
    updateAndShowLadder();
    setInterval(updateAndShowLadder, BOT_UPDATE_INTERVAL);

    logOk(`Set update interval to ${BOT_UPDATE_INTERVAL}`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content == "!ladder") {
        showLadder([message.channel]);
    }
});

async function updateAndShowLadder() {
    await update();
    let ladderLastStateString = JSON.stringify(ladderLastState);
    let ladderString = JSON.stringify(ladder);
    if (ladderLastStateString !== ladderString) showLadder();
}

async function update() {
    if (running) return;

    running = true;

    try {
        ladderLastState = JSON.parse(JSON.stringify(ladder));
        for (let summoner of ladder) {
            await updateSummonerData(summoner);
            await updateLeagueData(summoner);
        }
    } catch (error) {
        logE(`An error has occurred in update(): ${error}`);
    }

    running = false;
}

async function updateSummonerData(summoner) {
    try {
        await axios
            .get(
                RIOT_SERVER_URL + RIOT_SUMMONER_ENDPOINT + summoner.name,
                RIOT_API_OPTIONS
            )
            .then((response) => {
                summoner.id = response.data.id;
            })
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        logE(
            `An error has occurred in updateSummonerData(${summoner}): ${error}`
        );
    }
}

async function updateLeagueData(summoner) {
    try {
        await axios
            .get(
                RIOT_SERVER_URL + RIOT_LEAGUE_ENDPOINT + summoner.id,
                RIOT_API_OPTIONS
            )
            .then((response) => {
                if (response.data.length == 0) {
                    summoner.tier = "UNRANKED";
                } else {
                    summoner.rank = response.data[0].rank;
                    summoner.tier = response.data[0].tier;
                    summoner.leaguePoints = response.data[0].leaguePoints;
                }
            })
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        logE(
            `An error has occurred in updateLeagueData(${summoner}): ${error}`
        );
    }
}

function showLadder(channels = updateChannels) {
    var ladderStr = "";

    ladder
        .sort((summoner1, summoner2) =>
            compareSummoners(summoner1, summoner2) ? -1 : 1
        )
        .forEach((summoner, index) => {
            ladderStr +=
                getPrefix(index) +
                summoner.name +
                " " +
                getEmoji(summoner.tier) +
                " " +
                summoner.tier;
            if (isRanked(summoner)) {
                ladderStr += " " + summoner.rank;
                ladderStr += " " + summoner.leaguePoints + "LP";
            }
            let lpChange = getLPChange(ladderLastState[index], summoner);
            if (lpChange && lpChange !== 0) {
                ladderStr +=
                    " " +
                    (lpChange < 0 ? ":arrow_down: " : ":arrow_up: +") +
                    lpChange;
            }
            ladderStr += "\n";
        });

    sendMessage(channels, ladderStr);
}

function compareSummoners(summoner1, summoner2) {
    let comparison =
        TIERS.indexOf(summoner1.tier) < TIERS.indexOf(summoner2.tier) ||
        (TIERS.indexOf(summoner1.tier) == TIERS.indexOf(summoner2.tier) &&
            RANKS.indexOf(summoner1.rank) < RANKS.indexOf(summoner2.rank)) ||
        (TIERS.indexOf(summoner1.tier) == TIERS.indexOf(summoner2.tier) &&
            RANKS.indexOf(summoner1.rank) == RANKS.indexOf(summoner2.rank) &&
            summoner1.leaguePoints > summoner2.leaguePoints);

    return comparison;
}

function getLPChange(summonerOld, summonerNew) {
    if (!isRanked(summonerOld) || !isRanked(summonerNew)) {
        return;
    }

    var change =
        (TIERS.indexOf(summonerNew.tier) - TIERS.indexOf(summonerOld.tier)) *
        -1 *
        getLPChangeFromTier(summonerNew.tier, summonerOld.tier);
    change +=
        (RANKS.indexOf(summonerNew.rank) - RANKS.indexOf(summonerOld.rank)) *
        -100;
    change += summonerNew.leaguePoints - summonerOld.leaguePoints;

    return change;
}

function isRanked(summoner) {
    return summoner.rank && summoner.tier;
}

function getLPChangeFromTier(tierNew, tierOld) {
    if (!DIVIDED_TIERS.includes(tierNew) && !DIVIDED_TIERS.includes(tierOld))
        return 0;
    if (
        (DIVIDED_TIERS.includes(tierNew) && !DIVIDED_TIERS.includes(tierOld)) ||
        (DIVIDED_TIERS.includes(tierOld) && !DIVIDED_TIERS.includes(tierNew))
    )
        return 100;
    return 400;
}

function getEmoji(tier) {
    return client.emojis.cache
        .find((emoji) => emoji.name === tier.toLowerCase())
        .toString();
}

const TIERS = [
    "CHALLENGER",
    "GRANDMASTER",
    "MASTER",
    "DIAMOND",
    "PLATINUM",
    "GOLD",
    "SILVER",
    "BRONZE",
    "IRON",
    "UNRANKED",
];

const DIVIDED_TIERS = [
    "DIAMOND",
    "PLATINUM",
    "GOLD",
    "SILVER",
    "BRONZE",
    "IRON",
];

const RANKS = ["I", "II", "III", "IV"];

function getPrefix(index) {
    switch (index) {
        case 0:
            return ":first_place: ";
        case 1:
            return ":second_place: ";
        case 2:
            return ":third_place: ";
        default:
            return "" + (index + 1) + ". ";
    }
}

function sendMessage(channelNames, message) {
    getChannels(channelNames).send(message);
}

function getChannels(channelNames) {
    client.channels.cache.find((channel) =>
        channelNames.includes(channel.name)
    );
}

function now() {
    let currentDate = new Date();

    return `[${currentDate.getUTCDate()}/${currentDate.getUTCMonth()}/${currentDate.getUTCFullYear()} ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}:${currentDate.getUTCSeconds()}]`;
}

function logE(message) {
    console.log(`${now()} 🛑 ${message}`);
}

function log(message) {
    console.log(`${now()} ${message}`);
}

function logOk(message) {
    console.log(`${now()} ✅ ${message}`);
}

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
