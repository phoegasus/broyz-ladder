const { addToMainLadder } = require("../ladder/ladderPersistence");
const { ROLES } = require("../data/roles");
const { log, logOk } = require("../utils/log");
const { sendMessage } = require("../utils/discord/message");
const { isRoleSynonym, getRoleForSynonym } = require("../utils/league/role");

const syntax = /^!track .+,.+$/;

async function process(message) {
    log(`track.process(${message.content})`);

    let command = message.content.split(" ");
    command.splice(0, 1);
    let summoner = command.join(" ").toLowerCase().split(",");
    const name = summoner[0];
    const role = summoner[1];
    if (!name || name.length == 0) {
        sendMessage([message.channel.name], "Invalid summoner name");
        return;
    }
    if (!role || role.length == 0 || !ROLES.includes(role.toUpperCase())) {
        sendMessage([message.channel.name], "Invalid role");
        return;
    }

    // TODO: validate summoner name

    if (ROLES.includes(role.toUpperCase())) {
        trackSummoner(
            { name: name, role: role.toUpperCase() },
            message.channel.name
        );
    } else if (isRoleSynonym(role.toUpperCase())) {
        trackSummoner(
            {
                name: name,
                role: getRoleForSynonym(role).toUpperCase(),
            },
            message.channel.name
        );
    } else {
        sendMessage(message.channel.name, "Invalid role");
    }
}

function trackSummoner(summoner, messageChannel) {
    addToMainLadder(summoner);
    logOk(`Added ${summoner.name} to ladder`);
    sendMessage(
        [messageChannel],
        `${summoner.name} has been added to the ladder.`
    );
}

module.exports = { process, syntax };
