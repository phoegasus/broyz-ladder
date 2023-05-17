const {
    removeFromMainLadder,
    getMainLadder,
} = require("../ladder/ladderPersistence");
const { log, logOk } = require("../utils/log");
const { sendMessage } = require("../discord/message");
const {
    INVALID_SUMMONER_NAME,
    REMOVED_FROM_LADDER,
    SUMMONER_NOT_IN_LADDER,
} = require("../data/strings");
const util = require("util");

const syntax = /^!untrack .+/;

async function process(message) {
    log(`untrack.process(${message.content})`);

    let command = message.content.split(" ");
    command.splice(0, 1);
    const name = command.join(" ");
    if (!name || name.length == 0) {
        sendMessage([message.channel.name], INVALID_SUMMONER_NAME);
        return;
    }

    if (
        getMainLadder().every(
            (summoner) => summoner.name.toLowerCase() != name.toLowerCase()
        )
    ) {
        sendMessage(
            [message.channel.name],
            util.format(SUMMONER_NOT_IN_LADDER, name)
        );
        return;
    }

    untrackSummoner(name, message.channel.name);
}

function untrackSummoner(summonerName, messageChannel) {
    removeFromMainLadder(summonerName);
    logOk(`Removed ${summonerName} from ladder`);
    sendMessage(
        [messageChannel],
        util.format(REMOVED_FROM_LADDER, summonerName)
    );
}

module.exports = { process, syntax };
