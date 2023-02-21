require("dotenv").config();
const axios = require("axios");
const { Client, IntentsBitField } = require("discord.js");
const { BOT_TOKEN, RIOT_TOKEN, UPDATE_CHANNELS } = process.env;

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

const BOT_UPDATE_INTERVAL = 1 * 60 * 1000;
let nextUpdate = BOT_UPDATE_INTERVAL;

let ladderLastState = [];

let ladder = [
    {
        name: "Ragequiiit",
        role: "SUPPORT",
        id: "dboTfFslWypjc5OmV7CJSvt_AdBDx0E1vBkxDef1wlkv6Vo",
        puuid: "VRqZmntlzXz12-YKQA44vnaYdns2SFpKl1-X-JSIgFLXo63dMC9WENhYY5E9pHWvKl-GbuZ7aHw73A",

        inGame: false,
        with: [],
    },
    {
        name: "Shaeee",
        role: "JUNGLE",
        id: "49MWYTk1ARBzQ1CAsXl3xzeJHSAWTYMbrWUwTQdNOMsUjKs",
        puuid: "eekK0NsvEjrEJPVOcY6AKo1fARBK0EJOB_Oz2S8LWNTYQ6NCR4Jl9C5hWlVL_3ZKaxSODEh2VUZNGQ",

        inGame: false,
        with: [],
    },
    {
        name: "PIRATE FRANK",
        role: "TOP",
        id: "hmX7qMpsIPv8t6iu2V9ao1EScbYiirlxW3Qo4LBTXG2_yUCk",
        puuid: "L1Nq_vlp55CYezkmAohP9jPkbf6SOhg7OE1PYWQt3jStbr9EPGvO6tf82rB58GRV_zJHak0tr4t1ug",

        inGame: false,
        with: [],
    },
    {
        name: "Just GanK 4Head",
        role: "JUNGLE",
        id: "WWxMaXwaPjOBdi_nmXzA8NaitNWdmZT_qgMNRFvRXjuz9A13",
        puuid: "9retEKLHxzZTzI1p51i2fB2sdNXfHMbLXvQdyBLY3QUlxAJ573xr9mcfexTXZr3ZysvNXgD4fKRtkQ",

        inGame: true,
        with: [],
    },
    {
        name: "yarbinmot",
        role: "TOP",
        id: "uf90ZO5hcHG5GEutUgrmmRKuKrKd7FXaiVlhEEX-X8iY_b3H",
        puuid: "6NOqgMugwg9Ay8_ZiyIuDLu6KFoW_1VzDQuMwpfGTatQc4MbLt-DR3GCWANB-7rCX8GCkdu3nESzKg",

        inGame: false,
        with: [],
    },
    {
        name: "Hakuyu",
        role: "JUNGLE",
        id: "I6WkOBgugB49QhpnJroak8VviSSlIu3bi-B-FxptpZDwGoI",
        puuid: "IjK-i9ODg7EMovjyzFt9W0W-lmFmeBgIrrHNjKZf2r_q7im1xLsyG2QdOcxSMuelhU5yiJqG9bfdog",

        inGame: false,
        with: [],
    },
    {
        name: "Shocksnock",
        role: "MID",
        isGM: true,
        id: "zq-yeYAHVfaWeYtidLiMEn3HuMixu-8cofb8B21t6lbvXko",
        puuid: "RIusVaN49Qse59Et_qs9mYUKqrYYIxhVJPS3kPBnLWSdA6o17a5KvwpfFC2IZheP3tteObtOrWPpuQ",

        inGame: false,
        with: [],
    },
    {
        name: "Rozeal",
        role: "BOT",
        id: "zeajM1MQwDMgEoGjEje6wzSfw3pSYPt8ohtoac-1o_TaU3M",
        puuid: "0pI-qTKX92Xzzyh2-lbXizAKMZFWcK7eVJ9bmGCFgXRiAj87eOqNzTmQj5ZOg22OLJDWfpyh88Y0Aw",

        inGame: false,
        with: [],
    },
    {
        name: "ramxix",
        role: "JUNGLE",
        id: "wRkmbrRAETkAgg1PUeSodfeH9Zu0z3V0JED8sHb1a3oQ9GU",
        puuid: "Ab5SNaLXePwhXo_m5zPPZk6UVJ3lqcVTdV5Cc4UAHaoAlU0EWQ6-0L3lIjOyb3jMcSBOU7Y23fvExA",

        promo: "LNN",
        inGame: true,
        with: [],
    },
    {
        name: "Artist Diff",
        role: "BOT",
        id: "MxLyBbJbXNGE23-I64vfvPaZCrAGrHFNm7fYbfBM9-ofoUah",
        puuid: "xOs11F8ZU9B4RwAUY--kLEVFWaKEHJhaSmyox5C-KQplI_B5MqiS3xSXpYYSp2ralVpOaAGwqEycyQ",

        inGame: false,
        with: [],
    },
    {
        name: "ghi frank",
        role: "TOP",
        id: "tOWFjULPFEGiiC16tn1q4TL1Gbgmmo2BXrGEW_rd7JGEzs0",
        puuid: "94ar81w4AlQ8H83IiTDIvbsszr0osHwwuf1y4gbMZkZTrIVU0LCk-CEjXHNYKMzv7N6Liarbw2kWig",

        inGame: false,
        with: [],
    },
    {
        name: "shli7a",
        role: "BOT",
        id: "PIZ3KGdN6gpsuwwySiEehGyJfiMS3cqS7heqW_l-cMbiUss",
        puuid: "R-xknicCaZ6w_Tl_cANACQI33IuHZ3F-QycTTHGSyLUUfZwbDDY088MZvc70GrSIMZBb7lVHFxb_gQ",

        inGame: false,
        with: [],
    },
    {
        name: "jeu dzab",
        role: "MID",
        isGM: true,
        id: "DNHgjdcrba3cOfSaj7jR4UHFda39zEI-9kcYqxPf9TLKtidO",
        puuid: "8jJXESWV9Hr0VPLtOPnU0DHcgRmiWjPmlN9JZvXWlKvG2HMijelIIaMm4eXDMA7WF3t_OLomwN8GvA",

        inGame: false,
        with: [],
    },
    {
        name: "Xartos",
        role: "BOT",
        id: "BmORQ2F1K95UutjTHzI5CpSMyyfO5hsxQDnI0JbQadPA_d8",
        puuid: "RzoeWcCCd62Y_OoMLLK8TgFIk9JPIJQeA2QfBsUxbld3CEXtCfwos3wr8xsRxr5uwOaSB25jWRtRIw",

        inGame: false,
        with: [],
    },
    {
        name: "Spookky",
        role: "SUPPORT",
        id: "AUq2oAfVizPr6sXiVTFzpyW3OQ5CLQ6Legki1Jn-MZgVatY",
        puuid: "RxKWcd5FGgVoM_lGA548mhXJ0nq9xK6WdAVaQFRuAeyKySKpxnqzL6nxegUEpT2b7KxBHobrfIkc0A",

        inGame: false,
        with: [],
    },
    {
        name: "NanShen",
        role: "TOP",
        id: "rVK0rQU-5w5JGd3_lP1q9Pl_yRGScQc3g8iThpvwCjApqVc",
        puuid: "p5WlRky3pQm99O0KhLE0hDOkR1_Vr3u4HPgMMlmGepVbv9FgdQ2Hmp_1oqXjCozRBSPr_XoV0qrTsA",

        inGame: false,
        with: [],
    },
    {
        name: "Maes277",
        role: "SUPPORT",
        id: "tjwCGRsZeLrXOxEdC2Jin-vPvWBJa6Q_ZDja_WiBrGJm0QsK",
        puuid: "5eXkNAnC3ujleNScqjmELv4EX_GTMPZn6XwfkUQTcLeXoYucUi8fQ38PVznKWwcKOvnv6TAZvoAkAg",

        inGame: false,
        with: [],
    },
    {
        name: "SP MoKzS",
        role: "SUPPORT",
        id: "o8pfSZaxqJDma-gRei_xDkgvwE6SfzDkGjWY21RSSZzGXHY",
        puuid: "Yv8jYApte-njmd6KXnhcM7YYP3XroGQnC5J9_6Td-LS0Tfvf4T6_SB9UkmQleR2qv1juUsqmoYVV1g",

        inGame: false,
        with: [],
    },
    {
        name: "walkwithme",
        role: "SUPPORT",
        id: "4I1aT-CA1iA4l2Q3vLxxPWEQOgxL9LGgXYapS09uXqbrrfeS",
        puuid: "ZxxX1-iMlwAP6Ni_qO28Rfua1gcK3WGa2GEwjqfLYw1HtiUIbkuZySXGDKBwvXsB0GsR200WJLWGbA",

        inGame: false,
        with: [],
    },
    {
        name: "Kimightem",
        role: "TOP",
        id: "WJW1FiFChB32lhbss0XVdDMYV9lQYLVWwlbgo0g3Wx8UuCybo9L1udKD7g",
        puuid: "6giCMkP5XTSMZo7oDDJDrP-M-zobFt9uKOde_O12t9QZFzFUkBC8Zhe9kvDr_l10deo2ktSU6XQPZw",

        inGame: false,
        with: [],
    },
];

