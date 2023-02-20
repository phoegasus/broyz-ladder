require("dotenv").config();
const axios = require("axios");
const { Client, IntentsBitField } = require("discord.js");
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
const RIOT_SPECTATOR_ENDPOINT = "/lol/spectator/v4/active-games/by-summoner/";

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
        role: "SUPPORT",
        inGame: false,
    },
    {
        name: "Shaeee",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "JUNGLE",
        inGame: false,
    },
    {
        name: "PIRATE FRANK",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "TOP",
        inGame: false,
    },
    {
        name: "Just Gank 4Head",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "JUNGLE",
        inGame: false,
    },
    {
        name: "yarbinmot",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "TOP",
        inGame: false,
    },
    {
        name: "Hakuyu",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "JUNGLE",
        inGame: false,
    },
    {
        name: "Shocksnock",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "MID",
        inGame: false,
    },
    {
        name: "Rozeal",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "BOT",
        inGame: false,
    },
    {
        name: "ramxix",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "JUNGLE",
        inGame: false,
    },
    {
        name: "Artist Diff",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "BOT",
        inGame: false,
    },
    {
        name: "ghi frank",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "TOP",
        inGame: false,
    },
    {
        name: "shli7a",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "BOT",
        inGame: false,
    },
    {
        name: "jeu dzab",
        id: undefined,
        rank: undefined,
        tier: undefined,
        leaguePoints: undefined,
        role: "MID",
        inGame: false,
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
        showLadder([message.channel.name], "Player Rankings");
    }
});

async function updateAndShowLadder() {
    await update();
    let ladderLastStateString = JSON.stringify(ladderLastState);
    let ladderString = JSON.stringify(ladder);
    if (ladderLastStateString !== ladderString) {
        showLadder(updateChannels, "Ladder Update");

        logOk("shown ladder");
    }
}

async function update() {
    if (running) return;

    running = true;

    try {
        ladderLastState = JSON.parse(JSON.stringify(ladder));
        for (let summoner of ladder) {
            if (!summoner.id) {
                await updateSummonerData(summoner);
            }
            await updateLeagueData(summoner);
            await updateLiveGames(summoner);
        }
    } catch (error) {
        logE(`An error has occurred in update(): ${error}`);
        if (JSON.parse(JSON.stringify(error)).status == 429) {
            sendMessage(updateChannels, "Rate limit exceeded.");
        }
    }

    running = false;

    logOk("updated");
}

async function updateSummonerData(summoner) {
    log(`updateSummonerData(${summoner.name})`);
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
    log(`updateLeagueData(${summoner.name})`);
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
                    if (response.data[0].rank)
                        summoner.rank = response.data[0].rank;
                    if (response.data[0].tier)
                        summoner.tier = response.data[0].tier;
                    if (response.data[0].leaguePoints != undefined)
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

async function updateLiveGames(summoner) {
    log(`updateLiveGames(${summoner.name})`);
    try {
        await axios
            .get(
                RIOT_SERVER_URL + RIOT_SPECTATOR_ENDPOINT + summoner.id,
                RIOT_API_OPTIONS
            )
            .then((response) => {
                if (response.data && response.data.gameId) {
                    summoner.inGame = true;
                } else {
                    summoner.inGame = false;
                }
            })
            .catch((error) => {
                if (JSON.parse(JSON.stringify(error)).status == 404) {
                    summoner.inGame = false;
                } else {
                    throw error;
                }
            });
    } catch (error) {
        logE(`An error has occurred in updateLiveGames(${summoner}): ${error}`);
        throw error;
    }
}

const SEPARATOR = "-------------------------------------------------";

function showLadder(channels, message) {
    var ladderStr = SEPARATOR + "\n";
    ladderStr += "\t\t\t\t\t\t\t\t" + message + "\n";
    ladderStr += SEPARATOR + "\n";

    ladder
        .filter((summoner) => summoner.tier != undefined)
        .sort((summoner1, summoner2) =>
            compareSummoners(summoner1, summoner2) ? -1 : 1
        )
        .forEach((summoner, index) => {
            ladderStr +=
                getPrefix(index) +
                summoner.name +
                " " +
                getEmoji(summoner.role) +
                " " +
                summoner.tier;
            if (summoner.rank) {
                ladderStr += " " + summoner.rank;
            }
            ladderStr += getEmoji(summoner.tier);
            if (summoner.leaguePoints) {
                ladderStr += " " + summoner.leaguePoints + "LP";
            }
            let ladderLastStateOfSummoner = ladderLastState.filter(
                (s) => s.id === summoner.id
            )[0];
            let lpChange = getLPChange(
                ladderLastStateOfSummoner ? ladderLastStateOfSummoner : {},
                summoner
            );
            if (lpChange && lpChange !== 0) {
                ladderStr +=
                    " " +
                    (lpChange < 0 ? ":arrow_down: " : ":arrow_up: +") +
                    lpChange;
            }
            if (summoner.inGame) {
                ladderStr += " - :red_circle: IN GAME";
            }
            ladderStr += "\n";
        });

    ladderStr += SEPARATOR;

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

function getEmoji(name) {
    if (!name) {
        return "";
    }
    return client.emojis.cache
        .find((emoji) => emoji.name === name.toLowerCase())
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
    return client.channels.cache.find((channel) =>
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
