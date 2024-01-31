const RIOT_SERVER_URL = "https://{cluster}.api.riotgames.com";
const RIOT_SUMMONER_ENDPOINT = "/lol/summoner/v4/summoners/by-puuid/{puuid}";
const RIOT_ACCOUNT_ENDPOINT =
  "/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}";
const RIOT_LEAGUE_ENDPOINT = "/lol/league/v4/entries/by-summoner/{summonerId}";
const RIOT_SPECTATOR_ENDPOINT =
  "/lol/spectator/v4/active-games/by-summoner/{summonerId}";

module.exports = {
  RIOT_SERVER_URL,
  RIOT_SUMMONER_ENDPOINT,
  RIOT_ACCOUNT_ENDPOINT,
  RIOT_LEAGUE_ENDPOINT,
  RIOT_SPECTATOR_ENDPOINT,
};
