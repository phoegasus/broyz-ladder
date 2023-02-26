const {
    addToMainLadder,
    getMainLadder,
} = require("../ladder/ladderPersistence");
const { ROLES } = require("../data/roles");
const { log, logOk } = require("../utils/log");
const { sendMessage } = require("../discord/message");
const { isRoleSynonym, getRoleForSynonym } = require("../league/role");
const { getSummonerData } = require("../http/riot");
const {
    INVALID_SUMMONER_NAME,
    INVALID_ROLE,
    RATE_LIMIT_EXCEEDED,
    ADDED_TO_LADDER,
    SUMMONER_ALREADY_IN_LADDER,
} = require("../data/strings");
const util = require("util");

const syntax = /^!track .+,.+$/;

async function process(message) {
    log(`track.process(${message.content})`);

    let command = message.content.split(" ");
    command.splice(0, 1);
    let summoner = command.join(" ").toLowerCase().split(",");
    const name = summoner[0];
    const role = summoner[1];
    if (!name || name.length == 0) {
        sendMessage([message.channel.name], INVALID_SUMMONER_NAME);
        return;
    }
    if (
        !role ||
        role.length == 0 ||
        (!ROLES.includes(role.toUpperCase()) &&
            !isRoleSynonym(role.toUpperCase()))
    ) {
        sendMessage([message.channel.name], INVALID_ROLE);
        return;
    }

    const response = await getSummonerData(name);

    if (response.success !== true) {
        if (response.rateLimitExceeded === true) {
            sendMessage([message.channel.name], RATE_LIMIT_EXCEEDED);
        } else {
            sendMessage([message.channel.name], INVALID_SUMMONER_NAME);
        }
        return;
    }

    const summonerData = {
        name: response.data.name,
        id: response.data.id,
        puuid: response.data.puuid,
        new: true,
    };

    if (getMainLadder().some((summoner) => summoner.id == summonerData.id)) {
        sendMessage(
            [message.channel.name],
            util.format(SUMMONER_ALREADY_IN_LADDER, summonerData.name)
        );
        return;
    }

    if (ROLES.includes(role.toUpperCase())) {
        summonerData.role = role.toUpperCase();
        trackSummoner(summonerData, message.channel.name);
    } else if (isRoleSynonym(role.toUpperCase())) {
        summonerData.role = getRoleForSynonym(role.toUpperCase());
        trackSummoner(summonerData, message.channel.name);
    } else {
        sendMessage([message.channel.name], INVALID_ROLE);
    }
}

function trackSummoner(summoner, messageChannel) {
    addToMainLadder(summoner);
    logOk(`Added ${summoner.name} to ladder`);
    sendMessage([messageChannel], util.format(ADDED_TO_LADDER, summoner.name));
}

module.exports = { process, syntax };