let updateChannels = UPDATE_CHANNELS.split(",");

let running = false;

client.on("ready", (c) => {
    logOk(`${c.user.tag} is online.`);
});

client.on("ready", (c) => {
    init();
});

client.on("messageCreate", (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content == "!ladder") {
        showLadder([message.channel.name], "Player Rankings");
    }
});

async function init() {
    await updateAllSummonerData();
    loopUpdateAndShowLadder();
}

async function loopUpdateAndShowLadder() {
    await updateAndShowLadder();
    setTimeout(loopUpdateAndShowLadder, nextUpdate);
    nextUpdate = BOT_UPDATE_INTERVAL;
}

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
        await updateAllSummonerData();
        await updateAllLeagueData();
        await updateAllLiveGames();
    } catch (error) {
        logE(`An error has occurred in update(): ${error}`);
        if (JSON.parse(JSON.stringify(error)).status == 429) {
            sendMessage(updateChannels, "Rate limit exceeded.");
            nextUpdate = 2 * 60 * 1000;
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
                summoner.name = response.data.name;
                summoner.id = response.data.id;
            })
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        logE(
            `An error has occurred in updateSummonerData(${summoner}): ${error}`
        );
        if (JSON.parse(JSON.stringify(error)).status == 429) {
            throw error;
        }
    }
}

