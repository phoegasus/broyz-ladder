const { showLadder } = require("./ladderPrinting");
const { BOT_UPDATE_INTERVAL } = require("../data/config");
const { update } = require("./ladderUpdate");
const { UPDATE_CHANNELS } = process.env;
let {
    setLadderLastState,
    getLadderLastState,
    getMainLadder,
} = require("./ladderPersistence");
const { LADDER_UPDATE } = require("../data/strings");

global.nextUpdate = BOT_UPDATE_INTERVAL;

async function initLadderUpdateLoop() {
    loopUpdateAndShowLadder();
}

async function loopUpdateAndShowLadder() {
    await updateAndShowLadder();
    setTimeout(() => loopUpdateAndShowLadder(), global.nextUpdate);
    global.nextUpdate = BOT_UPDATE_INTERVAL;
}

async function updateAndShowLadder() {
    let mainLadder = getMainLadder();
    let tempLadderLastState = JSON.parse(JSON.stringify(mainLadder));
    let updateOk = await update();
    if (updateOk) {
        let ladderLastStateString = JSON.stringify(getLadderLastState());
        setLadderLastState(tempLadderLastState);
        let ladderString = JSON.stringify(mainLadder);
        if (ladderLastStateString !== ladderString) {
            showLadder(mainLadder, UPDATE_CHANNELS.split(","), LADDER_UPDATE);
        }
    }
}

module.exports = { initLadderUpdateLoop };
