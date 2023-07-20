const { showLadder } = require("./ladderPrinting");
const { update } = require("./ladderUpdate");
const { UPDATE_CHANNELS, BOT_UPDATE_INTERVAL } = process.env;
let {
    setLadderLastState,
    getLadderLastState,
    getMainLadder,
    persistMainLadder,
} = require("./ladderPersistence");
const { LADDER_UPDATE } = require("../data/strings");
const { now } = require("../utils/date");

global.nextUpdate = BOT_UPDATE_INTERVAL;

async function initLadderUpdateLoop() {
    loopUpdateAndShowLadder();
}

async function loopUpdateAndShowLadder() {
    try {
        await updateAndShowLadder(now());
    } catch (error) {
        throw error;
    } finally {
        setTimeout(() => loopUpdateAndShowLadder(), global.nextUpdate);
        global.nextUpdate = BOT_UPDATE_INTERVAL;
    }
}

async function updateAndShowLadder(now) {
    await update(now);
    let mainLadder = getMainLadder();
    let ladderLastStateString = JSON.stringify(
        copyLadderAndRemoveLastUpdated(getLadderLastState())
    );
    let ladderString = JSON.stringify(
        copyLadderAndRemoveLastUpdated(mainLadder)
    );
    if (
        ladderLastStateString !== ladderString ||
        mainLadder.some((summoner) => summoner.new)
    ) {
        showLadder(mainLadder, UPDATE_CHANNELS.split(","), LADDER_UPDATE);
        mainLadder
            .filter((summoner) => summoner.new)
            .forEach((summoner) => (summoner.new = false));
        setLadderLastState(JSON.parse(ladderString));
        persistMainLadder();
    }
}

function copyLadderAndRemoveLastUpdated(ladder) {
    return ladder
        .slice()
        .map((summoner) => copySummonerAndRemoveLastUpdated(summoner));
}

function copySummonerAndRemoveLastUpdated(summoner) {
    let summonerCopy = JSON.parse(JSON.stringify(summoner));
    delete summonerCopy.lastUpdated;
    return summonerCopy;
}

module.exports = { initLadderUpdateLoop };
