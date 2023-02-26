const { httpGet } = require("./http");
const {
    RIOT_SERVER_URL,
    RIOT_SUMMONER_ENDPOINT,
    RIOT_LEAGUE_ENDPOINT,
    RIOT_SPECTATOR_ENDPOINT,
} = require("../data/riotapi");
const { RIOT_TOKEN } = process.env;

const OPTIONS = {
    headers: {
        "X-Riot-Token": RIOT_TOKEN,
    },
};

class RiotResponse {
    constructor(success, rateLimitExceeded, notFound, data) {
        this.success = success;
        this.rateLimitExceeded = rateLimitExceeded;
        this.notFound = notFound;
        this.data = data;
    }
}

async function getSummonerData(summonerName) {
    return await riotGet(RIOT_SUMMONER_ENDPOINT + summonerName);
}

async function getLeagueData(summonerId) {
    return await riotGet(RIOT_LEAGUE_ENDPOINT + summonerId);
}

async function getSpectatorData(summonerId) {
    return await riotGet(RIOT_SPECTATOR_ENDPOINT + summonerId);
}

async function riotGet(url) {
    let riotResponse = new RiotResponse();

    const response = await httpGet(RIOT_SERVER_URL + url, OPTIONS);

    riotResponse.data = response.data;
    riotResponse.error = response.error;
    if (response.status === 200) {
        riotResponse.success = true;
    } else if (response.status === 404) {
        riotResponse.notFound = true;
    } else if (response.status === 429) {
        riotResponse.rateLimitExceeded = true;
    }

    return riotResponse;
}

module.exports = { getSummonerData, getLeagueData, getSpectatorData };
