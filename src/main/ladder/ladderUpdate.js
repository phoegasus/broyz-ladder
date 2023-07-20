const { logOk, log, logE } = require("../utils/log");
const { getMainLadder } = require("./ladderPersistence");
const {
    getSummonerData,
    getLeagueData,
    getSpectatorData,
} = require("../http/riot");
const { zero } = require("../utils/date");
const { RATE_LIMIT_EXCEEDED } = require("../data/strings");
const { BOT_UPDATE_AFTER_RLE } = process.env;

let running = false;

async function update(now) {
    if (running) {
        log(`update() already running`);
        return;
    }

    running = true;

    let mainLadder = getMainLadder()
        .slice()
        .sort((summoner1, summoner2) =>
            compareSummonersLastUpdated(summoner1, summoner2)
        );

    for (const summoner of mainLadder) {
        try {
            if (!summoner.id) {
                await updateSummonerData(summoner);
            }
            await updateLeagueData(summoner);
            await updateLiveGames(summoner);
            summoner.lastUpdated = now;
        } catch (responseWithError) {
            if (responseWithError.rateLimitExceeded === true) {
                global.nextUpdate = BOT_UPDATE_AFTER_RLE;
                logE(RATE_LIMIT_EXCEEDED);
                break;
            }
            logE(
                `An error has occurred in update(): ${JSON.stringify(
                    responseWithError.error
                )}`
            );
        }
    }

    logOk("updated");

    running = false;
}

function compareSummonersLastUpdated(summoner1, summoner2) {
    [summoner1, summoner2].forEach((summoner) => {
        if (summoner.lastUpdated == undefined) {
            summoner.lastUpdated = zero();
        }
    });
    return summoner1.lastUpdated - summoner2.lastUpdated;
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
            delete summoner.rank;
            delete summoner.leaguePoints;
            delete summoner.promo;
            delete summoner.wins;
            delete summoner.losses;
        } else {
            const filteredData = response.data.filter(
                (data) => data.queueType === "RANKED_SOLO_5x5"
            );
            if (filteredData.length > 0) {
                const rankedData = filteredData[0];
                if (rankedData.summonerName)
                    summoner.name = rankedData.summonerName;
                if (rankedData.rank) summoner.rank = rankedData.rank;
                if (rankedData.tier) summoner.tier = rankedData.tier;
                if (rankedData.leaguePoints != undefined)
                    summoner.leaguePoints = rankedData.leaguePoints;
                if (rankedData.miniSeries && rankedData.miniSeries.progress) {
                    summoner.promo = rankedData.miniSeries.progress;
                } else {
                    delete summoner.promo;
                }
                if (rankedData.wins) summoner.wins = rankedData.wins;
                if (rankedData.losses) summoner.losses = rankedData.losses;
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
            delete summoner.with;
        }
    } else if (response.notFound) {
        summoner.inGame = false;
        delete summoner.with;
    } else {
        throw response;
    }
}

module.exports = { update };
