const { TIERS, DIVIDED_TIERS, RANKS } = require("../data/ranks");

function isRanked(summoner) {
    return summoner.rank && summoner.tier;
}

function compareSummonersRanks(summoner1, summoner2) {
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

    let change =
        (TIERS.indexOf(summonerNew.tier) - TIERS.indexOf(summonerOld.tier)) *
        -1 *
        getLPChangeFromTier(summonerNew.tier, summonerOld.tier);
    change +=
        (RANKS.indexOf(summonerNew.rank) - RANKS.indexOf(summonerOld.rank)) *
        -100;
    change += summonerNew.leaguePoints - summonerOld.leaguePoints;

    return change;
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

module.exports = { getLPChange, compareSummonersRanks };
