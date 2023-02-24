const { logOk, log, logE } = require("../utils/log");
const { sendUpdate } = require("../utils/discord/message");
const { getMainLadder } = require("./ladderPersistence");
const {
    getSummonerData,
    getLeagueData,
    getSpectatorData,
} = require("../http/riot");
const { RATE_LIMIT_EXCEEDED } = require("../data/strings");

let running = false;

async function update() {
    if (running) return false;

    running = true;

    let updateOk = false;

    let mainLadder = getMainLadder();

    try {
        for (const summoner of mainLadder) {
            await updateSummonerData(summoner);
            await updateLeagueData(summoner);
            await updateLiveGames(summoner);
        }

        logOk("updated");

        updateOk = true;
    } catch (responseWithError) {
        logE(
            `An error has occurred in update(): ${JSON.stringify(
                responseWithError.error
            )}`
        );
        if (responseWithError.rateLimitExceeded === true) {
            sendUpdate(RATE_LIMIT_EXCEEDED);
            global.nextUpdate = 2 * 60 * 1000;
        }
    }

    running = false;

    return updateOk;
}

async function updateSummonerData(summoner) {
    log(`updateSummonerData(${summoner.name})`);
    const response = await getSummonerData(summoner.name);
    if (response.success === true) {
        summoner.name = response.data.name;
        summoner.id = response.data.id;
        summoner.puuid = response.data.puuid;
        logOk(`Updated summoner data for ${summoner.name}`);
    } else {
        throw response;
    }
}

async function updateLeagueData(summoner) {
    log(`updateLeagueData(${summoner.name})`);
    const response = await getLeagueData(summoner.id);
    if (response.success === true) {
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
                if (rankedData.miniSeries && rankedData.miniSeries.progress) {
                    summoner.promo = rankedData.miniSeries.progress;
                } else {
                    summoner.promo = undefined;
                }
            }
        }
    } else {
        throw response;
    }
}

async function updateLiveGames(summoner) {
    log(`updateLiveGames(${summoner.name})`);
    const response = await getSpectatorData(summoner.id);
    if (response.success === true) {
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
                    getMainLadder()
                        .map((s) => s.name)
                        .includes(name)
                );
        } else {
            summoner.inGame = false;
            summoner.with = [];
        }
    } else if (response.notFound) {
        summoner.inGame = false;
        summoner.with = [];
    } else {
        throw response;
    }
}

module.exports = { update };
