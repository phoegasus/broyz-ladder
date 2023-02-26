const { showLadder } = require("./ladderPrinting");
const { BOT_UPDATE_INTERVAL } = require("../data/config");
const { update } = require("./ladderUpdate");
const { UPDATE_CHANNELS } = process.env;
let {
    setLadderLastState,
    getLadderLastState,
    getMainLadder,
    persistMainLadder,
} = require("./ladderPersistence");
const { LADDER_UPDATE } = require("../data/strings");

global.nextUpdate = BOT_UPDATE_INTERVAL;

async function initLadderUpdateLoop() {
    loopUpdateAndShowLadder();
}

async function loopUpdateAndShowLadder() {
    updateAndShowLadder();
    setTimeout(() => loopUpdateAndShowLadder(), global.nextUpdate);
    global.nextUpdate = BOT_UPDATE_INTERVAL;
}

async function updateAndShowLadder() {
    let mainLadder = getMainLadder();
    let updateOk = await update();
    if (updateOk) {
        let ladderLastStateString = JSON.stringify(getLadderLastState());
        let ladderString = JSON.stringify(mainLadder);
        if (
            ladderLastStateString !== ladderString ||
            mainLadder.some((summoner) => summoner.new)
        ) {
            mainLadder
                .filter((summoner) => summoner.new)
                .forEach((summoner) => (summoner.new = false));
            setLadderLastState(mainLadder);
            persistMainLadder();
            showLadder(mainLadder, UPDATE_CHANNELS.split(","), LADDER_UPDATE);
        }
    }
}

module.exports = { initLadderUpdateLoop };
