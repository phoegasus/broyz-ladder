const { httpGet } = require("./http");
const {
  RIOT_SERVER_URL,
  RIOT_SUMMONER_ENDPOINT,
  RIOT_LEAGUE_ENDPOINT,
  RIOT_SPECTATOR_ENDPOINT,
  RIOT_ACCOUNT_ENDPOINT,
} = require("../data/riotapi");
const { placeholder } = require("../utils/urlPlaceholder");
const { log } = require("../utils/log");
const { RIOT_TOKEN, RIOT_ACCOUNT_CLUSTER, LEAGUE_API_CLUSTER } = process.env;

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

async function getRiotAccountData(gameName, tagLine) {
  return await riotGet(
    RIOT_ACCOUNT_ENDPOINT.replace(placeholder("gameName"), gameName).replace(
      placeholder("tagLine"),
      tagLine
    ),
    RIOT_ACCOUNT_CLUSTER
  );
}

async function getSummonerData(puuid) {
  return await riotGet(
    RIOT_SUMMONER_ENDPOINT.replace(placeholder("puuid"), puuid),
    LEAGUE_API_CLUSTER
  );
}

async function getLeagueData(summonerId) {
  return await riotGet(
    RIOT_LEAGUE_ENDPOINT.replace(placeholder("summonerId"), summonerId),
    LEAGUE_API_CLUSTER
  );
}

async function getSpectatorData(summonerId) {
  return await riotGet(
    RIOT_SPECTATOR_ENDPOINT.replace(placeholder("summonerId"), summonerId),
    LEAGUE_API_CLUSTER
  );
}

async function riotGet(url, cluster) {
  let riotResponse = new RiotResponse();

  const response = await httpGet(
    RIOT_SERVER_URL.replace(placeholder("cluster"), cluster) + url,
    OPTIONS
  );

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

module.exports = {
  getSummonerData,
  getLeagueData,
  getSpectatorData,
  getRiotAccountData,
};
