const { showLadder } = require("./ladderPrinting.js");
const { BOT_UPDATE_INTERVAL } = require("../data/config.js");
const { update, updateAllSummonerData } = require("./ladderUpdate.js");
const { UPDATE_CHANNELS } = process.env;
let { ladderLastState, mainLadder } = require("./ladderPersistence.js");

const updateChannels = UPDATE_CHANNELS.split(",");

global.nextUpdate = BOT_UPDATE_INTERVAL;

async function initLadderUpdateLoop() {
    await updateAllSummonerData();
    loopUpdateAndShowLadder();
}

async function loopUpdateAndShowLadder() {
    await updateAndShowLadder();
    setTimeout(() => loopUpdateAndShowLadder(), global.nextUpdate);
    global.nextUpdate = BOT_UPDATE_INTERVAL;
}

async function updateAndShowLadder() {
    let tempLadderLastState = JSON.parse(JSON.stringify(mainLadder));
    let updateOk = await update();
    if (updateOk) {
        ladderLastState = tempLadderLastState;

        let ladderLastStateString = JSON.stringify(ladderLastState);
        let ladderString = JSON.stringify(mainLadder);
        if (ladderLastStateString !== ladderString) {
            showLadder(mainLadder, updateChannels, "Ladder Update");
        }
    }
}

module.exports = { initLadderUpdateLoop, ladderLastState };