async function updateAllSummonerData() {
    for (let summoner of ladder) {
        if (!summoner.id) {
            await updateSummonerData(summoner);
        }
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
                    if (
                        response.data[0].miniSeries &&
                        response.data[0].miniSeries.progress
                    ) {
                        summoner.promo = response.data[0].miniSeries.progress;
                    } else {
                        summoner.promo = undefined;
                    }
                }
            })
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        logE(
            `An error has occurred in updateLeagueData(${summoner}): ${error}`
        );
        if (JSON.parse(JSON.stringify(error)).status == 429) {
            throw error;
        }
    }
}

async function updateAllLeagueData() {
    for (let summoner of ladder) {
        if (summoner.id) {
            await updateLeagueData(summoner);
        }
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
                if (
                    response.data &&
                    response.data.gameQueueConfigId &&
                    response.data.gameQueueConfigId == 420
                ) {
                    summoner.inGame = true;
                    summoner.with = response.data.participants
                        .map((participant) => participant.summonerName)
                        .filter((name) => name != summoner.name)
                        .filter((name) =>
                            ladder.map((s) => s.name).includes(name)
                        );
                } else {
                    summoner.inGame = false;
                    summoner.with = [];
                }
            })
            .catch((error) => {
                if (JSON.parse(JSON.stringify(error)).status == 404) {
                    summoner.inGame = false;
                    summoner.with = [];
                } else {
                    throw error;
                }
            });
    } catch (error) {
        logE(`An error has occurred in updateLiveGames(${summoner}): ${error}`);
        if (JSON.parse(JSON.stringify(error)).status == 429) {
            throw error;
        }
    }
}

async function updateAllLiveGames() {
    for (let summoner of ladder) {
        if (summoner.id) {
            await updateLiveGames(summoner);
        }
    }
}

const SEPARATOR =
    "---------------------------------------------------------------------";

function showLadder(channels, message) {
    let messagesToSend = [];

    var headerStr = SEPARATOR + "\n";
    headerStr += "\t\t\t\t\t\t\t\t\t\t\t\t" + message + "\n";
    headerStr += SEPARATOR + "";
    messagesToSend.push(headerStr);

    var ladderStr = "";

    ladder
        .filter((summoner) => summoner.tier != undefined)
        .sort((summoner1, summoner2) =>
            compareSummoners(summoner1, summoner2) ? -1 : 1
        )
        .forEach((summoner, index) => {
            if (index % 10 == 0 && index != 0) {
                messagesToSend.push(ladderStr);
                ladderStr = "";
            }
            ladderStr +=
                getPrefix(index) +
                summoner.name +
                " " +
                getEmoji(summoner.role.toLowerCase()) +
                " - " +
                summoner.tier;
            if (summoner.rank) {
                ladderStr += " " + summoner.rank;
            }
            ladderStr += getEmoji(
                summoner.isGM ? "grandmaster" : summoner.tier.toLowerCase()
            );
            if (summoner.leaguePoints != undefined) {
                ladderStr += " " + summoner.leaguePoints + "LP";
            }
            if (summoner.promo) {
                ladderStr += " " + getPromoEmojis(summoner.promo) + " ";
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
                ladderStr += " -  :red_circle: IN GAME";
                if (summoner.with.length > 0) {
                    ladderStr += " with";
                    for (const name of summoner.with) {
                        ladderStr += " " + name;
                    }
                }
            }
            ladderStr += "\n";
        });

    messagesToSend.push(ladderStr);

    var footerStr = SEPARATOR;
    messagesToSend.push(footerStr);

    messagesToSend.forEach((message) => sendMessage(channels, message));
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
    return client.emojis.cache.find((emoji) => emoji.name === name).toString();
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

    return `[${padDateElement(currentDate.getUTCDate())}/${padDateElement(
        currentDate.getUTCMonth()
    )}/${currentDate.getUTCFullYear()} ${padDateElement(
        currentDate.getUTCHours()
    )}:${padDateElement(currentDate.getUTCMinutes())}:${padDateElement(
        currentDate.getUTCSeconds()
    )}]`;
}

function padDateElement(n) {
    return String(n).padStart(2, "0");
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
