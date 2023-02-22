const {
    RIOT_SERVER_URL,
    RIOT_SUMMONER_ENDPOINT,
    RIOT_LEAGUE_ENDPOINT,
    RIOT_SPECTATOR_ENDPOINT,
} = require("../data/riotapi");
const axios = require("axios");
const { logOk, log, logE } = require("../utils/log.js");
const { sendMessage } = require("../utils/discord/message.js");
const { RIOT_TOKEN, UPDATE_CHANNELS } = process.env;
const { mainLadder } = require("./ladderPersistence.js");

const updateChannels = UPDATE_CHANNELS.split(",");

const OPTIONS = {
    headers: {
        "X-Riot-Token": RIOT_TOKEN,
    },
};

let running = false;

async function update() {
    if (running) return false;

    running = true;

    let updateOk = false;

    try {
        await updateAllSummonerData();
        for (const summoner of mainLadder) {
            await updateLeagueData(summoner);
            await updateLiveGames(summoner);
        }

        logOk("updated");

        updateOk = true;
    } catch (error) {
        logE(`An error has occurred in update(): ${error}`);
        if (JSON.parse(JSON.stringify(error)).status == 429) {
            sendMessage(updateChannels, "Rate limit exceeded.");
            global.nextUpdate = 2 * 60 * 1000;
        }
    }

    running = false;

    return updateOk;
}

async function updateSummonerData(summoner) {
    log(`updateSummonerData(${summoner.name})`);
    try {
        await axios
            .get(
                RIOT_SERVER_URL + RIOT_SUMMONER_ENDPOINT + summoner.name,
                OPTIONS
            )
            .then((response) => {
                summoner.name = response.data.name;
                summoner.id = response.data.id;
                summoner.puuid = response.data.puuid;
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
    for (let summoner of mainLadder) {
        if (!summoner.id) {
            await updateSummonerData(summoner);
        }
    }
}

async function updateLeagueData(summoner) {
    log(`updateLeagueData(${summoner.name})`);
    try {
        await axios
            .get(RIOT_SERVER_URL + RIOT_LEAGUE_ENDPOINT + summoner.id, OPTIONS)
            .then((response) => {
                if (response.data.length == 0) {
                    summoner.tier = "UNRANKED";
                } else {
                    const filteredData = response.data.filter(
                        (data) => data.queueType === "RANKED_SOLO_5x5"
                    );
                    if (filteredData.length > 0) {
                        const rankedData = filteredData[0];
                        if (rankedData.rank) summoner.rank = rankedData.rank;
                        if (rankedData.tier) summoner.tier = rankedData.tier;
                        if (rankedData.leaguePoints != undefined)
                            summoner.leaguePoints = rankedData.leaguePoints;
                        if (
                            rankedData.miniSeries &&
                            rankedData.miniSeries.progress
                        ) {
                            summoner.promo = rankedData.miniSeries.progress;
                        } else {
                            summoner.promo = undefined;
                        }
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

async function updateLiveGames(summoner) {
    log(`updateLiveGames(${summoner.name})`);
    try {
        await axios
            .get(
                RIOT_SERVER_URL + RIOT_SPECTATOR_ENDPOINT + summoner.id,
                OPTIONS
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
                            mainLadder.map((s) => s.name).includes(name)
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

module.exports = { update, updateAllSummonerData };
